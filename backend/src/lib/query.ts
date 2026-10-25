import type { ParsedQs } from "qs";
import {
  ArchiveItemKindSchema,
  BecaKindSchema,
  BecaStatusSchema,
  ProjectStatusSchema,
  ProjectTypeSchema,
  PublicationTypeSchema,
  SeminarStatusSchema,
  SearchTypeSchema,
  type ArchiveQuery,
  type BecaQuery,
  type ProjectQuery,
  type PublicationQuery,
  type SearchQuery,
  type SeminarQuery,
} from "@cidtiee/shared";

type QueryValue = string | ParsedQs | (string | ParsedQs)[] | undefined;

function first(value: QueryValue): string | undefined {
  if (typeof value === "string") return value.trim() || undefined;
  if (Array.isArray(value)) {
    const item = value.find((entry) => typeof entry === "string");
    return typeof item === "string" ? item.trim() || undefined : undefined;
  }
  return undefined;
}

function numberValue(value: QueryValue): number | undefined {
  const raw = first(value);
  if (!raw) return undefined;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function booleanValue(value: QueryValue): boolean | undefined {
  const raw = first(value)?.toLowerCase();
  if (raw === "true" || raw === "1" || raw === "si" || raw === "sí") return true;
  if (raw === "false" || raw === "0" || raw === "no") return false;
  return undefined;
}

function enumValue<T>(
  schema: { safeParse: (value: unknown) => { success: true; data: T } | { success: false } },
  value: QueryValue,
): T | undefined {
  const raw = first(value);
  if (!raw) return undefined;
  const parsed = schema.safeParse(raw);
  return parsed.success ? parsed.data : undefined;
}

export function parseProjectQuery(query: ParsedQs): ProjectQuery {
  return {
    q: first(query.q),
    status: enumValue(ProjectStatusSchema, query.status),
    type: enumValue(ProjectTypeSchema, query.type),
    area: first(query.area),
    year: numberValue(query.year),
    featured: booleanValue(query.featured),
    page: numberValue(query.page),
    pageSize: numberValue(query.pageSize),
    sort:
      first(query.sort) === "title"
        ? "title"
        : first(query.sort) === "year"
          ? "year"
          : "recent",
  };
}

export function parsePublicationQuery(query: ParsedQs): PublicationQuery {
  return {
    q: first(query.q),
    type: enumValue(PublicationTypeSchema, query.type),
    year: numberValue(query.year),
    area: first(query.area),
    featured: booleanValue(query.featured),
    page: numberValue(query.page),
    pageSize: numberValue(query.pageSize),
    sort:
      first(query.sort) === "title"
        ? "title"
        : first(query.sort) === "year"
          ? "year"
          : "recent",
  };
}

export function parseSeminarQuery(query: ParsedQs): SeminarQuery {
  return {
    q: first(query.q),
    year: numberValue(query.year),
    status: enumValue(SeminarStatusSchema, query.status),
    page: numberValue(query.page),
    pageSize: numberValue(query.pageSize),
    sort:
      first(query.sort) === "oldest"
        ? "oldest"
        : first(query.sort) === "title"
          ? "title"
          : "recent",
  };
}

export function parseBecaQuery(query: ParsedQs): BecaQuery {
  return {
    q: first(query.q),
    status: enumValue(BecaStatusSchema, query.status),
    kind: enumValue(BecaKindSchema, query.kind),
    year: numberValue(query.year),
  };
}

export function parseSearchQuery(query: ParsedQs): SearchQuery {
  return {
    q: first(query.q) ?? "",
    type: enumValue(SearchTypeSchema, query.type),
    page: numberValue(query.page),
    pageSize: numberValue(query.pageSize),
  };
}

export function parseArchiveQuery(query: ParsedQs): ArchiveQuery {
  const sort = first(query.sort);

  return {
    q: first(query.q),
    section: first(query.section),
    subsection: first(query.subsection),
    kind: enumValue(ArchiveItemKindSchema, query.kind),
    year: numberValue(query.year),
    featured: booleanValue(query.featured),
    page: numberValue(query.page),
    pageSize: numberValue(query.pageSize),
    sort: sort === "oldest" || sort === "title" ? sort : "recent",
  };
}
