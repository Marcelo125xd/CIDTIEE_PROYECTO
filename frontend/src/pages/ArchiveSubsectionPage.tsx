import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import type { ArchiveItemKind } from "@cidtiee/shared";
import { ARCHIVE_ITEM_KIND_LABELS } from "@cidtiee/shared";
import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { includesText, parsePage, parseYear } from "../lib/text";
import {
  archiveSearchText,
  archiveSectionPath,
  findArchiveSection,
  findArchiveSubsection,
} from "../lib/archive";
import { ArchiveItemCard, ArchiveSidebar } from "../components/Archive";
import { FilterBar, ResultsMeta, SearchField, SelectField } from "../components/FilterBar";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { Pagination } from "../components/Pagination";
import { EmptyState } from "../components/States";

const PAGE_SIZE = 10;

export function ArchiveSubsectionPage() {
  const content = useRequiredContent();
  const { section: sectionSlug, subsection: subsectionSlug } = useParams();
  const [params, setParams] = useSearchParams();

  const section = findArchiveSection(content.archive, sectionSlug);
  const subsection = findArchiveSubsection(section, subsectionSlug);

  useDocumentTitle(subsection?.title ?? "Subsección no encontrada");

  const q = params.get("q") ?? "";
  const kindParam = params.get("kind") ?? "";
  const yearParam = params.get("year") ?? "";
  const sortParam = params.get("sort") ?? "recent";
  const page = parsePage(params.get("page"));

  const kind =
    kindParam && kindParam in ARCHIVE_ITEM_KIND_LABELS
      ? (kindParam as ArchiveItemKind)
      : undefined;
  const year = parseYear(yearParam);
  const sort = sortParam === "oldest" || sortParam === "title" ? sortParam : "recent";

  const baseItems = useMemo(() => {
    if (!section || !subsection) return [];
    return content.archive.items.filter(
      (item) => item.section === section.slug && item.subsection === subsection.slug,
    );
  }, [content.archive.items, section, subsection]);

  const years = useMemo(
    () =>
      [...new Set(baseItems.map((item) => item.year).filter((value): value is number => Boolean(value)))]
        .sort((a, b) => b - a),
    [baseItems],
  );

  const filtered = useMemo(() => {
    let items = [...baseItems];

    if (q.trim()) {
      items = items.filter((item) => includesText(archiveSearchText(item), q));
    }
    if (kind) items = items.filter((item) => item.kind === kind);
    if (year) items = items.filter((item) => item.year === year);

    switch (sort) {
      case "oldest":
        items.sort(
          (a, b) =>
            (a.year ?? 0) - (b.year ?? 0) ||
            (a.date ?? "").localeCompare(b.date ?? "") ||
            a.title.localeCompare(b.title, "es"),
        );
        break;
      case "title":
        items.sort((a, b) => a.title.localeCompare(b.title, "es"));
        break;
      default:
        items.sort(
          (a, b) =>
            (b.year ?? 0) - (a.year ?? 0) ||
            (b.date ?? "").localeCompare(a.date ?? "") ||
            Number(b.featured) - Number(a.featured) ||
            a.title.localeCompare(b.title, "es"),
        );
    }

    return items;
  }, [baseItems, q, kind, year, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function update(patch: Record<string, string | undefined>) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined || value === "") next.delete(key);
      else next.set(key, value);
    }
    if (!("page" in patch)) next.delete("page");
    setParams(next, { replace: true });
  }

  function clear() {
    setParams(new URLSearchParams(), { replace: true });
  }

  if (!section || !subsection) {
    return (
      <div className="container page-state">
        <p className="eyebrow">Archivo</p>
        <h1>Subsección no encontrada</h1>
        <p>La subsección del archivo que buscás no existe o cambió de dirección.</p>
        <Link className="btn btn--solid" to="/archivo">
          Volver al archivo <Icon name="arrow-right" size={15} />
        </Link>
      </div>
    );
  }

  const hasFilters = Boolean(q || kind || year || sortParam !== "recent");
  const kindOptions = Object.entries(ARCHIVE_ITEM_KIND_LABELS)
    .filter(([value]) => baseItems.some((item) => item.kind === value))
    .map(([value, label]) => ({ value, label }));

  return (
    <>
      <PageHeader
        eyebrow={section.title}
        title={subsection.title}
        lead={subsection.description}
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Archivo", to: "/archivo" },
          { label: section.title, to: archiveSectionPath(section.slug) },
          { label: subsection.title },
        ]}
        actions={
          <Link className="btn" to={archiveSectionPath(section.slug)}>
            <Icon name="arrow-left" size={15} /> Volver a {section.title}
          </Link>
        }
      />

      <section className="page-body">
        <div className="container archive-layout">
          <ArchiveSidebar
            archive={content.archive}
            activeSection={section.slug}
            activeSubsection={subsection.slug}
          />

          <div className="archive-main">
            <FilterBar
              actions={
                hasFilters ? (
                  <button
                    className="btn btn--small btn--ghost"
                    type="button"
                    onClick={clear}
                  >
                    Limpiar filtros
                  </button>
                ) : undefined
              }
            >
              <SearchField
                label="Buscar en esta subsección"
                value={q}
                onChange={(value) => update({ q: value })}
                placeholder="Título, tema, autor o año"
              />
              {kindOptions.length > 1 && (
                <SelectField
                  label="Tipo de registro"
                  value={kind ?? ""}
                  onChange={(value) => update({ kind: value })}
                  options={[{ value: "", label: "Todos" }, ...kindOptions]}
                />
              )}
              {years.length > 1 && (
                <SelectField
                  label="Año"
                  value={year ? String(year) : ""}
                  onChange={(value) => update({ year: value })}
                  options={[
                    { value: "", label: "Todos" },
                    ...years.map((item) => ({
                      value: String(item),
                      label: String(item),
                    })),
                  ]}
                />
              )}
              <SelectField
                label="Orden"
                value={sort}
                onChange={(value) =>
                  update({ sort: value === "recent" ? undefined : value })
                }
                options={[
                  { value: "recent", label: "Más recientes" },
                  { value: "oldest", label: "Más antiguos" },
                  { value: "title", label: "Título" },
                ]}
              />
            </FilterBar>

            <ResultsMeta total={filtered.length} singular="registro" plural="registros">
              {hasFilters && <span className="results-meta__hint">Filtros aplicados</span>}
            </ResultsMeta>

            {visible.length > 0 ? (
              <div className="archive-list">
                {visible.map((item) => (
                  <ArchiveItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No encontramos registros"
                description={
                  baseItems.length === 0
                    ? "Esta subsección todavía no tiene registros publicados. La estructura queda preparada para incorporarlos."
                    : "Probá con otro término o quitá algunos filtros."
                }
                action={
                  baseItems.length === 0 ? (
                    <Link className="btn btn--small" to={archiveSectionPath(section.slug)}>
                      Volver a {section.title}
                    </Link>
                  ) : (
                    <button
                      className="btn btn--small"
                      type="button"
                      onClick={clear}
                    >
                      Ver todos los registros
                    </button>
                  )
                }
              />
            )}

            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={(next) => update({ page: String(next) })}
            />
          </div>
        </div>
      </section>
    </>
  );
}
