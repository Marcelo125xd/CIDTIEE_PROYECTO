import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Paginated, SearchResult, SearchType } from "@cidtiee/shared";
import { SEARCH_TYPE_LABELS } from "@cidtiee/shared";
import { api, ApiError } from "../api";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useDebouncedValue } from "../lib/useDebouncedValue";
import { parsePage } from "../lib/text";
import type { IconName } from "../components/Icon";
import { Icon } from "../components/Icon";
import { FilterBar, ResultsMeta, SearchField, SelectField } from "../components/FilterBar";
import { PageHeader } from "../components/PageHeader";
import { Pagination } from "../components/Pagination";
import { EmptyState, ErrorState, Loading } from "../components/States";

const PAGE_SIZE = 12;

const SEARCH_ICONS: Record<SearchType, IconName> = {
  proyecto: "flask",
  publicacion: "file",
  seminario: "calendar",
  servicio: "bolt",
  novedad: "book",
  persona: "users",
  beca: "graduation",
};

const SEARCH_LINKS = [
  { to: "/observatorio/proyectos", label: "Proyectos", description: "Investigación en curso y finalizada" },
  { to: "/observatorio/publicaciones", label: "Publicaciones", description: "Producción científica del centro" },
  { to: "/servicios", label: "Servicios", description: "Capacidades técnicas para el sector" },
  { to: "/seminarios", label: "Seminarios", description: "Ciclo de actualización técnica" },
  { to: "/becas", label: "Becas", description: "Convocatorias y oportunidades" },
  { to: "/calendario", label: "Agenda", description: "Próximas actividades" },
];

export function Buscar() {
  useDocumentTitle("Buscar");
  const [params, setParams] = useSearchParams();

  const q = params.get("q") ?? "";
  const typeParam = params.get("type") ?? "";
  const page = parsePage(params.get("page"));
  const type =
    typeParam && typeParam in SEARCH_TYPE_LABELS ? (typeParam as SearchType) : undefined;

  const debouncedQuery = useDebouncedValue(q, 350);
  const [data, setData] = useState<Paginated<SearchResult> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const query = debouncedQuery.trim();
    if (!query) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    api
      .search({ q: query, type, page, pageSize: PAGE_SIZE }, controller.signal)
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(
          reason instanceof ApiError
            ? reason.message
            : "No se pudo realizar la búsqueda en este momento.",
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery, type, page, attempt]);

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
    setData(null);
    setError(null);
  }

  const hasQuery = debouncedQuery.trim().length > 0;
  const isSearching = loading || debouncedQuery !== q;

  return (
    <>
      <PageHeader
        eyebrow="Buscador"
        title="Buscar en el CIDTIEE"
        lead="Encontrá proyectos, publicaciones, seminarios, servicios, becas, personas y novedades del centro."
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Buscar" }]}
      />

      <section className="page-body">
        <div className="container search-page">
          <FilterBar
            actions={
              q || type ? (
                <button className="btn btn--small btn--ghost" type="button" onClick={clear}>
                  Limpiar búsqueda
                </button>
              ) : undefined
            }
          >
            <SearchField
              label="¿Qué estás buscando?"
              value={q}
              onChange={(value) => update({ q: value })}
              placeholder="Ej.: calidad de potencia, movilidad eléctrica, becas…"
            />
            <SelectField
              label="Tipo de contenido"
              value={type ?? ""}
              onChange={(value) => update({ type: value })}
              options={[
                { value: "", label: "Todo el sitio" },
                ...Object.entries(SEARCH_TYPE_LABELS).map(([value, label]) => ({
                  value,
                  label,
                })),
              ]}
            />
          </FilterBar>

          {!hasQuery && (
            <div className="search-intro">
              <p className="panel-title">Accesos directos</p>
              <div className="search-links">
                {SEARCH_LINKS.map((link) => (
                  <Link className="search-link" to={link.to} key={link.to}>
                    <span className="search-link__label">{link.label}</span>
                    <span className="search-link__text">{link.description}</span>
                    <Icon name="arrow-right" size={15} />
                  </Link>
                ))}
              </div>
              <p className="search-hint">
                También podés buscar por nombre de integrante, código de proyecto, DOI o tema
                técnico.
              </p>
            </div>
          )}

          {hasQuery && (
            <>
              <ResultsMeta
                total={data?.total ?? 0}
                singular="resultado"
                plural="resultados"
              >
                {q.trim() && <span className="results-meta__hint">para “{q.trim()}”</span>}
              </ResultsMeta>

              {isSearching && !error && <Loading label="Buscando en el portal…" />}

              {!isSearching && error && (
                <ErrorState
                  message={error}
                  onRetry={() => setAttempt((current) => current + 1)}
                />
              )}

              {!isSearching && !error && data && data.items.length > 0 && (
                <>
                  <div className="search-results">
                    {data.items.map((result) => (
                      <Link className="search-result" to={result.href} key={`${result.type}-${result.id}`}>
                        <span className="search-result__icon">
                          <Icon name={SEARCH_ICONS[result.type]} size={20} />
                        </span>
                        <span className="search-result__body">
                          <span className="search-result__top">
                            <span className="search-result__type">
                              {SEARCH_TYPE_LABELS[result.type]}
                            </span>
                            {result.meta && (
                              <span className="search-result__meta">{result.meta}</span>
                            )}
                          </span>
                          <span className="search-result__title">{result.title}</span>
                          <span className="search-result__summary">{result.summary}</span>
                        </span>
                        <Icon name="arrow-right" size={16} className="search-result__arrow" />
                      </Link>
                    ))}
                  </div>

                  <Pagination
                    page={data.page}
                    totalPages={data.totalPages}
                    onChange={(next) => update({ page: String(next) })}
                  />
                </>
              )}

              {!isSearching && !error && data && data.items.length === 0 && (
                <EmptyState
                  title="No encontramos resultados"
                  description={`No hay coincidencias para “${q.trim()}”. Probá con un término más general o revisá la ortografía.`}
                  action={
                    <button className="btn btn--small" type="button" onClick={clear}>
                      Ver accesos directos
                    </button>
                  }
                />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
