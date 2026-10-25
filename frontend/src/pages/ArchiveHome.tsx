import { Link } from "react-router-dom";
import { ARCHIVE_ITEM_KIND_LABELS } from "@cidtiee/shared";
import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import {
  ArchiveItemCard,
  ArchiveSectionCard,
  archiveKindIcon,
} from "../components/Archive";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { Section } from "../components/Section";

export function ArchiveHome() {
  useDocumentTitle("Archivo");
  const content = useRequiredContent();
  const archive = content.archive;

  const total = archive.items.length;
  const catalog = archive.items.filter((item) => item.origin !== "portal").length;
  const subsections = archive.sections.reduce(
    (count, section) => count + section.subsections.length,
    0,
  );
  const featured = archive.items.filter((item) => item.featured).slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow="Archivo"
        title="Archivo del CIDTIEE"
        lead={archive.intro}
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Archivo" }]}
        actions={
          <a className="btn btn--solid" href="#secciones">
            Explorar secciones <Icon name="arrow-right" size={15} />
          </a>
        }
      />

      <section className="page-body archive-home">
        <div className="container">
          <div className="archive-stats" aria-label="Resumen del archivo">
            <div>
              <strong>{total}</strong>
              <span>registros</span>
            </div>
            <div>
              <strong>{archive.sections.length}</strong>
              <span>secciones</span>
            </div>
            <div>
              <strong>{subsections}</strong>
              <span>subsecciones</span>
            </div>
            <div>
              <strong>{catalog}</strong>
              <span>registros del catálogo</span>
            </div>
          </div>

          <div className="grid grid--3 archive-section-grid" id="secciones">
            {archive.sections.map((section) => (
              <ArchiveSectionCard
                key={section.slug}
                section={section}
                items={archive.items}
              />
            ))}
          </div>

          <div className="archive-scope">
            <div className="archive-scope__copy">
              <p className="eyebrow">Alcance</p>
              <h2>Cómo se organiza este archivo</h2>
            </div>
            <ul className="archive-scope__notes">
              {archive.scopeNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="archive-kinds" aria-label="Tipos de registro">
            {Object.entries(ARCHIVE_ITEM_KIND_LABELS).map(([kind, label]) => {
              const count = archive.items.filter((item) => item.kind === kind).length;
              if (count === 0) return null;
              return (
                <span className="archive-kind" key={kind}>
                  <Icon
                    name={archiveKindIcon(kind as keyof typeof ARCHIVE_ITEM_KIND_LABELS)}
                    size={15}
                  />
                  {label}
                  <span className="archive-kind__count">{count}</span>
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <Section
          alt
          eyebrow="Selección"
          title="Registros destacados"
          lead="Una selección de fichas para empezar a recorrer el archivo."
          action={
            <Link className="btn" to="/archivo/congresos">
              Ver congresos y llamados <Icon name="arrow-right" size={15} />
            </Link>
          }
        >
          <div className="grid grid--2">
            {featured.map((item) => (
              <ArchiveItemCard key={item.id} item={item} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
