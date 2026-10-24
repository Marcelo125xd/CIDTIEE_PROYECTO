import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { SeminarStatus } from "@cidtiee/shared";
import { SEMINAR_STATUS_LABELS } from "@cidtiee/shared";
import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { includesText, parsePage, parseYear } from "../lib/text";
import { SeminarCard } from "../components/Cards";
import { FilterBar, ResultsMeta, SearchField, SelectField } from "../components/FilterBar";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { Pagination } from "../components/Pagination";
import { EmptyState } from "../components/States";

const PAGE_SIZE = 10;

export function Seminarios() {
  useDocumentTitle("Seminarios");
  const content = useRequiredContent();
  const [params, setParams] = useSearchParams();

  const q = params.get("q") ?? "";
  const yearParam = params.get("year") ?? "";
  const statusParam = params.get("status") ?? "";
  const sortParam = params.get("sort") ?? "recent";
  const page = parsePage(params.get("page"));

  const year = parseYear(yearParam);
  const status =
    statusParam && statusParam in SEMINAR_STATUS_LABELS
      ? (statusParam as SeminarStatus)
      : undefined;
  const sort = sortParam === "oldest" || sortParam === "title" ? sortParam : "recent";

  const years = useMemo(
    () => [...new Set(content.seminars.map((seminar) => seminar.year))].sort((a, b) => b - a),
    [content.seminars],
  );

  const filtered = useMemo(() => {
    let items = [...content.seminars];

    if (q.trim()) {
      items = items.filter((seminar) =>
        includesText(
          [seminar.title, seminar.description, ...seminar.topics, ...seminar.speakers].join(" "),
          q,
        ),
      );
    }
    if (year) items = items.filter((seminar) => seminar.year === year);
    if (status) items = items.filter((seminar) => seminar.status === status);

    switch (sort) {
      case "oldest":
        items.sort((a, b) => a.year - b.year || (a.edition ?? 0) - (b.edition ?? 0));
        break;
      case "title":
        items.sort((a, b) => a.title.localeCompare(b.title, "es"));
        break;
      default:
        items.sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          if ((b.edition ?? 0) !== (a.edition ?? 0)) return (b.edition ?? 0) - (a.edition ?? 0);
          const aDate = a.date ?? "";
          const bDate = b.date ?? "";
          return bDate.localeCompare(aDate);
        });
    }

    return items;
  }, [content.seminars, q, year, status, sort]);

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

  const hasFilters = Boolean(q || year || status || sortParam !== "recent");

  return (
    <>
      <PageHeader
        eyebrow="Formación"
        title="Seminarios técnicos"
        lead="Un ciclo de actualización técnica sobre seguridad eléctrica, generación distribuida, movilidad eléctrica, eficiencia y sistemas de potencia."
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Formación", to: "/formacion" },
          { label: "Seminarios" },
        ]}
        actions={
          <Link className="btn btn--solid" to="/becas">
            Becas y convocatorias <Icon name="arrow-right" size={15} />
          </Link>
        }
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
              label="Buscar seminario"
              value={q}
              onChange={(value) => update({ q: value })}
              placeholder="Título o tema"
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
              label="Estado"
              value={status ?? ""}
              onChange={(value) => update({ status: value })}
              options={[
                { value: "", label: "Todos" },
                ...Object.entries(SEMINAR_STATUS_LABELS).map(([value, label]) => ({
                  value,
                  label,
                })),
              ]}
            />
            <SelectField
              label="Orden"
              value={sort}
              onChange={(value) => update({ sort: value === "recent" ? undefined : value })}
              options={[
                { value: "recent", label: "Más recientes" },
                { value: "oldest", label: "Más antiguos" },
                { value: "title", label: "Título" },
              ]}
            />
          </FilterBar>

          <ResultsMeta total={filtered.length} singular="seminario" plural="seminarios">
            {hasFilters && <span className="results-meta__hint">Filtros aplicados</span>}
          </ResultsMeta>

          {visible.length > 0 ? (
            <div className="seminar-list">
              {visible.map((seminar) => (
                <SeminarCard key={seminar.id} seminar={seminar} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No encontramos seminarios"
              description="Probá con otro término o quitá algunos filtros."
              action={
                <button className="btn btn--small" type="button" onClick={clear}>
                  Ver todos los seminarios
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
