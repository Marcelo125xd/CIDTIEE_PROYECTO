#!/usr/bin/env node
/**
 * Valida la capa editorial con Zod y genera el JSON público que consume la API.
 *
 * Entradas: data/editorial/content.mjs
 *           data/editorial/archive.mjs
 * Salidas:  data/curated/content.json
 * Reportes: data/reports/content-report.json
 *           data/reports/archive-report.json
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const PUBLICATION_SUBSECTION = {
  revista: "revistas",
  "revista-nacional": "revistas",
  congreso: "congresos",
  capitulo: "otras",
  preprint: "otras",
};

const SEMINAR_SUBSECTION = {
  realizado: "anteriores",
  proximo: "proximos",
  "en-organizacion": "proximos",
};

const PROJECT_SUBSECTION = {
  "en-curso": "vigentes",
  "en-preparacion": "en-evaluacion",
  "en-evaluacion": "en-evaluacion",
  finalizado: "terminados",
};

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

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

function firstSentence(text, maxLength = 220) {
  const clean = String(text ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;

  const slice = clean.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 120 ? lastSpace : maxLength;
  return `${slice.slice(0, cut).trim()}…`;
}

function authorLine(authors) {
  if (authors.length === 0) return "";
  if (authors.length <= 4) return authors.join(", ");
  return `${authors.slice(0, 4).join(", ")} y ${authors.length - 4} más`;
}

function dateLabel(iso) {
  if (!iso) return null;
  const date = new Date(`${iso.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return dateFormatter.format(date);
}

function asset(id, label, url, description, extra = {}) {
  return {
    id,
    label,
    kind: "enlace",
    url,
    source: "externo",
    ...(description ? { description } : {}),
    preview: "ninguna",
    download: false,
    ...extra,
  };
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

function buildArchive(editorial, archiveEditorial, shared) {
  const {
    ArchiveSchema,
    PUBLICATION_TYPE_LABELS,
    PUBLICATION_STATUS_LABELS,
    SEMINAR_STATUS_LABELS,
    PROJECT_TYPE_LABELS,
    PROJECT_STATUS_LABELS,
    BECA_KIND_LABELS,
    BECA_STATUS_LABELS,
  } = shared;

  const sections = [...archiveEditorial.archiveSections]
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      ...section,
      subsections: [...section.subsections].sort((a, b) => a.order - b.order),
    }));

  const sectionBySlug = new Map(sections.map((section) => [section.slug, section]));
  const subsectionOrder = new Map();
  for (const section of sections) {
    for (const subsection of section.subsections) {
      subsectionOrder.set(`${section.slug}/${subsection.slug}`, subsection.order);
    }
  }

  const areaNames = new Map(editorial.areas.map((area) => [area.id, area.name]));
  const items = [];
  const warnings = [];
  const unclassified = [];
  const overridesUsed = [];

  function addItem(item, sourceLabel) {
    const section = sectionBySlug.get(item.section);
    if (!section) {
      warnings.push(`${sourceLabel}: sección inexistente "${item.section}"`);
      return;
    }
    if (!section.subsections.some((subsection) => subsection.slug === item.subsection)) {
      warnings.push(
        `${sourceLabel}: subsección inexistente "${item.section}/${item.subsection}"`,
      );
      return;
    }
    items.push(item);
  }

  /* Publicaciones ---------------------------------------------------- */

  for (const publication of editorial.publications) {
    const typeLabel = PUBLICATION_TYPE_LABELS[publication.type] ?? publication.type;
    const status = publication.status ?? "publicado";
    const statusLabel = PUBLICATION_STATUS_LABELS[status] ?? status;
    const areaLabels = publication.areaIds
      .map((areaId) => areaNames.get(areaId))
      .filter(Boolean);

    const assets = [];
    if (publication.url) {
      assets.push(
        asset(
          `${publication.id}-texto-completo`,
          "Texto completo",
          publication.url,
          "Acceso al registro editorial de la publicación.",
        ),
      );
    } else if (publication.doi) {
      assets.push(
        asset(
          `${publication.id}-doi`,
          "DOI",
          `https://doi.org/${publication.doi}`,
          "Acceso al documento a través del DOI.",
        ),
      );
    }

    const facts = [
      { label: "Tipo", value: typeLabel },
      { label: "Medio", value: publication.venue },
      { label: "Año", value: String(publication.year) },
      { label: "Estado", value: statusLabel },
    ];
    if (publication.doi) facts.push({ label: "DOI", value: publication.doi });
    if (areaLabels.length > 0) facts.push({ label: "Áreas", value: areaLabels.join(", ") });

    addItem(
      {
        id: `archive-publicaciones-${publication.id}`,
        slug: publication.id,
        section: "publicaciones",
        subsection: PUBLICATION_SUBSECTION[publication.type] ?? "otras",
        kind: "publicacion",
        title: publication.title,
        summary: `${typeLabel} en ${publication.venue} (${publication.year}). ${authorLine(publication.authors)}.`,
        body: publication.abstract
          ? [publication.abstract]
          : [
              `Registro bibliográfico de ${typeLabel.toLowerCase()} publicado en ${publication.venue} en ${publication.year}. La ficha conserva los datos de autoría, el medio y el acceso a la fuente cuando está disponible.`,
            ],
        year: publication.year,
        date: null,
        endDate: null,
        status: statusLabel,
        authors: publication.authors,
        tags: [typeLabel, ...areaLabels],
        facts,
        assets,
        href: `/observatorio/publicaciones?q=${encodeURIComponent(publication.title)}`,
        origin: "portal",
        sourceId: publication.id,
        featured: Boolean(publication.featured),
        classification: { method: "curado", confidence: 1, rule: "publication-type" },
      },
      `publications/${publication.id}`,
    );
  }

  /* Seminarios ------------------------------------------------------- */

  for (const seminar of editorial.seminars) {
    const statusLabel = SEMINAR_STATUS_LABELS[seminar.status] ?? seminar.status;
    const facts = [];
    if (seminar.edition) facts.push({ label: "Edición", value: String(seminar.edition) });
    facts.push({ label: "Año", value: String(seminar.year) });
    const seminarDate = dateLabel(seminar.date);
    if (seminarDate) facts.push({ label: "Fecha", value: seminarDate });
    if (seminar.location) facts.push({ label: "Lugar", value: seminar.location });
    if (seminar.speakers.length > 0) {
      facts.push({ label: "Expositores", value: seminar.speakers.join(", ") });
    }
    facts.push({ label: "Estado", value: statusLabel });

    const assets = [];
    if (seminar.registrationUrl) {
      assets.push(
        asset(`${seminar.id}-inscripcion`, "Inscripción", seminar.registrationUrl, null),
      );
    }
    if (seminar.programUrl) {
      assets.push(asset(`${seminar.id}-programa`, "Programa", seminar.programUrl, null));
    }
    if (seminar.materialUrl) {
      assets.push(asset(`${seminar.id}-material`, "Material", seminar.materialUrl, null));
    }

    addItem(
      {
        id: `archive-seminarios-${seminar.id}`,
        slug: seminar.slug,
        section: "seminarios",
        subsection: SEMINAR_SUBSECTION[seminar.status] ?? "anteriores",
        kind: "seminario",
        title: seminar.title,
        summary: firstSentence(seminar.description),
        body: [seminar.description],
        year: seminar.year,
        date: seminar.date ?? null,
        endDate: seminar.endDate ?? null,
        status: statusLabel,
        authors: seminar.speakers,
        tags: seminar.topics,
        facts,
        assets,
        href: `/seminarios?q=${encodeURIComponent(seminar.title)}`,
        origin: "portal",
        sourceId: seminar.id,
        featured: Boolean(seminar.featured),
        classification: { method: "curado", confidence: 1, rule: "seminar-status" },
      },
      `seminars/${seminar.id}`,
    );
  }

  /* Proyectos -------------------------------------------------------- */

  for (const project of editorial.projects) {
    const typeLabel = PROJECT_TYPE_LABELS[project.type] ?? project.type;
    const statusLabel = PROJECT_STATUS_LABELS[project.status] ?? project.status;
    const period = project.endYear
      ? `${project.startYear}–${project.endYear}`
      : `${project.startYear}–`;
    const areaLabels = project.areas
      .map((areaId) => areaNames.get(areaId))
      .filter(Boolean);

    const facts = [];
    if (project.code) facts.push({ label: "Código", value: project.code });
    facts.push({ label: "Tipo", value: typeLabel });
    facts.push({ label: "Estado", value: statusLabel });
    facts.push({ label: "Período", value: period });
    if (project.director) facts.push({ label: "Dirección", value: project.director });
    if (project.codirector) facts.push({ label: "Codirección", value: project.codirector });
    if (project.funding) facts.push({ label: "Financiamiento", value: project.funding });
    if (areaLabels.length > 0) facts.push({ label: "Áreas", value: areaLabels.join(", ") });

    const confidence = project.status === "en-preparacion" ? 0.9 : 1;

    addItem(
      {
        id: `archive-proyectos-${project.id}`,
        slug: project.slug,
        section: "proyectos-pid",
        subsection: PROJECT_SUBSECTION[project.status] ?? "vigentes",
        kind: "proyecto",
        title: project.title,
        summary: project.summary,
        body: project.description,
        year: project.startYear,
        date: null,
        endDate: null,
        status: statusLabel,
        authors: [],
        tags: project.tags,
        facts,
        assets: [],
        href: `/observatorio/proyectos/${project.slug}`,
        origin: "portal",
        sourceId: project.id,
        featured: Boolean(project.featured),
        classification: { method: "curado", confidence, rule: "project-status" },
      },
      `projects/${project.id}`,
    );
  }

  /* Becas y convocatorias -------------------------------------------- */

  for (const beca of editorial.becas) {
    const kind = beca.kind ?? "beca";
    const isBeca = kind === "beca";
    const kindLabel = BECA_KIND_LABELS[kind] ?? kind;
    const statusLabel = BECA_STATUS_LABELS[beca.status] ?? beca.status;

    const facts = [
      { label: "Tipo", value: kindLabel },
      { label: "Estado", value: statusLabel },
      { label: "Año", value: String(beca.year) },
    ];
    const opening = dateLabel(beca.opening);
    const closing = dateLabel(beca.closing);
    if (opening) facts.push({ label: "Apertura", value: opening });
    if (closing) facts.push({ label: "Cierre", value: closing });
    facts.push({ label: "Destinatarios", value: beca.audience });
    if (beca.conditions.length > 0) {
      facts.push({ label: "Condiciones", value: beca.conditions.join(" · ") });
    }
    if (beca.contact) facts.push({ label: "Contacto", value: beca.contact });

    const assets = beca.url
      ? [
          asset(
            `${beca.id}-sitio`,
            "Sitio de la convocatoria",
            beca.url,
            "Bases, requisitos y plazos oficiales.",
          ),
        ]
      : [];

    addItem(
      {
        id: `archive-becas-${beca.id}`,
        slug: beca.slug,
        section: isBeca ? "internacionalizacion" : "congresos",
        subsection: isBeca ? "becas" : "llamados",
        kind: isBeca ? "beca" : "convocatoria",
        title: beca.name,
        summary: firstSentence(beca.description),
        body: [beca.description],
        year: beca.year,
        date: beca.opening ?? null,
        endDate: beca.closing ?? null,
        status: statusLabel,
        authors: [],
        tags: [kindLabel, beca.audience],
        facts,
        assets,
        href: `/becas#${beca.slug}`,
        origin: "portal",
        sourceId: beca.id,
        featured: Boolean(beca.featured),
        classification: { method: "curado", confidence: 1, rule: "beca-kind" },
      },
      `becas/${beca.id}`,
    );
  }

  /* Catálogo de congresos, llamados, becas externas y enlaces -------- */

  for (const entry of archiveEditorial.archiveCatalog) {
    const override = archiveEditorial.archiveCatalogOverrides?.[entry.key];
    let section;
    let subsection;
    let kind = entry.kind;
    let classification;

    if (override) {
      section = override.section;
      subsection = override.subsection;
      kind = override.kind ?? kind;
      classification = {
        method: "override",
        confidence: 1,
        rule: `override:${entry.key}`,
      };
      overridesUsed.push(entry.key);
    } else {
      const haystack = [
        entry.title,
        entry.summary,
        entry.kind,
        entry.status ?? "",
        entry.sourceRef ?? "",
        ...(entry.tags ?? []),
      ].join(" ");

      const rule = archiveEditorial.archiveClassificationRules.find((candidate) =>
        candidate.test.test(haystack),
      );

      if (!rule) {
        unclassified.push({
          key: entry.key,
          title: entry.title,
          kind: entry.kind,
          reason: "Ninguna regla de clasificación coincidió.",
        });
        continue;
      }

      section = rule.section;
      subsection = rule.subsection;
      classification = { method: "regla", confidence: 0.85, rule: rule.id };
    }

    const assets = (entry.assets ?? []).map((entryAsset, index) => ({
      id: `${entry.key}-${entryAsset.key ?? index}`,
      label: entryAsset.label,
      kind: entryAsset.kind ?? "enlace",
      url: entryAsset.url,
      source: entryAsset.source ?? "externo",
      ...(entryAsset.description ? { description: entryAsset.description } : {}),
      ...(entryAsset.format ? { format: entryAsset.format } : {}),
      ...(entryAsset.size ? { size: entryAsset.size } : {}),
      preview: entryAsset.preview ?? "ninguna",
      download: Boolean(entryAsset.download),
    }));

    addItem(
      {
        id: `archive-catalogo-${entry.key}`,
        slug: entry.key,
        section,
        subsection,
        kind,
        title: entry.title,
        summary: entry.summary,
        body: entry.body ?? [],
        ...(entry.year ? { year: entry.year } : {}),
        date: entry.date ?? null,
        endDate: entry.endDate ?? null,
        ...(entry.status ? { status: entry.status } : {}),
        authors: entry.authors ?? [],
        tags: entry.tags ?? [],
        facts: entry.facts ?? [],
        assets,
        ...(entry.href ? { href: entry.href } : {}),
        origin: entry.origin ?? "curado",
        sourceId: entry.key,
        featured: Boolean(entry.featured),
        classification,
      },
      `catalog/${entry.key}`,
    );
  }

  /* Orden, duplicados y validación ----------------------------------- */

  const sectionOrder = new Map(sections.map((section, index) => [section.slug, index]));

  items.sort((a, b) => {
    const bySection =
      (sectionOrder.get(a.section) ?? 0) - (sectionOrder.get(b.section) ?? 0);
    if (bySection !== 0) return bySection;

    const bySubsection =
      (subsectionOrder.get(`${a.section}/${a.subsection}`) ?? 0) -
      (subsectionOrder.get(`${b.section}/${b.subsection}`) ?? 0);
    if (bySubsection !== 0) return bySubsection;

    const byYear = (b.year ?? 0) - (a.year ?? 0);
    if (byYear !== 0) return byYear;

    const byDate = (b.date ?? "").localeCompare(a.date ?? "");
    if (byDate !== 0) return byDate;

    return a.title.localeCompare(b.title, "es");
  });

  const duplicateIds = findDuplicates(items, "id");
  if (duplicateIds.length > 0) {
    warnings.push(`archive: ids duplicados (${duplicateIds.join(", ")})`);
  }

  const duplicateSlugs = findDuplicates(
    items,
    (item) => `${item.section}/${item.subsection}/${item.slug}`,
  );
  if (duplicateSlugs.length > 0) {
    warnings.push(`archive: slugs duplicados (${duplicateSlugs.join(", ")})`);
  }

  const emptySubsections = [];
  for (const section of sections) {
    for (const subsection of section.subsections) {
      const count = items.filter(
        (item) => item.section === section.slug && item.subsection === subsection.slug,
      ).length;
      if (count === 0) {
        emptySubsections.push({ section: section.slug, subsection: subsection.slug });
      }
    }
  }

  const archive = {
    intro: archiveEditorial.archiveIntro,
    scopeNotes: archiveEditorial.archiveScopeNotes,
    sections,
    items,
  };

  const parsed = ArchiveSchema.safeParse(archive);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(raíz)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`El Archivo no pasó la validación Zod:\n${details}`);
  }

  const report = {
    valid: true,
    counts: {
      sections: sections.length,
      subsections: sections.reduce((total, section) => total + section.subsections.length, 0),
      items: items.length,
      featured: items.filter((item) => item.featured).length,
      derived: items.filter((item) => item.origin === "portal").length,
      catalog: items.filter((item) => item.origin !== "portal").length,
      bySection: countBy(items, "section"),
      bySubsection: countBy(items, (item) => `${item.section}/${item.subsection}`),
      byKind: countBy(items, "kind"),
      byOrigin: countBy(items, "origin"),
      byClassification: countBy(items, (item) => item.classification.method),
      emptySubsections,
    },
    sources: {
      publications: editorial.publications.length,
      seminars: editorial.seminars.length,
      projects: editorial.projects.length,
      becas: editorial.becas.length,
      catalog: archiveEditorial.archiveCatalog.length,
    },
    classification: {
      overrides: overridesUsed,
      rules: archiveEditorial.archiveClassificationRules.map((rule) => rule.id),
    },
    review: {
      unclassified,
      candidates: archiveEditorial.archiveReviewCandidates,
      warnings,
    },
  };

  return { archive: parsed.data, report };
}

async function main() {
  const shared = await loadShared();
  const { ContentSchema } = shared;
  const editorial = await import(pathToFileUrl(resolve(root, "data/editorial/content.mjs")));
  const archiveEditorial = await import(
    pathToFileUrl(resolve(root, "data/editorial/archive.mjs"))
  );

  const now = new Date().toISOString();
  const { archive, report: archiveReport } = buildArchive(
    editorial,
    archiveEditorial,
    shared,
  );

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
    archiveSections: archive.sections.length,
    archiveItems: archive.items.length,
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
    archive,
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
  const archiveReportPath = resolve(root, "data/reports/archive-report.json");

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
      archiveSection: archiveReport.counts.bySection,
      archiveKind: archiveReport.counts.byKind,
    },
    archive: {
      counts: archiveReport.counts,
      review: archiveReport.review,
      classification: archiveReport.classification,
    },
    warnings,
  };

  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await writeFile(
    archiveReportPath,
    `${JSON.stringify({ generatedAt: now, ...archiveReport }, null, 2)}\n`,
    "utf8",
  );

  console.log("✓ Contenido validado y generado");
  console.log(`  ${curatedPath}`);
  console.log(`  ${reportPath}`);
  console.log(`  ${archiveReportPath}`);
  console.log(
    `  ${counts.projects} proyectos · ${counts.publications} publicaciones · ${counts.seminars} seminarios · ${counts.people} personas`,
  );
  console.log(
    `  Archivo: ${counts.archiveItems} registros en ${archiveReport.counts.subsections} subsecciones de ${counts.archiveSections} secciones`,
  );
  if (archiveReport.review.unclassified.length > 0) {
    console.log(
      `  ${archiveReport.review.unclassified.length} registro(s) del catálogo sin clasificar — ver archive-report.json`,
    );
  }
  if (warnings.length > 0) {
    console.log(`  ${warnings.length} advertencia(s) — ver content-report.json`);
  }
}

main().catch((error) => {
  console.error("✗ Error generando el contenido:", error);
  process.exitCode = 1;
});
