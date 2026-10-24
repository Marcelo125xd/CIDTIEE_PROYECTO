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

export type ContentProvider = {
  readonly name: string;
  getContent(): Promise<Content>;
  getMeta(): Promise<SiteMeta>;
  getHome(): Promise<HomeData>;
  listProjects(query: ProjectQuery): Promise<Paginated<Project>>;
  getProject(slug: string): Promise<Project | null>;
  listPublications(query: PublicationQuery): Promise<Paginated<Publication>>;
  listSeminars(query: SeminarQuery): Promise<Paginated<Seminar>>;
  listBecas(query?: BecaQuery): Promise<Beca[]>;
  listPeople(): Promise<Person[]>;
  listNews(): Promise<News[]>;
  listResources(): Promise<Resource[]>;
  getCalendar(): Promise<CalendarEvent[]>;
  search(query: SearchQuery): Promise<Paginated<SearchResult>>;
};
