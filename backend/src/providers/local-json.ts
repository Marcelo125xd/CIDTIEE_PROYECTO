import { readFile } from "node:fs/promises";
import {
  ContentSchema,
  includesText,
  normalizeText,
  paginate,
  type Beca,
  type BecaQuery,
  type CalendarEvent,
  type Content,
  type HomeData,
  type News,
  type Paginated,
  type Person,
  type Project,
  type ProjectQuery,
  type Publication,
  type PublicationQuery,
  type Resource,
  type SearchQuery,
  type SearchResult,
  type SearchType,
  type Seminar,
  type SeminarQuery,
  type SiteMeta,
} from "@cidtiee/shared";
import type { ContentProvider } from "./types.js";

function byTitle(a: { title: string }, b: { title: string }) {
  return a.title.localeCompare(b.title, "es");
}

function sortRecentProjects(a: Project, b: Project) {
  if (a.startYear !== b.startYear) return b.startYear - a.startYear;
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  return byTitle(a, b);
}

function sortRecentPublications(a: Publication, b: Publication) {
  if (a.year !== b.year) return b.year - a.year;
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  return byTitle(a, b);
}

function sortRecentSeminars(a: Seminar, b: Seminar) {
  if (a.year !== b.year) return b.year - a.year;
  if ((b.edition ?? 0) !== (a.edition ?? 0)) return (b.edition ?? 0) - (a.edition ?? 0);
  const aDate = a.date ?? "";
  const bDate = b.date ?? "";
  return bDate.localeCompare(aDate);
}

function sortNews(a: News, b: News) {
  return b.date.localeCompare(a.date);
}

function sortPeople(a: Person, b: Person) {
  const order: Record<Person["category"], number> = {
    direccion: 0,
    investigacion: 1,
    honorario: 2,
  };
  const byCategory = order[a.category] - order[b.category];
  return byCategory !== 0 ? byCategory : a.name.localeCompare(b.name, "es");
}

function sortBecas(a: Beca, b: Beca) {
  const order: Record<Beca["status"], number> = {
    abierta: 0,
    permanente: 1,
    externa: 2,
    cerrada: 3,
  };
  const byStatus = order[a.status] - order[b.status];
  return byStatus !== 0 ? byStatus : b.year - a.year;
}

function sortCalendar(a: CalendarEvent, b: CalendarEvent) {
  return a.date.localeCompare(b.date);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export class LocalJsonProvider implements ContentProvider {
  readonly name: string = "local-json";
  private cache?: Content;

  constructor(private readonly contentPath: string) {}

  async getContent(): Promise<Content> {
    if (!this.cache) {
      const raw = await readFile(this.contentPath, "utf8");
      this.cache = ContentSchema.parse(JSON.parse(raw));
    }
    return this.cache;
  }

  async getMeta(): Promise<SiteMeta> {
    const content = await this.getContent();
    return {
      provider: this.name,
      version: content.meta.version,
      generatedAt: content.meta.generatedAt,
      counts: content.meta.counts,
    };
  }

  async getHome(): Promise<HomeData> {
    const content = await this.getContent();
    const today = todayIso();
    const upcoming = content.calendar
      .filter((event) => event.date >= today)
      .sort(sortCalendar);
    const agenda = upcoming.length > 0
      ? upcoming.slice(0, 4)
      : [...content.calendar].sort(sortCalendar).slice(-4);

    return {
      featuredProjects: [...content.projects]
        .filter((project) => project.status === "en-curso")
        .sort(sortRecentProjects)
        .slice(0, 3),
      latestPublications: [...content.publications]
        .sort(sortRecentPublications)
        .slice(0, 4),
      seminars: [...content.seminars].sort(sortRecentSeminars).slice(0, 4),
      news: [...content.news].sort(sortNews).slice(0, 3),
      areas: content.areas,
      services: content.services.filter((service) => service.featured).slice(0, 4),
      stats: content.site.stats,
      upcomingEvents: agenda,
    };
  }

  async listProjects(query: ProjectQuery): Promise<Paginated<Project>> {
    const content = await this.getContent();
    let items = [...content.projects];

    if (query.q) {
      items = items.filter((project) =>
        includesText(
          [
            project.title,
            project.summary,
            project.code ?? "",
            project.director ?? "",
            project.codirector ?? "",
            ...project.tags,
            ...project.areas,
          ].join(" "),
          query.q!,
        ),
      );
    }
    if (query.status) items = items.filter((project) => project.status === query.status);
    if (query.type) items = items.filter((project) => project.type === query.type);
    if (query.area) items = items.filter((project) => project.areas.includes(query.area!));
    if (typeof query.featured === "boolean") {
      items = items.filter((project) => project.featured === query.featured);
    }
    if (query.year) {
      items = items.filter(
        (project) =>
          project.startYear <= query.year! &&
          (project.endYear ?? project.startYear) >= query.year!,
      );
    }

    switch (query.sort) {
      case "title":
        items.sort(byTitle);
        break;
      case "year":
        items.sort((a, b) => b.startYear - a.startYear);
        break;
      default:
        items.sort(sortRecentProjects);
    }

    return paginate(items, query.page, query.pageSize ?? 9);
  }

  async getProject(slug: string): Promise<Project | null> {
    const content = await this.getContent();
    return content.projects.find((project) => project.slug === slug) ?? null;
  }

  async listPublications(query: PublicationQuery): Promise<Paginated<Publication>> {
    const content = await this.getContent();
    let items = [...content.publications];

    if (query.q) {
      items = items.filter((publication) =>
        includesText(
          [
            publication.title,
            publication.venue,
            ...publication.authors,
            publication.abstract ?? "",
          ].join(" "),
          query.q!,
        ),
      );
    }
    if (query.type) items = items.filter((publication) => publication.type === query.type);
    if (query.year) items = items.filter((publication) => publication.year === query.year);
    if (query.area) {
      items = items.filter((publication) => publication.areaIds.includes(query.area!));
    }
    if (typeof query.featured === "boolean") {
      items = items.filter((publication) => publication.featured === query.featured);
    }

    switch (query.sort) {
      case "title":
        items.sort(byTitle);
        break;
      case "year":
        items.sort((a, b) => a.year - b.year);
        break;
      default:
        items.sort(sortRecentPublications);
    }

    return paginate(items, query.page, query.pageSize ?? 10);
  }

  async listSeminars(query: SeminarQuery): Promise<Paginated<Seminar>> {
    const content = await this.getContent();
    let items = [...content.seminars];

    if (query.q) {
      items = items.filter((seminar) =>
        includesText(
          [seminar.title, seminar.description, ...seminar.topics, ...seminar.speakers].join(" "),
          query.q!,
        ),
      );
    }
    if (query.year) items = items.filter((seminar) => seminar.year === query.year);
    if (query.status) items = items.filter((seminar) => seminar.status === query.status);

    switch (query.sort) {
      case "oldest":
        items.sort((a, b) => a.year - b.year || (a.edition ?? 0) - (b.edition ?? 0));
        break;
      case "title":
        items.sort(byTitle);
        break;
      default:
        items.sort(sortRecentSeminars);
    }

    return paginate(items, query.page, query.pageSize ?? 10);
  }

  async listBecas(query: BecaQuery = {}): Promise<Beca[]> {
    const content = await this.getContent();
    let items = [...content.becas];

    if (query.status) items = items.filter((beca) => beca.status === query.status);
    if (query.kind) items = items.filter((beca) => beca.kind === query.kind);
    if (query.year) items = items.filter((beca) => beca.year === query.year);
    if (query.q) {
      items = items.filter((beca) =>
        includesText(
          [beca.name, beca.description, beca.audience, ...beca.conditions].join(" "),
          query.q!,
        ),
      );
    }

    return items.sort(sortBecas);
  }

  async listPeople(): Promise<Person[]> {
    const content = await this.getContent();
    return [...content.people].sort(sortPeople);
  }

  async listNews(): Promise<News[]> {
    const content = await this.getContent();
    return [...content.news].sort(sortNews);
  }

  async listResources(): Promise<Resource[]> {
    const content = await this.getContent();
    return content.resources;
  }

  async getCalendar(): Promise<CalendarEvent[]> {
    const content = await this.getContent();
    return [...content.calendar].sort(sortCalendar);
  }

  async search(query: SearchQuery): Promise<Paginated<SearchResult>> {
    const content = await this.getContent();
    const rawQuery = query.q.trim();

    if (!rawQuery) {
      return paginate([], query.page, query.pageSize ?? 12);
    }

    const terms = normalizeText(rawQuery).split(/\s+/).filter(Boolean);

    type Candidate = SearchResult & { haystack: string };

    const candidates: Candidate[] = [];
    const add = (
      id: string,
      type: SearchType,
      title: string,
      summary: string,
      href: string,
      meta: string | undefined,
      extra: string[],
    ) => {
      candidates.push({
        id,
        type,
        title,
        summary,
        href,
        meta,
        score: 0,
        haystack: normalizeText([title, summary, meta ?? "", ...extra].join(" ")),
      });
    };

    for (const project of content.projects) {
      add(
        project.id,
        "proyecto",
        project.title,
        project.summary,
        `/observatorio/proyectos/${project.slug}`,
        project.code ?? (project.status === "en-curso" ? "En curso" : "Finalizado"),
        [project.director ?? "", project.codirector ?? "", ...project.tags, ...project.areas],
      );
    }

    for (const publication of content.publications) {
      add(
        publication.id,
        "publicacion",
        publication.title,
        `${publication.venue} · ${publication.year}`,
        `/observatorio/publicaciones?q=${encodeURIComponent(publication.title)}`,
        publication.type,
        [...publication.authors, publication.doi ?? ""],
      );
    }

    for (const seminar of content.seminars) {
      add(
        seminar.id,
        "seminario",
        seminar.title,
        seminar.description,
        `/seminarios?q=${encodeURIComponent(seminar.title)}`,
        seminar.date ?? String(seminar.year),
        seminar.topics,
      );
    }

    for (const service of content.services) {
      add(
        service.id,
        "servicio",
        service.name,
        service.description,
        `/servicios#${service.slug}`,
        service.category,
        service.items,
      );
    }

    for (const item of content.news) {
      add(item.id, "novedad", item.title, item.summary, `/medios#${item.id}`, item.tag, item.body);
    }

    for (const person of content.people) {
      add(
        person.id,
        "persona",
        person.name,
        person.bio ?? person.role,
        `/institucional#${person.id}`,
        person.role,
        [person.title ?? "", ...person.areaIds],
      );
    }

    for (const beca of content.becas) {
      add(
        beca.id,
        "beca",
        beca.name,
        beca.description,
        `/becas#${beca.slug}`,
        beca.status,
        [...beca.conditions, beca.audience],
      );
    }

    const results: SearchResult[] = [];
    for (const candidate of candidates) {
      if (query.type && candidate.type !== query.type) continue;

      const title = normalizeText(candidate.title);
      let score = 0;
      for (const term of terms) {
        if (title === term) score += 120;
        else if (title.includes(term)) score += 60;
        else if (normalizeText(candidate.summary).includes(term)) score += 28;
        else if (normalizeText(candidate.meta ?? "").includes(term)) score += 14;
        else if (candidate.haystack.includes(term)) score += 8;
      }

      if (score > 0) {
        results.push({ ...candidate, score });
      }
    }

    results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "es"));

    return paginate(results, query.page, query.pageSize ?? 12);
  }
}
