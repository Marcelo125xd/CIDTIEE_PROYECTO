import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { PublicationType } from "@cidtiee/shared";
import { PUBLICATION_TYPE_LABELS } from "@cidtiee/shared";
import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { includesText, parsePage, parseYear } from "../lib/text";
import { PublicationItem } from "../components/Cards";
import { FilterBar, ResultsMeta, SearchField, SelectField } from "../components/FilterBar";
import { PageHeader } from "../components/PageHeader";
import { Pagination } from "../components/Pagination";
import { EmptyState } from "../components/States";

const PAGE_SIZE = 10;

export function Publications() {
  useDocumentTitle("Publicaciones");
  const content = useRequiredContent();
  const [params, setParams] = useSearchParams();

  const q = params.get("q") ?? "";
  const typeParam = params.get("type") ?? "";
  const yearParam = params.get("year") ?? "";
  const areaParam = params.get("area") ?? "";
  const sortParam = params.get("sort") ?? "recent";
  const page = parsePage(params.get("page"));

  const type =
    typeParam && typeParam in PUBLICATION_TYPE_LABELS
      ? (typeParam as PublicationType)
      : undefined;
  const year = parseYear(yearParam);
  const area = content.areas.some((item) => item.id === areaParam) ? areaParam : undefined;
  const sort = sortParam === "title" || sortParam === "year" ? sortParam : "recent";

  const years = useMemo(
    () =>
      [...new Set(content.publications.map((publication) => publication.year))].sort(
        (a, b) => b - a,
      ),
    [content.publications],
  );

  const filtered = useMemo(() => {
    let items = [...content.publications];

    if (q.trim()) {
      items = items.filter((publication) =>
        includesText(
          [
            publication.title,
            publication.venue,
            publication.doi ?? "",
            ...publication.authors,
            publication.abstract ?? "",
          ].join(" "),
          q,
        ),
      );
    }
    if (type) items = items.filter((publication) => publication.type === type);
    if (year) items = items.filter((publication) => publication.year === year);
    if (area) items = items.filter((publication) => publication.areaIds.includes(area));

    switch (sort) {
      case "title":
        items.sort((a, b) => a.title.localeCompare(b.title, "es"));
        break;
      case "year":
        items.sort((a, b) => a.year - b.year);
        break;
      default:
        items.sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          return a.title.localeCompare(b.title, "es");
        });
    }

    return items;
  }, [content.publications, q, type, year, area, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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

  const hasFilters = Boolean(q || type || year || area || sortParam !== "recent");

  return (
    <>
      <PageHeader
        eyebrow="Observatorio"
        title="Publicaciones"
        lead="Artículos en revistas internacionales y nacionales, trabajos en congresos y capítulos de libro producidos por los integrantes del CIDTIEE."
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Observatorio", to: "/observatorio" },
          { label: "Publicaciones" },
        ]}
      />

      <section className="page-body">
        <div className="container">
          <FilterBar
            actions={
              hasFilters ? (
                <button className="btn btn--small btn--ghost" type="button" onClick={clear}>
                  Limpiar filtros
                </button>
              ) : undefined
            }
          >
            <SearchField
              label="Buscar publicación"
              value={q}
              onChange={(value) => update({ q: value })}
              placeholder="Título, autor, revista o DOI"
            />
            <SelectField
              label="Tipo"
              value={type ?? ""}
              onChange={(value) => update({ type: value })}
              options={[
                { value: "", label: "Todos" },
                ...Object.entries(PUBLICATION_TYPE_LABELS).map(([value, label]) => ({
                  value,
                  label,
                })),
              ]}
            />
            <SelectField
              label="Año"
              value={year ? String(year) : ""}
              onChange={(value) => update({ year: value })}
              options={[
                { value: "", label: "Todos" },
                ...years.map((item) => ({ value: String(item), label: String(item) })),
              ]}
            />
            <SelectField
              label="Línea"
              value={area ?? ""}
              onChange={(value) => update({ area: value })}
              options={[
                { value: "", label: "Todas" },
                ...content.areas.map((item) => ({ value: item.id, label: item.name })),
              ]}
            />
            <SelectField
              label="Orden"
              value={sort}
              onChange={(value) => update({ sort: value === "recent" ? undefined : value })}
              options={[
                { value: "recent", label: "Más recientes" },
                { value: "year", label: "Año (más antiguos)" },
                { value: "title", label: "Título" },
              ]}
            />
          </FilterBar>

          <ResultsMeta total={filtered.length} singular="publicación" plural="publicaciones">
            {hasFilters && <span className="results-meta__hint">Filtros aplicados</span>}
          </ResultsMeta>

          {visible.length > 0 ? (
            <div className="pub-list">
              {visible.map((publication) => (
                <PublicationItem key={publication.id} publication={publication} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No encontramos publicaciones"
              description="Probá con otro término o quitá algunos filtros."
              action={
                <button className="btn btn--small" type="button" onClick={clear}>
                  Ver todas las publicaciones
                </button>
              }
            />
          )}

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={(next) => update({ page: String(next) })}
          />
        </div>
      </section>
    </>
  );
}
