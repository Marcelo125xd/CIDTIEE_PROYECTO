import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { ProjectStatus, ProjectType } from "@cidtiee/shared";
import { PROJECT_STATUS_LABELS, PROJECT_TYPE_LABELS } from "@cidtiee/shared";
import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { includesText, parsePage } from "../lib/text";
import { ProjectCard } from "../components/Cards";
import { FilterBar, ResultsMeta, SearchField, SelectField } from "../components/FilterBar";
import { PageHeader } from "../components/PageHeader";
import { Pagination } from "../components/Pagination";
import { EmptyState } from "../components/States";

const PAGE_SIZE = 9;

export function Projects() {
  useDocumentTitle("Proyectos");
  const content = useRequiredContent();
  const [params, setParams] = useSearchParams();

  const q = params.get("q") ?? "";
  const statusParam = params.get("status") ?? "";
  const typeParam = params.get("type") ?? "";
  const areaParam = params.get("area") ?? "";
  const sortParam = params.get("sort") ?? "recent";
  const page = parsePage(params.get("page"));

  const status =
    statusParam && statusParam in PROJECT_STATUS_LABELS
      ? (statusParam as ProjectStatus)
      : undefined;
  const type =
    typeParam && typeParam in PROJECT_TYPE_LABELS ? (typeParam as ProjectType) : undefined;
  const area = content.areas.some((item) => item.id === areaParam) ? areaParam : undefined;
  const sort = sortParam === "title" || sortParam === "year" ? sortParam : "recent";

  const filtered = useMemo(() => {
    let items = [...content.projects];

    if (q.trim()) {
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
          q,
        ),
      );
    }
    if (status) items = items.filter((project) => project.status === status);
    if (type) items = items.filter((project) => project.type === type);
    if (area) items = items.filter((project) => project.areas.includes(area));

    switch (sort) {
      case "title":
        items.sort((a, b) => a.title.localeCompare(b.title, "es"));
        break;
      case "year":
        items.sort((a, b) => b.startYear - a.startYear);
        break;
      default:
        items.sort((a, b) => {
          if (a.startYear !== b.startYear) return b.startYear - a.startYear;
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          return a.title.localeCompare(b.title, "es");
        });
    }

    return items;
  }, [content.projects, q, status, type, area, sort]);

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

  const hasFilters = Boolean(q || status || type || area || sortParam !== "recent");

  return (
    <>
      <PageHeader
        eyebrow="Observatorio"
        title="Proyectos de investigación"
        lead="Proyectos de investigación y desarrollo del CIDTIEE, con su estado, período, dirección y líneas de trabajo."
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Observatorio", to: "/observatorio" },
          { label: "Proyectos" },
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
              label="Buscar proyecto"
              value={q}
              onChange={(value) => update({ q: value })}
              placeholder="Título, código, director o tema"
            />
            <SelectField
              label="Estado"
              value={status ?? ""}
              onChange={(value) => update({ status: value })}
              options={[
                { value: "", label: "Todos" },
                ...Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => ({ value, label })),
              ]}
            />
            <SelectField
              label="Tipo"
              value={type ?? ""}
              onChange={(value) => update({ type: value })}
              options={[
                { value: "", label: "Todos" },
                ...Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => ({ value, label })),
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
                { value: "year", label: "Año de inicio" },
                { value: "title", label: "Título" },
              ]}
            />
          </FilterBar>

          <ResultsMeta total={filtered.length} singular="proyecto" plural="proyectos">
            {hasFilters && <span className="results-meta__hint">Filtros aplicados</span>}
          </ResultsMeta>

          {visible.length > 0 ? (
            <div className="grid grid--3">
              {visible.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No encontramos proyectos"
              description="Probá con otro término o quitá algunos filtros."
              action={
                <button className="btn btn--small" type="button" onClick={clear}>
                  Ver todos los proyectos
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
