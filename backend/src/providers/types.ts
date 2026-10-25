import type {
  Archive,
  ArchiveItem,
  ArchiveQuery,
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
  getArchive(): Promise<Archive>;
  listArchiveItems(query: ArchiveQuery): Promise<Paginated<ArchiveItem>>;
  getArchiveItem(slug: string): Promise<ArchiveItem | null>;
  search(query: SearchQuery): Promise<Paginated<SearchResult>>;
};
