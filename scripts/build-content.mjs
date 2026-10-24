#!/usr/bin/env node
/**
 * Valida la capa editorial con Zod y genera el JSON público que consume la API.
 *
 * Entrada:  data/editorial/content.mjs
 * Salida:   data/curated/content.json
 * Reporte:  data/reports/content-report.json
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function loadShared() {
  const candidates = [
    resolve(root, "packages/shared/dist/index.js"),
    resolve(root, "node_modules/@cidtiee/shared/dist/index.js"),
  ];

  for (const candidate of candidates) {
    try {
      return await import(pathToFileUrl(candidate));
    } catch {
      // Probamos el siguiente candidato.
    }
  }

  throw new Error(
    "No se encontró @cidtiee/shared compilado. Ejecutá `npm run build:shared` antes de generar el contenido.",
  );
}

function pathToFileUrl(path) {
  return new URL(`file:///${path.replaceAll("\\", "/")}`).href;
}

function countBy(items, key) {
  const result = {};
  for (const item of items) {
    const value = typeof key === "function" ? key(item) : item[key];
    const label = value ?? "sin-dato";
    result[label] = (result[label] ?? 0) + 1;
  }
  return result;
}

function findDuplicates(items, key) {
  const seen = new Map();
  const duplicates = [];
  for (const item of items) {
    const value = typeof key === "function" ? key(item) : item[key];
    if (seen.has(value)) {
      duplicates.push(value);
    } else {
      seen.set(value, true);
    }
  }
  return [...new Set(duplicates)];
}

function buildWarnings(content) {
  const warnings = [];

  for (const [name, items] of Object.entries({
    areas: content.areas,
    services: content.services,
    projects: content.projects,
    publications: content.publications,
    seminars: content.seminars,
    becas: content.becas,
    people: content.people,
    news: content.news,
    resources: content.resources,
    calendar: content.calendar,
  })) {
    if (findDuplicates(items, "id").length > 0) {
      warnings.push(`${name}: ids duplicados (${findDuplicates(items, "id").join(", ")})`);
    }
  }

  const projectSlugs = findDuplicates(content.projects, "slug");
  if (projectSlugs.length > 0) {
    warnings.push(`projects: slugs duplicados (${projectSlugs.join(", ")})`);
  }

  for (const project of content.projects) {
    if (project.endYear && project.endYear < project.startYear) {
      warnings.push(
        `projects: ${project.slug} termina antes de comenzar (${project.startYear}–${project.endYear})`,
      );
    }
    if (project.status === "en-curso" && !project.endYear) {
      warnings.push(`projects: ${project.slug} está en curso pero no tiene año de fin`);
    }
  }

  for (const publication of content.publications) {
    if (!publication.url && !publication.doi) {
      warnings.push(`publications: ${publication.id} no tiene DOI ni URL`);
    }
  }

  for (const seminar of content.seminars) {
    if (seminar.status === "realizado" && !seminar.date) {
      warnings.push(`seminars: ${seminar.slug} figura realizado sin fecha exacta`);
    }
  }

  for (const beca of content.becas) {
    if (beca.status === "abierta" && beca.closing && new Date(beca.closing) < new Date()) {
      warnings.push(`becas: ${beca.slug} está abierta pero su cierre ya pasó`);
    }
  }

  return warnings;
}

async function main() {
  const { ContentSchema } = await loadShared();
  const editorial = await import(pathToFileUrl(resolve(root, "data/editorial/content.mjs")));

  const now = new Date().toISOString();

  const counts = {
    areas: editorial.areas.length,
    services: editorial.services.length,
    cases: editorial.cases.length,
    production: editorial.production.length,
    projects: editorial.projects.length,
    publications: editorial.publications.length,
    seminars: editorial.seminars.length,
    becas: editorial.becas.length,
    people: editorial.people.length,
    news: editorial.news.length,
    resources: editorial.resources.length,
    calendar: editorial.calendar.length,
  };

  const content = {
    meta: {
      version: "1.0.0",
      generatedAt: now,
      source: "data/editorial/content.mjs",
      provider: "local-json",
      counts,
    },
    site: editorial.site,
    areas: editorial.areas,
    services: editorial.services,
    cases: editorial.cases,
    production: editorial.production,
    projects: editorial.projects,
    publications: editorial.publications,
    seminars: editorial.seminars,
    becas: editorial.becas,
    people: editorial.people,
    news: editorial.news,
    resources: editorial.resources,
    calendar: editorial.calendar,
  };

  const parsed = ContentSchema.safeParse(content);

  if (!parsed.success) {
    console.error("✗ El contenido editorial no pasó la validación Zod:\n");
    for (const issue of parsed.error.issues) {
      console.error(`  - ${issue.path.join(".") || "(raíz)"}: ${issue.message}`);
    }
    process.exitCode = 1;
    return;
  }

  const warnings = buildWarnings(parsed.data);

  const curatedPath = resolve(root, "data/curated/content.json");
  const reportPath = resolve(root, "data/reports/content-report.json");

  await mkdir(dirname(curatedPath), { recursive: true });
  await mkdir(dirname(reportPath), { recursive: true });

  await writeFile(curatedPath, `${JSON.stringify(parsed.data, null, 2)}\n`, "utf8");

  const report = {
    generatedAt: now,
    valid: true,
    counts,
    distributions: {
      projectStatus: countBy(parsed.data.projects, "status"),
      projectType: countBy(parsed.data.projects, "type"),
      publicationType: countBy(parsed.data.publications, "type"),
      publicationYear: countBy(parsed.data.publications, "year"),
      seminarYear: countBy(parsed.data.seminars, "year"),
      becaStatus: countBy(parsed.data.becas, "status"),
      personCategory: countBy(parsed.data.people, "category"),
      calendarType: countBy(parsed.data.calendar, "type"),
    },
    warnings,
  };

  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log("✓ Contenido validado y generado");
  console.log(`  ${curatedPath}`);
  console.log(`  ${reportPath}`);
  console.log(
    `  ${counts.projects} proyectos · ${counts.publications} publicaciones · ${counts.seminars} seminarios · ${counts.people} personas`,
  );
  if (warnings.length > 0) {
    console.log(`  ${warnings.length} advertencia(s) — ver content-report.json`);
  }
}

main().catch((error) => {
  console.error("✗ Error generando el contenido:", error);
  process.exitCode = 1;
});
