#!/usr/bin/env node
/**
 * ETL de inventario y saneamiento del export de Notion.
 *
 * No publica el export: genera un extracto sanitizado para revisión editorial
 * y un reporte con conteos, descartes y hallazgos sensibles.
 *
 * Entrada:  contexto_cidtiee/<export de Notion>/  (ignorado por git)
 * Salida:   data/generated/extracted.json
 * Reporte:  data/reports/etl-report.json
 */

import { readdir, readFile, stat, mkdir, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const exportRoot = process.env.NOTION_EXPORT_DIR
  ? resolve(process.env.NOTION_EXPORT_DIR)
  : resolve(root, "contexto_cidtiee");

const JUNK_ROW = /^(card|tarjeta)\s*\d+$|^sin\s*t[ií]tulo$|^untitled$|^\s*$/i;

const INTERNAL_PATTERNS = [
  /reuni[oó]n/i,
  /tareas?\b/i,
  /plan\s+maestro/i,
  /plan\s+de\b/i,
  /finanz/i,
  /factura/i,
  /cuit/i,
  /cbu/i,
  /estudiante/i,
  /beca\s+binid/i,
  /cittie/i,
  /argencon/i,
  /clagtee/i,
  /congreso/i,
  /paper\b/i,
  /diplomatura/i,
  /gesti[oó]n\s+energ/i,
  /instalac/i,
  /memoria/i,
  /elecci[oó]n/i,
  /responsabilidad/i,
  /situaci[oó]n/i,
  /herramientas/i,
  /calendario/i,
  /base\s+datos/i,
  /repositorio/i,
  /instagram/i,
  /linkedin/i,
  /researchgate/i,
  /preprints/i,
  /medios/i,
  /recursos\s+del\s+centro/i,
  /[aá]rbol/i,
  /gtd/i,
  /categorizaci[oó]n/i,
  /tareas\s+por\s+rol/i,
  /criterios/i,
];

const ENTITY_PATTERNS = [
  /^pid\b/i,
  /^pific\b/i,
  /^picto\b/i,
  /^cba\b/i,
  /^proyectos?-pid/i,
  /^publicaciones\b/i,
  /^seminario/i,
  /^beca\b/i,
  /^investigadores\b/i,
  /^recursos\s+humanos/i,
  /^areas?\s+de\s+investigaci[oó]n/i,
  /^observatorio/i,
  /^transferencia/i,
  /^capacitaciones/i,
  /^p[aá]gina\s+web/i,
];

const CONTENT_INTERNAL_PATTERNS = [
  /^\s*[-*]\s+\[[ xX]\]/m,
  /\b(?:cbu|cuit|factur\w*|vi[aá]ticos?|legajo|contrase[nñ]a|password|token|api[_-]?key)\b/i,
  /\balumnos?\s+en\s+investigaci[oó]n/i,
  /\bcriterios?\s+para\s+seleccionar\s+estudiantes/i,
  /\bestados?\s+de\s+los\s+estudiantes/i,
  /\b(?:adelanto|reintegro)\b[\s\S]{0,120}\b(?:pago|factura|inscripci[oó]n)\b/i,
  /\balumnos?\b[\s\S]{0,120}\b(?:correcciones|notas|recomendaciones|legajo|entrega)\b/i,
  /\b(?:correcciones|notas|recomendaciones|legajo|entrega)\b[\s\S]{0,160}\balumnos?\b/i,
  /\bestudiantes?\b[\s\S]{0,120}\b(?:legajo|correcciones|notas)\b/i,
];

const SENSITIVE_PATTERNS = [
  { key: "cuit", regex: /\b(?:20|23|24|27|30|33|34)[- ]?\d{8}[- ]?\d\b/g },
  { key: "cbu", regex: /\b\d{22}\b/g },
  { key: "credencial", regex: /\b(?:password|passwd|contrase[nñ]a|token|api[_-]?key|secret)\b/gi },
  { key: "email", regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
];

function toPosix(path) {
  return path.replaceAll("\\", "/");
}

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function findExportDirectory() {
  if (!(await pathExists(exportRoot))) {
    return null;
  }

  const direct = await readdir(exportRoot, { withFileTypes: true });
  const candidates = direct
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(exportRoot, entry.name));

  for (const candidate of candidates) {
    const files = await readdir(candidate, { withFileTypes: true });
    if (files.some((file) => file.isFile() && /^CIDTIEE\b.*\.md$/i.test(file.name))) {
      return candidate;
    }
  }

  return exportRoot;
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((items) => items.some((item) => item.trim() !== ""));
}

function redact(value) {
  let result = String(value ?? "");

  result = result.replace(SENSITIVE_PATTERNS[0].regex, "[dato fiscal omitido]");
  result = result.replace(SENSITIVE_PATTERNS[1].regex, "[dato bancario omitido]");
  result = result.replace(
    SENSITIVE_PATTERNS[2].regex,
    (match) => `${match} [credencial omitida]`,
  );
  result = result.replace(SENSITIVE_PATTERNS[3].regex, (email) => {
    const normalized = email.toLowerCase();
    if (normalized === "cidtiee@gmail.com" || normalized.endsWith("@frc.utn.edu.ar")) {
      return email;
    }
    return "[correo personal omitido]";
  });

  return result.trim();
}

function countSensitive(text) {
  const findings = {};
  for (const { key, regex } of SENSITIVE_PATTERNS) {
    const matches = text.match(regex);
    if (matches) {
      findings[key] = (findings[key] ?? 0) + matches.length;
    }
  }
  return findings;
}

function classifyMarkdown(fileName, text) {
  const clean = basename(fileName).replace(/\.md$/i, "").replace(/\s+[0-9a-f]{32}$/i, "");
  if (INTERNAL_PATTERNS.some((pattern) => pattern.test(clean))) {
    return "internal";
  }
  if (CONTENT_INTERNAL_PATTERNS.some((pattern) => pattern.test(text))) {
    return "internal";
  }
  if (ENTITY_PATTERNS.some((pattern) => pattern.test(clean))) {
    return "entity";
  }
  return "narrative";
}

function extractTitle(text, fileName) {
  const heading = text.match(/^#\s+(.+)$/m);
  if (heading) {
    return redact(heading[1]);
  }
  return redact(
    basename(fileName)
      .replace(/\.md$/i, "")
      .replace(/\s+[0-9a-f]{32}$/i, ""),
  );
}

function extractParagraphs(text) {
  return text
    .split(/\n{2,}/)
    .map((block) =>
      block
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/^>\s?/gm, "")
        .replace(/^[-*]\s+(?:\[[ xX]\]\s*)?/gm, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/\*\*|__|`/g, "")
        .trim(),
    )
    .filter((block) => block.length > 60 && !block.startsWith("|"))
    .map((block) => redact(block))
    .filter(Boolean);
}

function extractLinks(text) {
  const links = [];
  const regex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    links.push({ label: redact(match[1]), url: match[2] });
  }
  return links.slice(0, 20);
}

function extractCodes(text) {
  const codes = new Set();
  const patterns = [
    /\bENT[A-Z]{3}\d{7}TC\b/g,
    /\bPID\s*(?:UTN\s*)?(?:UTI)?\d{4,}\b/gi,
    /\bPID\s*25\/E\d+\b/gi,
    /\bUTI\d{4,}\b/gi,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      codes.add(match[0]);
    }
  }
  return [...codes];
}

function extractStatus(text) {
  const normalized = text.toLowerCase();
  if (/\ben curso\b|\ben proceso\b|\bin progress\b/.test(normalized)) return "en-curso";
  if (/\bfinalizado\b|\bcompleto\b|\bdone\b/.test(normalized)) return "finalizado";
  if (/\ben evaluaci[oó]n\b|\ben espera\b|\bnot started\b/.test(normalized)) return "en-evaluacion";
  if (/\bpendiente\b/.test(normalized)) return "en-preparacion";
  return null;
}

function sanitizeCsvRow(row, headers) {
  const record = {};
  headers.forEach((header, index) => {
    const key = redact(header) || `columna_${index + 1}`;
    record[key] = redact(row[index] ?? "");
  });
  return record;
}

async function main() {
  const exportDirectory = await findExportDirectory();

  if (!exportDirectory) {
    console.warn("⚠ No se encontró el export de Notion en contexto_cidtiee/.");
    console.warn("  El sitio puede generarse igualmente con data/editorial/content.mjs.");
    console.warn("  Para ejecutar el ETL, definí NOTION_EXPORT_DIR o descargá el export.");
    process.exitCode = 0;
    return;
  }

  const allFiles = await walk(exportDirectory);
  const fileStats = await Promise.all(
    allFiles.map(async (file) => ({ file, size: (await stat(file)).size })),
  );

  const byExtension = {};
  for (const { file, size } of fileStats) {
    const extension = extname(file).toLowerCase() || "(sin extensión)";
    byExtension[extension] ??= { files: 0, bytes: 0 };
    byExtension[extension].files += 1;
    byExtension[extension].bytes += size;
  }

  const csvFiles = [];
  const markdownFiles = [];
  const internalPages = [];
  const sensitiveFindings = {};
  const warnings = [];

  for (const { file } of fileStats) {
    const extension = extname(file).toLowerCase();
    const relative = toPosix(file.slice(exportDirectory.length + 1));

    if (extension === ".csv") {
      const raw = (await readFile(file, "utf8")).replace(/^\uFEFF/, "");
      const rows = parseCsv(raw);
      const headers = (rows[0] ?? []).map((header) => redact(header));
      const body = rows.slice(1);
      const valid = body.filter((row) => {
        const first = (row[0] ?? "").trim();
        return !JUNK_ROW.test(first);
      });

      const lowerName = basename(file).toLowerCase();
      let category = "datos";
      let published = true;

      if (/estudiante|alumno/.test(lowerName)) {
        category = "estudiantes";
        published = false;
      } else if (/finanz|factura|cuit|cbu/.test(lowerName)) {
        category = "finanzas";
        published = false;
      } else if (/tarea/.test(lowerName)) {
        category = "tareas";
        published = false;
      } else if (/reuni/.test(lowerName)) {
        category = "reuniones";
        published = false;
      }

      const findings = countSensitive(raw);
      for (const [key, count] of Object.entries(findings)) {
        sensitiveFindings[key] = (sensitiveFindings[key] ?? 0) + count;
      }

      csvFiles.push({
        file: relative,
        category,
        published,
        headers,
        totalRows: body.length,
        validRows: valid.length,
        discardedRows: body.length - valid.length,
        rows: published
          ? valid.slice(0, 200).map((row) => sanitizeCsvRow(row, headers))
          : [],
      });
      continue;
    }

    if (extension !== ".md") {
      continue;
    }

    const text = await readFile(file, "utf8");
    const findings = countSensitive(text);
    for (const [key, count] of Object.entries(findings)) {
      sensitiveFindings[key] = (sensitiveFindings[key] ?? 0) + count;
    }

    const classification = classifyMarkdown(file, text);
    const title = extractTitle(text, file);

    if (classification === "internal") {
      internalPages.push({
        file: relative,
        title,
        reason: "Página operativa, financiera, de reuniones o con datos personales",
      });
      continue;
    }

    markdownFiles.push({
      file: relative,
      title,
      classification,
      status: extractStatus(text),
      codes: extractCodes(text),
      headings: [...text.matchAll(/^#{2,4}\s+(.+)$/gm)]
        .map((match) => redact(match[1]))
        .slice(0, 30),
      paragraphs: extractParagraphs(text).slice(0, 4),
      links: extractLinks(text),
      checkboxes: {
        total: (text.match(/^\s*[-*]\s+\[[ xX]\]/gm) ?? []).length,
        done: (text.match(/^\s*[-*]\s+\[[xX]\]/gm) ?? []).length,
      },
      sensitive: Object.keys(findings).length > 0,
    });
  }

  const entities = markdownFiles.filter((page) => page.classification === "entity");
  const narratives = markdownFiles.filter((page) => page.classification === "narrative");

  const derivedProjects = entities
    .filter((page) => /^PID|^Pific|^PICTO|^CBA|^Proyectos?-PID/i.test(page.title))
    .map((page) => ({
      title: page.title,
      codes: page.codes,
      status: page.status,
      source: page.file,
    }));

  const derivedSeminars = entities
    .filter((page) => /seminario/i.test(page.title) || page.title.includes("Seminario"))
    .map((page) => ({
      title: page.title,
      status: page.status,
      source: page.file,
    }));

  const derivedBecas = entities
    .filter((page) => /beca/i.test(page.title))
    .map((page) => ({
      title: page.title,
      status: page.status,
      source: page.file,
    }));

  const generatedAt = new Date().toISOString();
  const output = {
    meta: {
      generatedAt,
      source: toPosix(exportDirectory),
      files: allFiles.length,
      markdown: markdownFiles.length + internalPages.length,
      csv: csvFiles.length,
    },
    inventory: {
      totalFiles: allFiles.length,
      totalBytes: fileStats.reduce((sum, item) => sum + item.size, 0),
      byExtension,
    },
    markdown: {
      entities,
      narratives,
      internal: internalPages,
    },
    csv: csvFiles,
    derived: {
      projects: derivedProjects,
      seminars: derivedSeminars,
      becas: derivedBecas,
    },
  };

  const extractedPath = resolve(root, "data/generated/extracted.json");
  const reportPath = resolve(root, "data/reports/etl-report.json");

  await mkdir(dirname(extractedPath), { recursive: true });
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(extractedPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  if (csvFiles.some((csv) => csv.discardedRows > 0)) {
    warnings.push("Se descartaron filas basura (Card/Tarjeta/Sin título) en los CSV.");
  }
  if (internalPages.length > 0) {
    warnings.push(
      `${internalPages.length} páginas internas o con datos operativos quedaron fuera del extracto público.`,
    );
  }
  if (Object.keys(sensitiveFindings).length > 0) {
    warnings.push(
      "Se detectaron datos sensibles; fueron redactados en el extracto y no se publican.",
    );
  }
  if (entities.length === 0) {
    warnings.push("No se clasificaron páginas de entidades; revisar los patrones del ETL.");
  }

  const report = {
    generatedAt,
    source: toPosix(exportDirectory),
    inventory: output.inventory,
    counts: {
      markdownTotal: markdownFiles.length + internalPages.length,
      entities: entities.length,
      narratives: narratives.length,
      internal: internalPages.length,
      csv: csvFiles.length,
      csvRows: csvFiles.reduce((sum, csv) => sum + csv.validRows, 0),
      csvDiscarded: csvFiles.reduce((sum, csv) => sum + csv.discardedRows, 0),
    },
    csvByCategory: csvFiles.reduce((result, csv) => {
      result[csv.category] = (result[csv.category] ?? 0) + 1;
      return result;
    }, {}),
    sensitiveFindings,
    warnings,
    note:
      "El extracto sanitizado es material de revisión. La fuente pública del portal es data/editorial/content.mjs.",
  };

  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log("✓ ETL completado");
  console.log(`  Export: ${toPosix(exportDirectory)}`);
  console.log(
    `  ${allFiles.length} archivos · ${entities.length} entidades · ${narratives.length} narrativas · ${internalPages.length} internas`,
  );
  console.log(`  ${extractedPath}`);
  console.log(`  ${reportPath}`);
  if (warnings.length > 0) {
    console.log(`  ${warnings.length} advertencia(s) — ver etl-report.json`);
  }
}

main().catch((error) => {
  console.error("✗ Error en el ETL:", error);
  process.exitCode = 1;
});
