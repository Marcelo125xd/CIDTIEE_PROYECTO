import { Link, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import {
  ARCHIVE_ITEM_KIND_LABELS,
  ARCHIVE_ORIGIN_LABELS,
} from "@cidtiee/shared";
import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import {
  archiveItemAuthorLabel,
  archiveItemPeriodLabel,
  archiveSectionPath,
  archiveSubsectionPath,
  findArchiveSection,
  findArchiveSubsection,
  isInternalUrl,
} from "../lib/archive";
import { ArchiveAssetList } from "../components/Archive";
import { Badge } from "../components/Badge";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";

function shortTitle(title: string): string {
  return title.length > 58 ? `${title.slice(0, 55)}…` : title;
}

function ArchiveHrefLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (isInternalUrl(href)) {
    return (
      <Link className={className} to={href}>
        {children}
      </Link>
    );
  }

  return (
    <a className={className} href={href} target="_blank" rel="noreferrer noopener">
      {children}
    </a>
  );
}

export function ArchiveDetailPage() {
  const content = useRequiredContent();
  const { section: sectionSlug, subsection: subsectionSlug, slug } = useParams();

  const section = findArchiveSection(content.archive, sectionSlug);
  const subsection = findArchiveSubsection(section, subsectionSlug);
  const item =
    section && subsection
      ? content.archive.items.find(
          (entry) =>
            entry.section === section.slug &&
            entry.subsection === subsection.slug &&
            entry.slug === slug,
        )
      : undefined;

  useDocumentTitle(item?.title ?? "Registro no encontrado");

  if (!section || !subsection || !item) {
    return (
      <div className="container page-state">
        <p className="eyebrow">Archivo</p>
        <h1>Registro no encontrado</h1>
        <p>La ficha que buscás no existe o cambió de dirección.</p>
        <Link className="btn btn--solid" to="/archivo">
          Volver al archivo <Icon name="arrow-right" size={15} />
        </Link>
      </div>
    );
  }

  const kindLabel = ARCHIVE_ITEM_KIND_LABELS[item.kind];
  const period = item.date || item.endDate ? archiveItemPeriodLabel(item) : "";
  const firstExternalAsset = item.assets.find((asset) => !isInternalUrl(asset.url));

  return (
    <>
      <PageHeader
        eyebrow={`${section.title} · ${kindLabel}`}
        title={item.title}
        lead={item.summary}
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Archivo", to: "/archivo" },
          { label: section.title, to: archiveSectionPath(section.slug) },
          {
            label: subsection.title,
            to: archiveSubsectionPath(section.slug, subsection.slug),
          },
          { label: shortTitle(item.title) },
        ]}
        actions={
          <>
            {item.href && (
              <ArchiveHrefLink className="btn btn--solid" href={item.href}>
                {isInternalUrl(item.href) ? "Ver en el portal" : "Abrir enlace"}{" "}
                <Icon
                  name={isInternalUrl(item.href) ? "arrow-right" : "external"}
                  size={15}
                />
              </ArchiveHrefLink>
            )}
            {firstExternalAsset && (
              <a
                className="btn"
                href={firstExternalAsset.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                Abrir fuente <Icon name="external" size={15} />
              </a>
            )}
          </>
        }
      >
        <div className="detail-badges">
          <Badge tone="strong">{kindLabel}</Badge>
          {item.status && <Badge>{item.status}</Badge>}
          {item.year && <Badge tone="muted">{item.year}</Badge>}
          {item.featured && <Badge tone="solid">Destacado</Badge>}
        </div>
      </PageHeader>

      <section className="page-body">
        <div className="container detail-layout">
          <div className="detail-main">
            {item.body.length > 0 && (
              <div className="prose archive-detail__body">
                {item.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}

            <section className="detail-block">
              <div className="archive-detail__block-head">
                <h2>Archivos y enlaces</h2>
                <span>{item.assets.length}</span>
              </div>
              <ArchiveAssetList assets={item.assets} />
            </section>

            {item.facts.length > 0 && (
              <section className="detail-block">
                <h2>Datos del registro</h2>
                <dl className="meta-list archive-facts">
                  {item.facts.map((fact, index) => (
                    <div key={`${fact.label}-${index}`}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <div className="detail-block">
              <Link
                className="link-arrow"
                to={archiveSubsectionPath(section.slug, subsection.slug)}
              >
                <Icon name="arrow-left" size={15} /> Volver a {subsection.title}
              </Link>
            </div>
          </div>

          <aside className="detail-aside archive-detail-aside">
            <p className="eyebrow">Ficha del archivo</p>
            <dl className="meta-list">
              <div>
                <dt>Tipo</dt>
                <dd>{kindLabel}</dd>
              </div>
              <div>
                <dt>Sección</dt>
                <dd>
                  <Link to={archiveSectionPath(section.slug)}>{section.title}</Link>
                </dd>
              </div>
              <div>
                <dt>Subsección</dt>
                <dd>
                  <Link to={archiveSubsectionPath(section.slug, subsection.slug)}>
                    {subsection.title}
                  </Link>
                </dd>
              </div>
              {item.year && (
                <div>
                  <dt>Año</dt>
                  <dd>{item.year}</dd>
                </div>
              )}
              {period && (
                <div>
                  <dt>Fecha</dt>
                  <dd>{period}</dd>
                </div>
              )}
              {item.status && (
                <div>
                  <dt>Estado</dt>
                  <dd>{item.status}</dd>
                </div>
              )}
              {item.authors.length > 0 && (
                <div>
                  <dt>{archiveItemAuthorLabel(item)}</dt>
                  <dd>{item.authors.join(", ")}</dd>
                </div>
              )}
              <div>
                <dt>Origen</dt>
                <dd>{ARCHIVE_ORIGIN_LABELS[item.origin]}</dd>
              </div>
            </dl>

            {item.tags.length > 0 && (
              <ul className="tag-list archive-detail__tags" aria-label="Temas">
                {item.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            )}

            {item.href && (
              <ArchiveHrefLink className="btn btn--small" href={item.href}>
                {isInternalUrl(item.href) ? "Ver en el portal" : "Abrir enlace"}{" "}
                <Icon
                  name={isInternalUrl(item.href) ? "arrow-right" : "external"}
                  size={14}
                />
              </ArchiveHrefLink>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
