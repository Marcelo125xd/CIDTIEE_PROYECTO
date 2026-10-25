import type {
  Archive,
  ArchiveItem,
  ArchiveSection,
  ArchiveSubsection,
} from "@cidtiee/shared";
import { formatDate } from "./format";

export function archiveSectionPath(section: string): string {
  return `/archivo/${section}`;
}

export function archiveSubsectionPath(section: string, subsection: string): string {
  return `/archivo/${section}/${subsection}`;
}

export function archiveItemPath(
  item: Pick<ArchiveItem, "section" | "subsection" | "slug">,
): string {
  return `/archivo/${item.section}/${item.subsection}/${item.slug}`;
}

export function findArchiveSection(
  archive: Archive,
  sectionSlug: string | undefined,
): ArchiveSection | undefined {
  if (!sectionSlug) return undefined;
  return archive.sections.find((section) => section.slug === sectionSlug);
}

export function findArchiveSubsection(
  section: ArchiveSection | undefined,
  subsectionSlug: string | undefined,
): ArchiveSubsection | undefined {
  if (!section || !subsectionSlug) return undefined;
  return section.subsections.find((subsection) => subsection.slug === subsectionSlug);
}

export function countArchiveItems(
  items: ArchiveItem[],
  section?: string,
  subsection?: string,
): number {
  return items.filter(
    (item) =>
      (!section || item.section === section) &&
      (!subsection || item.subsection === subsection),
  ).length;
}

export function archiveItemDateLabel(item: ArchiveItem): string {
  if (item.date) return formatDate(item.date);
  if (item.endDate) return formatDate(item.endDate);
  if (item.year) return String(item.year);
  return "";
}

export function archiveItemPeriodLabel(item: ArchiveItem): string {
  if (item.date && item.endDate) {
    return `${formatDate(item.date)} – ${formatDate(item.endDate)}`;
  }
  return archiveItemDateLabel(item);
}

export function archiveSearchText(item: ArchiveItem): string {
  return [
    item.title,
    item.summary,
    ...item.body,
    ...item.authors,
    ...item.tags,
    ...item.facts.flatMap((fact) => [fact.label, fact.value]),
    item.status ?? "",
    item.year ? String(item.year) : "",
  ].join(" ");
}

export function isInternalUrl(url: string): boolean {
  return /^\/(?!\/)/.test(url) && !url.includes("\\");
}

export function archiveItemAuthorLabel(item: ArchiveItem): string {
  return item.kind === "seminario" ? "Expositores" : "Autores";
}
