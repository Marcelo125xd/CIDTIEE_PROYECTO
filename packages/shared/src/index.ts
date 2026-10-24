import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Primitivas                                                          */
/* ------------------------------------------------------------------ */

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Se esperaba una fecha ISO (AAAA-MM-DD)");

const year = z.number().int().min(1900).max(2100);

const slug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido");

const icon = z.string().min(1).default("documento");

/* ------------------------------------------------------------------ */
/* Enumeraciones                                                       */
/* ------------------------------------------------------------------ */

export const ProjectStatusSchema = z.enum([
  "en-curso",
  "finalizado",
  "en-evaluacion",
  "en-preparacion",
]);

export const ProjectTypeSchema = z.enum([
  "PID",
  "PID-PP",
  "PIFIC",
  "PICTO",
  "CBA",
  "Transferencia",
  "Otro",
]);

export const PublicationTypeSchema = z.enum([
  "revista",
  "revista-nacional",
  "congreso",
  "capitulo",
  "preprint",
]);

export const PublicationStatusSchema = z.enum([
  "publicado",
  "aceptado",
  "en-revision",
  "en-preparacion",
]);

export const SeminarStatusSchema = z.enum([
  "realizado",
  "proximo",
  "en-organizacion",
]);

export const BecaKindSchema = z.enum(["beca", "convocatoria"]);

export const BecaStatusSchema = z.enum([
  "abierta",
  "cerrada",
  "permanente",
  "externa",
]);

export const PersonCategorySchema = z.enum([
  "direccion",
  "investigacion",
  "honorario",
]);

export const CalendarTypeSchema = z.enum([
  "seminario",
  "beca",
  "convocatoria",
  "curso",
  "otro",
]);

export const SearchTypeSchema = z.enum([
  "proyecto",
  "publicacion",
  "seminario",
  "servicio",
  "novedad",
  "persona",
  "beca",
]);

export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;
export type ProjectType = z.infer<typeof ProjectTypeSchema>;
export type PublicationType = z.infer<typeof PublicationTypeSchema>;
export type PublicationStatus = z.infer<typeof PublicationStatusSchema>;
export type SeminarStatus = z.infer<typeof SeminarStatusSchema>;
export type BecaKind = z.infer<typeof BecaKindSchema>;
export type BecaStatus = z.infer<typeof BecaStatusSchema>;
export type PersonCategory = z.infer<typeof PersonCategorySchema>;
export type CalendarType = z.infer<typeof CalendarTypeSchema>;
export type SearchType = z.infer<typeof SearchTypeSchema>;

/* ------------------------------------------------------------------ */
/* Etiquetas para la interfaz                                          */
/* ------------------------------------------------------------------ */

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  "en-curso": "En curso",
  finalizado: "Finalizado",
  "en-evaluacion": "En evaluación",
  "en-preparacion": "En preparación",
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  PID: "PID",
  "PID-PP": "PID PP",
  PIFIC: "PIFIC",
  PICTO: "PICTO",
  CBA: "Córdoba Ciencia Productiva",
  Transferencia: "Transferencia",
  Otro: "Otro",
};

export const PUBLICATION_TYPE_LABELS: Record<PublicationType, string> = {
  revista: "Revista internacional",
  "revista-nacional": "Revista nacional",
  congreso: "Congreso",
  capitulo: "Capítulo de libro",
  preprint: "Preprint",
};

export const PUBLICATION_STATUS_LABELS: Record<PublicationStatus, string> = {
  publicado: "Publicado",
  aceptado: "Aceptado",
  "en-revision": "En revisión",
  "en-preparacion": "En preparación",
};

export const SEMINAR_STATUS_LABELS: Record<SeminarStatus, string> = {
  realizado: "Realizado",
  proximo: "Próximo",
  "en-organizacion": "En organización",
};

export const BECA_STATUS_LABELS: Record<BecaStatus, string> = {
  abierta: "Abierta",
  cerrada: "Cerrada",
  permanente: "Permanente",
  externa: "Externa",
};

export const BECA_KIND_LABELS: Record<BecaKind, string> = {
  beca: "Beca",
  convocatoria: "Convocatoria",
};

export const PERSON_CATEGORY_LABELS: Record<PersonCategory, string> = {
  direccion: "Dirección",
  investigacion: "Investigación",
  honorario: "Miembro honorario",
};

export const CALENDAR_TYPE_LABELS: Record<CalendarType, string> = {
  seminario: "Seminario",
  beca: "Beca",
  convocatoria: "Convocatoria",
  curso: "Curso",
  otro: "Otro",
};

export const SEARCH_TYPE_LABELS: Record<SearchType, string> = {
  proyecto: "Proyecto",
  publicacion: "Publicación",
  seminario: "Seminario",
  servicio: "Servicio",
  novedad: "Novedad",
  persona: "Persona",
  beca: "Beca",
};

/* ------------------------------------------------------------------ */
/* Entidades                                                           */
/* ------------------------------------------------------------------ */

export const StatSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  value: z.number(),
  suffix: z.string().optional(),
  note: z.string().optional(),
});
export type Stat = z.infer<typeof StatSchema>;

export const LinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  icon: z.string().optional(),
});
export type SiteLink = z.infer<typeof LinkSchema>;

export const AuthoritySchema = z.object({
  role: z.string().min(1),
  name: z.string().min(1),
  area: z.string().optional(),
});
export type Authority = z.infer<typeof AuthoritySchema>;

export const CtaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});
export type Cta = z.infer<typeof CtaSchema>;

export const SiteSchema = z.object({
  name: z.string().min(1),
  fullName: z.string().min(1),
  university: z.string().min(1),
  faculty: z.string().min(1),
  department: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  resolution: z.string().min(1),
  history: z.array(z.string().min(1)).min(1),
  mission: z.string().min(1),
  vision: z.string().min(1),
  objectives: z.array(z.string().min(1)).min(1),
  values: z.array(z.string().min(1)).min(1),
  authorities: z.array(AuthoritySchema).min(1),
  facilities: z.string().min(1),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().min(1),
    phoneAlt: z.string().optional(),
    extension: z.string().optional(),
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().optional(),
    mapsUrl: z.string().url().optional(),
    hours: z.string().optional(),
  }),
  links: z.array(LinkSchema).min(1),
  hero: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    lead: z.string().min(1),
    primaryCta: CtaSchema,
    secondaryCta: CtaSchema.optional(),
  }),
  stats: z.array(StatSchema).min(1),
});
export type Site = z.infer<typeof SiteSchema>;

export const AreaSchema = z.object({
  id: z.string().min(1),
  slug,
  name: z.string().min(1),
  shortName: z.string().optional(),
  description: z.string().min(1),
  lines: z.array(z.string().min(1)).min(1),
  icon,
});
export type Area = z.infer<typeof AreaSchema>;

export const ServiceSchema = z.object({
  id: z.string().min(1),
  slug,
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
  featured: z.boolean().default(false),
  icon,
});
export type Service = z.infer<typeof ServiceSchema>;

export const CaseStudySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  client: z.string().min(1),
  year: year,
  description: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  outcome: z.string().optional(),
});
export type CaseStudy = z.infer<typeof CaseStudySchema>;

export const ProductionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  year: year.optional(),
  registration: z.string().optional(),
  description: z.string().min(1),
  type: z.enum(["software", "estudio", "modelo", "otro"]),
  withIp: z.boolean().default(false),
});
export type Production = z.infer<typeof ProductionSchema>;

export const ProjectSchema = z.object({
  id: z.string().min(1),
  slug,
  code: z.string().optional(),
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.array(z.string().min(1)).default([]),
  type: ProjectTypeSchema,
  status: ProjectStatusSchema,
  startYear: year,
  endYear: year.optional(),
  director: z.string().optional(),
  codirector: z.string().optional(),
  participants: z.array(z.string().min(1)).default([]),
  areas: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string().min(1)).default([]),
  funding: z.string().optional(),
  featured: z.boolean().default(false),
});
export type Project = z.infer<typeof ProjectSchema>;

export const PublicationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  authors: z.array(z.string().min(1)).min(1),
  venue: z.string().min(1),
  type: PublicationTypeSchema,
  year,
  doi: z.string().optional(),
  url: z.string().url().optional(),
  status: PublicationStatusSchema.default("publicado"),
  areaIds: z.array(z.string().min(1)).default([]),
  abstract: z.string().optional(),
  featured: z.boolean().default(false),
});
export type Publication = z.infer<typeof PublicationSchema>;

export const SeminarSchema = z.object({
  id: z.string().min(1),
  slug,
  edition: z.number().int().positive().optional(),
  title: z.string().min(1),
  year,
  date: isoDate.nullable().optional(),
  endDate: isoDate.nullable().optional(),
  time: z.string().optional(),
  location: z.string().optional(),
  description: z.string().min(1),
  topics: z.array(z.string().min(1)).default([]),
  speakers: z.array(z.string().min(1)).default([]),
  status: SeminarStatusSchema,
  registrationUrl: z.string().url().optional(),
  programUrl: z.string().url().optional(),
  materialUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
});
export type Seminar = z.infer<typeof SeminarSchema>;

export const BecaSchema = z.object({
  id: z.string().min(1),
  slug,
  name: z.string().min(1),
  kind: BecaKindSchema.default("beca"),
  status: BecaStatusSchema,
  year,
  opening: isoDate.nullable().optional(),
  closing: isoDate.nullable().optional(),
  url: z.string().url().optional(),
  description: z.string().min(1),
  conditions: z.array(z.string().min(1)).default([]),
  audience: z.string().min(1),
  contact: z.string().optional(),
  featured: z.boolean().default(false),
});
export type Beca = z.infer<typeof BecaSchema>;

export const PersonSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  title: z.string().optional(),
  role: z.string().min(1),
  category: PersonCategorySchema,
  areaIds: z.array(z.string().min(1)).default([]),
  bio: z.string().optional(),
  email: z.string().email().optional(),
  profileUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
});
export type Person = z.infer<typeof PersonSchema>;

export const NewsSchema = z.object({
  id: z.string().min(1),
  date: isoDate,
  title: z.string().min(1),
  summary: z.string().min(1),
  body: z.array(z.string().min(1)).default([]),
  tag: z.string().min(1),
  url: z.string().url().optional(),
  featured: z.boolean().default(false),
});
export type News = z.infer<typeof NewsSchema>;

export const ResourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url(),
  icon: z.string().optional(),
});
export type Resource = z.infer<typeof ResourceSchema>;

export const CalendarEventSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  date: isoDate,
  endDate: isoDate.nullable().optional(),
  type: CalendarTypeSchema,
  description: z.string().min(1),
  url: z.string().optional(),
  location: z.string().optional(),
  allDay: z.boolean().default(true),
});
export type CalendarEvent = z.infer<typeof CalendarEventSchema>;

export const MetaSchema = z.object({
  version: z.string().min(1),
  generatedAt: z.string().datetime(),
  source: z.string().min(1),
  provider: z.string().min(1),
  counts: z.record(z.number()),
});
export type Meta = z.infer<typeof MetaSchema>;

export const ContentSchema = z.object({
  meta: MetaSchema,
  site: SiteSchema,
  areas: z.array(AreaSchema).min(1),
  services: z.array(ServiceSchema).min(1),
  cases: z.array(CaseStudySchema).default([]),
  production: z.array(ProductionSchema).default([]),
  projects: z.array(ProjectSchema).min(1),
  publications: z.array(PublicationSchema).min(1),
  seminars: z.array(SeminarSchema).min(1),
  becas: z.array(BecaSchema).min(1),
  people: z.array(PersonSchema).min(1),
  news: z.array(NewsSchema).default([]),
  resources: z.array(ResourceSchema).default([]),
  calendar: z.array(CalendarEventSchema).default([]),
});
export type Content = z.infer<typeof ContentSchema>;

/* ------------------------------------------------------------------ */
/* Consultas y respuestas                                              */
/* ------------------------------------------------------------------ */

export type ProjectQuery = {
  q?: string;
  status?: ProjectStatus;
  type?: ProjectType;
  area?: string;
  year?: number;
  featured?: boolean;
  page?: number;
  pageSize?: number;
  sort?: "recent" | "title" | "year";
};

export type PublicationQuery = {
  q?: string;
  type?: PublicationType;
  year?: number;
  area?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
  sort?: "recent" | "title" | "year";
};

export type SeminarQuery = {
  q?: string;
  year?: number;
  status?: SeminarStatus;
  page?: number;
  pageSize?: number;
  sort?: "recent" | "oldest" | "title";
};

export type SearchQuery = {
  q: string;
  type?: SearchType;
  page?: number;
  pageSize?: number;
};

export type BecaQuery = {
  status?: BecaStatus;
  kind?: BecaKind;
  year?: number;
  q?: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type SearchResult = {
  id: string;
  type: SearchType;
  title: string;
  summary: string;
  href: string;
  meta?: string;
  score: number;
};

export type HomeData = {
  featuredProjects: Project[];
  latestPublications: Publication[];
  seminars: Seminar[];
  news: News[];
  areas: Area[];
  services: Service[];
  stats: Stat[];
  upcomingEvents: CalendarEvent[];
};

export type SiteMeta = {
  provider: string;
  version: string;
  generatedAt: string;
  counts: Record<string, number>;
};

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 12,
): Paginated<T> {
  const safePage = Math.max(1, Math.trunc(page));
  const safeSize = Math.min(100, Math.max(1, Math.trunc(pageSize)));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safeSize));
  const current = Math.min(safePage, totalPages);
  const start = (current - 1) * safeSize;
  return {
    items: items.slice(start, start + safeSize),
    total,
    page: current,
    pageSize: safeSize,
    totalPages,
  };
}

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function includesText(haystack: string, needle: string): boolean {
  return normalizeText(haystack).includes(normalizeText(needle));
}
