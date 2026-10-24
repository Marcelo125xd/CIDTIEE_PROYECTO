import type {
  Beca,
  BecaQuery,
  CalendarEvent,
  Content,
  HomeData,
  News,
  Paginated,
  Person,
  Project,
  ProjectQuery,
  Publication,
  PublicationQuery,
  Resource,
  SearchQuery,
  SearchResult,
  Seminar,
  SeminarQuery,
  SiteMeta,
} from "@cidtiee/shared";

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      signal,
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, "No se pudo conectar con el servidor del CIDTIEE.");
  }

  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      if (body.error?.message) message = body.error.message;
    } catch {
      // La respuesta no era JSON.
    }
    throw new ApiError(response.status, message);
  }

  return (await response.json()) as T;
}

export const api = {
  content: (signal?: AbortSignal) => request<Content>("/api/content", signal),
  meta: (signal?: AbortSignal) => request<SiteMeta>("/api/meta", signal),
  home: (signal?: AbortSignal) => request<HomeData>("/api/home", signal),
  projects: (query: ProjectQuery = {}, signal?: AbortSignal) =>
    request<Paginated<Project>>(
      `/api/projects${buildQuery({
        q: query.q,
        status: query.status,
        type: query.type,
        area: query.area,
        year: query.year,
        featured: query.featured,
        page: query.page,
        pageSize: query.pageSize,
        sort: query.sort,
      })}`,
      signal,
    ),
  project: (slug: string, signal?: AbortSignal) =>
    request<Project>(`/api/projects/${encodeURIComponent(slug)}`, signal),
  publications: (query: PublicationQuery = {}, signal?: AbortSignal) =>
    request<Paginated<Publication>>(
      `/api/publications${buildQuery({
        q: query.q,
        type: query.type,
        year: query.year,
        area: query.area,
        featured: query.featured,
        page: query.page,
        pageSize: query.pageSize,
        sort: query.sort,
      })}`,
      signal,
    ),
  seminars: (query: SeminarQuery = {}, signal?: AbortSignal) =>
    request<Paginated<Seminar>>(
      `/api/seminars${buildQuery({
        q: query.q,
        year: query.year,
        status: query.status,
        page: query.page,
        pageSize: query.pageSize,
        sort: query.sort,
      })}`,
      signal,
    ),
  becas: (query: BecaQuery = {}, signal?: AbortSignal) =>
    request<Beca[]>(
      `/api/becas${buildQuery({
        q: query.q,
        status: query.status,
        kind: query.kind,
        year: query.year,
      })}`,
      signal,
    ),
  people: (signal?: AbortSignal) => request<Person[]>("/api/people", signal),
  news: (signal?: AbortSignal) => request<News[]>("/api/news", signal),
  resources: (signal?: AbortSignal) => request<Resource[]>("/api/resources", signal),
  calendar: (signal?: AbortSignal) => request<CalendarEvent[]>("/api/calendar", signal),
  search: (query: SearchQuery, signal?: AbortSignal) =>
    request<Paginated<SearchResult>>(
      `/api/search${buildQuery({
        q: query.q,
        type: query.type,
        page: query.page,
        pageSize: query.pageSize,
      })}`,
      signal,
    ),
};
