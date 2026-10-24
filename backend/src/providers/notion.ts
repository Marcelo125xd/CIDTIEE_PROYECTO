import {
  ContentSchema,
  type Beca,
  type CalendarEvent,
  type Content,
  type News,
  type Person,
  type Project,
  type Publication,
  type Resource,
  type Seminar,
} from "@cidtiee/shared";
import type { AppConfig } from "../config.js";
import { LocalJsonProvider } from "./local-json.js";

/**
 * Proveedor Notion.
 *
 * Usa la API 2026-03-11 con data sources. Si una base no está configurada
 * (o la consulta falla), conserva el contenido local para esa entidad. De este
 * modo el portal sigue funcionando mientras se migra la información.
 *
 * El esquema de propiedades esperado está documentado en docs/notion.md.
 */

type NotionProperty = {
  id?: string;
  type?: string;
  title?: Array<{ plain_text?: string }>;
  rich_text?: Array<{ plain_text?: string }>;
  select?: { name?: string } | null;
  status?: { name?: string } | null;
  multi_select?: Array<{ name?: string }>;
  number?: number | null;
  date?: { start?: string | null; end?: string | null } | null;
  checkbox?: boolean;
  url?: string | null;
  email?: string | null;
  formula?: { string?: string | null; number?: number | null; boolean?: boolean | null };
  relation?: Array<{ id?: string }>;
  people?: Array<{ name?: string }>;
};

type NotionPage = {
  id: string;
  url?: string;
  properties: Record<string, NotionProperty>;
};

type NotionQueryResponse = {
  results: NotionPage[];
  has_more: boolean;
  next_cursor: string | null;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function findProperty(page: NotionPage, names: string[]): NotionProperty | undefined {
  const wanted = names.map(normalizeKey);
  for (const [key, property] of Object.entries(page.properties)) {
    if (wanted.includes(normalizeKey(key))) return property;
  }
  return undefined;
}

function textFrom(property: NotionProperty | undefined): string {
  if (!property) return "";
  if (property.title) {
    return property.title.map((item) => item.plain_text ?? "").join("").trim();
  }
  if (property.rich_text) {
    return property.rich_text.map((item) => item.plain_text ?? "").join("").trim();
  }
  if (property.select?.name) return property.select.name.trim();
  if (property.status?.name) return property.status.name.trim();
  if (property.url) return property.url.trim();
  if (property.email) return property.email.trim();
  if (property.formula?.string) return property.formula.string.trim();
  if (typeof property.number === "number") return String(property.number);
  if (typeof property.formula?.number === "number") return String(property.formula.number);
  return "";
}

function richTextOf(page: NotionPage, names: string[]) {
  return textFrom(findProperty(page, names));
}

function selectOf(page: NotionPage, names: string[]) {
  return textFrom(findProperty(page, names));
}

function multiOf(page: NotionPage, names: string[]) {
  const property = findProperty(page, names);
  if (!property) return [];
  if (property.multi_select) {
    return property.multi_select.map((item) => item.name ?? "").filter(Boolean);
  }
  const text = textFrom(property);
  return text
    .split(/[;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function numberFrom(page: NotionPage, names: string[]) {
  const property = findProperty(page, names);
  if (!property) return undefined;
  if (typeof property.number === "number") return property.number;
  if (typeof property.formula?.number === "number") return property.formula.number;
  const parsed = Number.parseInt(textFrom(property), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function dateFrom(page: NotionPage, names: string[]) {
  const property = findProperty(page, names);
  if (!property?.date?.start) return undefined;
  return property.date.start.slice(0, 10);
}

function endDateFrom(page: NotionPage, names: string[]) {
  const property = findProperty(page, names);
  if (!property?.date?.end) return undefined;
  return property.date.end.slice(0, 10);
}

function checkboxOf(page: NotionPage, names: string[]) {
  const property = findProperty(page, names);
  return property?.checkbox === true;
}

function urlOf(page: NotionPage, names: string[]) {
  return textFrom(findProperty(page, names));
}

function titleOf(page: NotionPage) {
  for (const property of Object.values(page.properties)) {
    if (property.type === "title" || property.title) {
      const title = textFrom(property);
      if (title) return title;
    }
  }
  return "";
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function yearOf(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const match = value.match(/\d{4}/);
  return match ? Number.parseInt(match[0], 10) : fallback;
}

function splitParagraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapProjectStatus(value: string): Project["status"] {
  const normalized = normalizeKey(value);
  if (/en curso|en proceso|in progress|activo/.test(normalized)) return "en-curso";
  if (/finalizado|completo|done|terminado/.test(normalized)) return "finalizado";
  if (/evaluacion|en espera|not started|presentado/.test(normalized)) return "en-evaluacion";
  return "en-preparacion";
}

function mapProjectType(value: string): Project["type"] {
  const normalized = normalizeKey(value);
  if (/pid\s*pp|pp/.test(normalized)) return "PID-PP";
  if (/pific/.test(normalized)) return "PIFIC";
  if (/picto/.test(normalized)) return "PICTO";
  if (/cba|ciencia productiva/.test(normalized)) return "CBA";
  if (/transferencia/.test(normalized)) return "Transferencia";
  if (/pid/.test(normalized)) return "PID";
  return "Otro";
}

function mapPublicationType(value: string): Publication["type"] {
  const normalized = normalizeKey(value);
  if (/nacional/.test(normalized)) return "revista-nacional";
  if (/revista/.test(normalized)) return "revista";
  if (/congreso|conferencia/.test(normalized)) return "congreso";
  if (/capitulo|libro/.test(normalized)) return "capitulo";
  if (/preprint/.test(normalized)) return "preprint";
  return "revista";
}

function mapPublicationStatus(value: string): Publication["status"] {
  const normalized = normalizeKey(value);
  if (/aceptado|accepted/.test(normalized)) return "aceptado";
  if (/revision|review/.test(normalized)) return "en-revision";
  if (/preparacion|draft/.test(normalized)) return "en-preparacion";
  return "publicado";
}

function mapSeminarStatus(value: string): Seminar["status"] {
  const normalized = normalizeKey(value);
  if (/proximo|upcoming|programado/.test(normalized)) return "proximo";
  if (/organizacion|planificacion/.test(normalized)) return "en-organizacion";
  return "realizado";
}

function mapBecaStatus(value: string): Beca["status"] {
  const normalized = normalizeKey(value);
  if (/abierta|open/.test(normalized)) return "abierta";
  if (/permanente/.test(normalized)) return "permanente";
  if (/externa/.test(normalized)) return "externa";
  return "cerrada";
}

function mapPersonCategory(value: string): Person["category"] {
  const normalized = normalizeKey(value);
  if (/direccion|director/.test(normalized)) return "direccion";
  if (/honorario|honorifico/.test(normalized)) return "honorario";
  return "investigacion";
}

class NotionClient {
  constructor(
    private readonly token: string,
    private readonly version: string,
  ) {}

  async queryDataSource(dataSourceId: string): Promise<NotionPage[]> {
    const pages: NotionPage[] = [];
    let cursor: string | null = null;

    do {
      const response = await fetch(
        `https://api.notion.com/v1/data_sources/${encodeURIComponent(dataSourceId)}/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Notion-Version": this.version,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page_size: 100,
            ...(cursor ? { start_cursor: cursor } : {}),
          }),
        },
      );

      if (!response.ok) {
        const body = await response.text();
        throw new Error(
          `Notion respondió ${response.status} al consultar ${dataSourceId}: ${body.slice(0, 300)}`,
        );
      }

      const data = (await response.json()) as NotionQueryResponse;
      pages.push(...data.results);
      cursor = data.has_more ? data.next_cursor : null;

      if (cursor) {
        await sleep(350);
      }
    } while (cursor);

    return pages;
  }
}

function mapProject(page: NotionPage, index: number): Project {
  const title = titleOf(page) || `Proyecto ${index + 1}`;
  const summary =
    richTextOf(page, ["Resumen", "Summary", "Descripción", "Description"]) ||
    "Proyecto de investigación y desarrollo del CIDTIEE.";
  const descriptionText = richTextOf(page, [
    "Descripción",
    "Description",
    "Objetivos",
    "Objetivo",
  ]);
  const startYear =
    numberFrom(page, ["Año de inicio", "Start year", "Año", "Year"]) ??
    yearOf(dateFrom(page, ["Inicio", "Start"]), new Date().getFullYear());
  const endYear =
    numberFrom(page, ["Año de fin", "End year"]) ??
    yearOf(dateFrom(page, ["Fin", "End"]), startYear);

  return {
    id: `notion-${page.id}`,
    slug:
      slugify(richTextOf(page, ["Slug"])) ||
      slugify(title) ||
      `proyecto-${page.id.slice(0, 8)}`,
    code: richTextOf(page, ["Código", "Code", "ID"]) || undefined,
    title,
    summary,
    description: splitParagraphs(descriptionText),
    type: mapProjectType(selectOf(page, ["Tipo", "Type"])),
    status: mapProjectStatus(selectOf(page, ["Estado", "Status"])),
    startYear,
    endYear: endYear && endYear >= startYear ? endYear : undefined,
    director: richTextOf(page, ["Director", "Director/a"]) || undefined,
    codirector: richTextOf(page, ["Codirector", "Co-director"]) || undefined,
    participants: multiOf(page, ["Participantes", "Participants", "Integrantes"]),
    areas: multiOf(page, ["Áreas", "Areas", "Líneas"]),
    tags: multiOf(page, ["Etiquetas", "Tags", "Palabras clave"]),
    funding: richTextOf(page, ["Financiamiento", "Funding"]) || undefined,
    featured: checkboxOf(page, ["Destacado", "Featured"]),
  };
}

function mapPublication(page: NotionPage, index: number): Publication {
  const title = titleOf(page) || `Publicación ${index + 1}`;
  const authors = multiOf(page, ["Autores", "Authors", "Autor"]);
  const year =
    numberFrom(page, ["Año", "Year"]) ??
    yearOf(dateFrom(page, ["Fecha", "Date"]), new Date().getFullYear());
  const url = urlOf(page, ["URL", "Enlace", "Link"]);

  return {
    id: `notion-${page.id}`,
    title,
    authors: authors.length > 0 ? authors : ["CIDTIEE"],
    venue: richTextOf(page, ["Medio", "Venue", "Revista", "Congreso"]) || "CIDTIEE",
    type: mapPublicationType(selectOf(page, ["Tipo", "Type"])),
    year,
    doi: richTextOf(page, ["DOI"]) || undefined,
    url: url && /^https?:\/\//.test(url) ? url : undefined,
    status: mapPublicationStatus(selectOf(page, ["Estado", "Status"])),
    areaIds: multiOf(page, ["Áreas", "Areas"]),
    abstract: richTextOf(page, ["Resumen", "Abstract"]) || undefined,
    featured: checkboxOf(page, ["Destacado", "Featured"]),
  };
}

function mapSeminar(page: NotionPage, index: number): Seminar {
  const title = titleOf(page) || `Seminario ${index + 1}`;
  const date = dateFrom(page, ["Fecha", "Date", "Inicio"]);
  const year =
    numberFrom(page, ["Año", "Year"]) ?? yearOf(date, new Date().getFullYear());
  const registrationUrl = urlOf(page, ["Inscripción", "Registration", "Formulario"]);

  return {
    id: `notion-${page.id}`,
    slug:
      slugify(richTextOf(page, ["Slug"])) ||
      slugify(title) ||
      `seminario-${page.id.slice(0, 8)}`,
    edition: numberFrom(page, ["Edición", "Edition", "Número"]),
    title,
    year,
    date: date ?? null,
    endDate: endDateFrom(page, ["Fecha", "Date"]) ?? null,
    time: richTextOf(page, ["Horario", "Hora", "Time"]) || undefined,
    location: richTextOf(page, ["Lugar", "Location", "Auditorio"]) || undefined,
    description:
      richTextOf(page, ["Descripción", "Description", "Resumen"]) ||
      "Seminario técnico del CIDTIEE.",
    topics: multiOf(page, ["Temas", "Topics", "Ejes"]),
    speakers: multiOf(page, ["Expositores", "Speakers", "Disertantes"]),
    status: mapSeminarStatus(selectOf(page, ["Estado", "Status"])),
    registrationUrl:
      registrationUrl && /^https?:\/\//.test(registrationUrl) ? registrationUrl : undefined,
    programUrl: urlOf(page, ["Programa", "Program"]) || undefined,
    materialUrl: urlOf(page, ["Material", "Presentaciones"]) || undefined,
    featured: checkboxOf(page, ["Destacado", "Featured"]),
  };
}

function mapBeca(page: NotionPage, index: number): Beca {
  const name = titleOf(page) || `Beca ${index + 1}`;
  const url = urlOf(page, ["URL", "Web", "Enlace"]);
  const closing = dateFrom(page, ["Cierre", "Closing", "Fecha de cierre"]);

  return {
    id: `notion-${page.id}`,
    slug:
      slugify(richTextOf(page, ["Slug"])) ||
      slugify(name) ||
      `beca-${page.id.slice(0, 8)}`,
    name,
    kind: normalizeKey(selectOf(page, ["Tipo", "Kind"])).includes("convocatoria")
      ? "convocatoria"
      : "beca",
    status: mapBecaStatus(selectOf(page, ["Estado", "Status"])),
    year:
      numberFrom(page, ["Año", "Year"]) ??
      yearOf(closing, new Date().getFullYear()),
    opening: dateFrom(page, ["Apertura", "Opening"]) ?? null,
    closing: closing ?? null,
    url: url && /^https?:\/\//.test(url) ? url : undefined,
    description:
      richTextOf(page, ["Descripción", "Description", "Resumen"]) ||
      "Convocatoria del CIDTIEE.",
    conditions: multiOf(page, ["Condiciones", "Conditions", "Requisitos"]),
    audience: richTextOf(page, ["Dirigido a", "Audiencia", "Audience"]) || "Estudiantes y profesionales",
    contact: richTextOf(page, ["Contacto", "Contact"]) || undefined,
    featured: checkboxOf(page, ["Destacado", "Featured"]),
  };
}

function mapPerson(page: NotionPage, index: number): Person {
  const name = titleOf(page) || `Integrante ${index + 1}`;
  const email = urlOf(page, ["Correo", "Email"]);
  const profileUrl = urlOf(page, ["Perfil", "Profile", "CV"]);

  return {
    id: `notion-${page.id}`,
    name,
    title: richTextOf(page, ["Título", "Title", "Grado"]) || undefined,
    role: richTextOf(page, ["Rol", "Role", "Cargo"]) || "Investigador/a",
    category: mapPersonCategory(selectOf(page, ["Categoría", "Category"])),
    areaIds: multiOf(page, ["Áreas", "Areas"]),
    bio: richTextOf(page, ["Bio", "Biografía", "Resumen"]) || undefined,
    email: email && email.includes("@") ? email : undefined,
    profileUrl:
      profileUrl && /^https?:\/\//.test(profileUrl) ? profileUrl : undefined,
    featured: checkboxOf(page, ["Destacado", "Featured"]),
  };
}

function mapNews(page: NotionPage, index: number): News {
  const title = titleOf(page) || `Novedad ${index + 1}`;
  const date = dateFrom(page, ["Fecha", "Date"]) ?? new Date().toISOString().slice(0, 10);
  const url = urlOf(page, ["URL", "Enlace"]);

  return {
    id: `notion-${page.id}`,
    date,
    title,
    summary:
      richTextOf(page, ["Resumen", "Summary"]) ||
      "Novedad institucional del CIDTIEE.",
    body: splitParagraphs(richTextOf(page, ["Cuerpo", "Body", "Contenido"])),
    tag: richTextOf(page, ["Etiqueta", "Tag", "Categoría"]) || "Institucional",
    url: url && /^https?:\/\//.test(url) ? url : undefined,
    featured: checkboxOf(page, ["Destacado", "Featured"]),
  };
}

function mapResource(page: NotionPage, index: number): Resource | null {
  const title = titleOf(page) || `Recurso ${index + 1}`;
  const url = urlOf(page, ["URL", "Enlace", "Link"]);
  if (!url || !/^https?:\/\//.test(url)) return null;

  return {
    id: `notion-${page.id}`,
    title,
    type: richTextOf(page, ["Tipo", "Type"]) || "Documento",
    description:
      richTextOf(page, ["Descripción", "Description", "Resumen"]) ||
      "Recurso del CIDTIEE.",
    url,
    icon: richTextOf(page, ["Ícono", "Icono", "Icon"]) || undefined,
  };
}

function deriveCalendar(seminars: Seminar[], becas: Beca[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (const seminar of seminars) {
    if (!seminar.date) continue;
    events.push({
      id: `cal-${seminar.id}`,
      title: seminar.title,
      date: seminar.date,
      endDate: seminar.endDate ?? undefined,
      type: "seminario",
      description: seminar.description,
      url: seminar.registrationUrl,
      location: seminar.location,
      allDay: !seminar.time,
    });
  }

  for (const beca of becas) {
    if (beca.closing) {
      events.push({
        id: `cal-cierre-${beca.id}`,
        title: `Cierre: ${beca.name}`,
        date: beca.closing,
        type: beca.kind === "convocatoria" ? "convocatoria" : "beca",
        description: beca.description,
        url: beca.url,
        allDay: true,
      });
    }
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}

export class NotionProvider extends LocalJsonProvider {
  readonly name = "notion";
  private notionCache?: { content: Content; expiresAt: number };
  private readonly client: NotionClient;

  constructor(private readonly config: AppConfig) {
    super(config.contentPath);
    this.client = new NotionClient(config.notion.token ?? "", config.notion.version);
  }

  override async getContent(): Promise<Content> {
    if (!this.config.notion.token) {
      throw new Error(
        "NOTION_TOKEN no está configurado. Definí CONTENT_PROVIDER=local-json o agregá el token en backend/.env.",
      );
    }

    const now = Date.now();
    if (this.notionCache && this.notionCache.expiresAt > now) {
      return this.notionCache.content;
    }

    const base = await super.getContent();
    const dataSources = this.config.notion.dataSources;
    const warnings: string[] = [];

    const query = async <T>(
      key: keyof typeof dataSources,
      mapper: (page: NotionPage, index: number) => T | null,
      fallback: T[],
    ): Promise<T[]> => {
      const dataSourceId = dataSources[key];
      if (!dataSourceId) return fallback;

      try {
        const pages = await this.client.queryDataSource(dataSourceId);
        const mapped = pages
          .map((page, index) => mapper(page, index))
          .filter((item): item is T => item !== null);
        return mapped.length > 0 ? mapped : fallback;
      } catch (error) {
        warnings.push(
          `${key}: ${error instanceof Error ? error.message : String(error)}. Se usa el contenido local.`,
        );
        return fallback;
      }
    };

    const projects = await query("projects", mapProject, base.projects);
    const publications = await query("publications", mapPublication, base.publications);
    const seminars = await query("seminars", mapSeminar, base.seminars);
    const becas = await query("becas", mapBeca, base.becas);
    const people = await query("people", mapPerson, base.people);
    const news = await query("news", mapNews, base.news);
    const resources = await query("resources", mapResource, base.resources);

    const content: Content = {
      ...base,
      meta: {
        ...base.meta,
        generatedAt: new Date().toISOString(),
        provider: "notion",
        source: "Notion API",
        counts: {
          ...base.meta.counts,
          projects: projects.length,
          publications: publications.length,
          seminars: seminars.length,
          becas: becas.length,
          people: people.length,
          news: news.length,
          resources: resources.length,
        },
      },
      projects,
      publications,
      seminars,
      becas,
      people,
      news,
      resources,
      calendar: deriveCalendar(seminars, becas),
    };

    const parsed = ContentSchema.safeParse(content);
    if (!parsed.success) {
      const details = parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "(raíz)"}: ${issue.message}`)
        .join("; ");
      throw new Error(`El contenido mapeado desde Notion no es válido: ${details}`);
    }

    if (warnings.length > 0) {
      console.warn("[notion] Advertencias:\n" + warnings.map((item) => ` - ${item}`).join("\n"));
    }

    this.notionCache = {
      content: parsed.data,
      expiresAt: now + Math.max(30, this.config.notion.cacheTtlSeconds) * 1000,
    };

    return parsed.data;
  }
}
