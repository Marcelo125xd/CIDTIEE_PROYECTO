import { Link, useParams } from "react-router-dom";
import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import {
  archiveItemDateLabel,
  archiveItemPath,
  archiveSubsectionPath,
  findArchiveSection,
} from "../lib/archive";
import { ArchiveSidebar } from "../components/Archive";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";

export function ArchiveSectionPage() {
  const content = useRequiredContent();
  const { section: sectionSlug } = useParams();
  const section = findArchiveSection(content.archive, sectionSlug);

  useDocumentTitle(section?.title ?? "Sección no encontrada");

  if (!section) {
    return (
      <div className="container page-state">
        <p className="eyebrow">Archivo</p>
        <h1>Sección no encontrada</h1>
        <p>La sección del archivo que buscás no existe o cambió de dirección.</p>
        <Link className="btn btn--solid" to="/archivo">
          Volver al archivo <Icon name="arrow-right" size={15} />
        </Link>
      </div>
    );
  }

  const sectionItems = content.archive.items.filter((item) => item.section === section.slug);

  return (
    <>
      <PageHeader
        eyebrow="Archivo"
        title={section.title}
        lead={section.description}
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Archivo", to: "/archivo" },
          { label: section.title },
        ]}
        actions={
          <Link className="btn" to="/archivo">
            <Icon name="arrow-left" size={15} /> Portada del archivo
          </Link>
        }
      />

      <section className="page-body">
        <div className="container archive-layout">
          <ArchiveSidebar archive={content.archive} activeSection={section.slug} />

          <div className="archive-main">
            {section.intro.length > 0 && (
              <div className="prose archive-intro">
                {section.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}

            <div className="archive-subsection-grid">
              {section.subsections.map((subsection) => {
                const items = sectionItems.filter(
                  (item) => item.subsection === subsection.slug,
                );
                const recent = items.slice(0, 3);

                return (
                  <article className="archive-subsection-card" key={subsection.slug}>
                    <div className="archive-subsection-card__head">
                      <h2>
                        <Link
                          to={archiveSubsectionPath(section.slug, subsection.slug)}
                        >
                          {subsection.title}
                        </Link>
                      </h2>
                      <span className="archive-subsection-card__count">{items.length}</span>
                    </div>
                    <p className="archive-subsection-card__description">
                      {subsection.description}
                    </p>

                    {recent.length > 0 ? (
                      <ul className="archive-subsection-card__items">
                        {recent.map((item) => (
                          <li key={item.id}>
                            <Link to={archiveItemPath(item)}>{item.title}</Link>
                            <span>{archiveItemDateLabel(item)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="archive-subsection-card__empty">
                        Todavía no hay registros publicados en esta subsección.
                      </p>
                    )}

                    <Link
                      className="link-arrow"
                      to={archiveSubsectionPath(section.slug, subsection.slug)}
                    >
                      {items.length === 0
                        ? "Ver subsección"
                        : items.length === 1
                          ? "Ver el registro"
                          : `Ver los ${items.length} registros`}{" "}
                      <Icon name="arrow-right" size={15} />
                    </Link>
                  </article>
                );
              })}
            </div>

            <div className="note-panel">
              <Icon name="info" size={18} />
              <p>
                Las subsecciones sin registros se conservan como parte de la estructura del
                archivo y se completarán a medida que se incorpore material público.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
