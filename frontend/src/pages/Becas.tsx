import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { BecaKind, BecaStatus } from "@cidtiee/shared";
import { BECA_KIND_LABELS, BECA_STATUS_LABELS } from "@cidtiee/shared";
import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { includesText } from "../lib/text";
import { BecaCard } from "../components/Cards";
import { FilterBar, ResultsMeta, SearchField, SelectField } from "../components/FilterBar";
import { ContactBand } from "../components/ContactBand";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/States";

const STATUS_ORDER: Record<BecaStatus, number> = {
  abierta: 0,
  permanente: 1,
  externa: 2,
  cerrada: 3,
};

export function Becas() {
  useDocumentTitle("Becas y convocatorias");
  const content = useRequiredContent();
  const [params, setParams] = useSearchParams();

  const q = params.get("q") ?? "";
  const kindParam = params.get("kind") ?? "";
  const statusParam = params.get("status") ?? "";

  const kind =
    kindParam && kindParam in BECA_KIND_LABELS ? (kindParam as BecaKind) : undefined;
  const status =
    statusParam && statusParam in BECA_STATUS_LABELS
      ? (statusParam as BecaStatus)
      : undefined;

  const filtered = useMemo(() => {
    let items = [...content.becas];

    if (q.trim()) {
      items = items.filter((beca) =>
        includesText(
          [beca.name, beca.description, beca.audience, ...beca.conditions].join(" "),
          q,
        ),
      );
    }
    if (kind) items = items.filter((beca) => beca.kind === kind);
    if (status) items = items.filter((beca) => beca.status === status);

    items.sort((a, b) => {
      const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      return byStatus !== 0 ? byStatus : b.year - a.year;
    });

    return items;
  }, [content.becas, q, kind, status]);

  function update(patch: Record<string, string | undefined>) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined || value === "") next.delete(key);
      else next.set(key, value);
    }
    setParams(next, { replace: true });
  }

  function clear() {
    setParams(new URLSearchParams(), { replace: true });
  }

  const hasFilters = Boolean(q || kind || status);
  const openCount = content.becas.filter((beca) => beca.status === "abierta").length;

  return (
    <>
      <PageHeader
        eyebrow="Formación"
        title="Becas y convocatorias"
        lead="Oportunidades para estudiantes de grado, graduados y profesionales que quieran formarse en investigación o desarrollar su trabajo final con el CIDTIEE."
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Formación", to: "/formacion" },
          { label: "Becas y convocatorias" },
        ]}
        actions={
          openCount > 0 ? (
            <div className="open-callout">
              <span className="open-callout__dot" aria-hidden="true" />
              {openCount} {openCount === 1 ? "convocatoria abierta" : "convocatorias abiertas"}
            </div>
          ) : undefined
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
              label="Buscar"
              value={q}
              onChange={(value) => update({ q: value })}
              placeholder="Nombre, tema o destinatario"
            />
            <SelectField
              label="Tipo"
              value={kind ?? ""}
              onChange={(value) => update({ kind: value })}
              options={[
                { value: "", label: "Todos" },
                ...Object.entries(BECA_KIND_LABELS).map(([value, label]) => ({ value, label })),
              ]}
            />
            <SelectField
              label="Estado"
              value={status ?? ""}
              onChange={(value) => update({ status: value })}
              options={[
                { value: "", label: "Todos" },
                ...Object.entries(BECA_STATUS_LABELS).map(([value, label]) => ({ value, label })),
              ]}
            />
          </FilterBar>

          <ResultsMeta total={filtered.length} singular="oportunidad" plural="oportunidades">
            {hasFilters && <span className="results-meta__hint">Filtros aplicados</span>}
          </ResultsMeta>

          {filtered.length > 0 ? (
            <div className="grid grid--2">
              {filtered.map((beca) => (
                <BecaCard key={beca.id} beca={beca} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No encontramos oportunidades"
              description="Probá con otro término o quitá algunos filtros."
              action={
                <button className="btn btn--small" type="button" onClick={clear}>
                  Ver todas las oportunidades
                </button>
              }
            />
          )}

          <div className="note-panel">
            <Icon name="info" size={18} />
            <p>
              Las convocatorias externas se rigen por sus propias bases y plazos. Para consultas
              sobre becas con dirección del CIDTIEE, escribí a{" "}
              <a href="mailto:cidtiee@gmail.com">cidtiee@gmail.com</a>.
            </p>
          </div>
        </div>
      </section>

      <ContactBand
        eyebrow="Becas"
        title="¿Querés sumarte al centro?"
        lead="Contanos tu formación y tus intereses para orientarte sobre la convocatoria más adecuada."
      />
    </>
  );
}
