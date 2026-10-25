import { Link } from "react-router-dom";
import type {
  Archive,
  ArchiveAsset,
  ArchiveItem,
  ArchiveSection,
} from "@cidtiee/shared";
import {
  ARCHIVE_ASSET_KIND_LABELS,
  ARCHIVE_ASSET_SOURCE_LABELS,
  ARCHIVE_ITEM_KIND_LABELS,
} from "@cidtiee/shared";
import {
  archiveItemDateLabel,
  archiveItemPath,
  archiveSectionPath,
  archiveSubsectionPath,
  countArchiveItems,
  isInternalUrl,
} from "../lib/archive";
import { Badge } from "./Badge";
import { Icon, type IconName } from "./Icon";

const SECTION_ICONS: Record<string, IconName> = {
  file: "file",
  calendar: "calendar",
  flask: "flask",
  graduation: "graduation",
  network: "network",
  book: "book",
};

const KIND_ICONS: Record<ArchiveItem["kind"], IconName> = {
  publicacion: "file",
  seminario: "calendar",
  proyecto: "flask",
  beca: "graduation",
  convocatoria: "graduation",
  congreso: "network",
  llamado: "info",
  documento: "book",
  enlace: "external",
};

const ASSET_ICONS: Record<ArchiveAsset["kind"], IconName> = {
  pdf: "file",
  imagen: "file",
  documento: "file",
  planilla: "chart",
  presentacion: "file",
  enlace: "external",
  video: "external",
  otro: "file",
};

export function archiveSectionIcon(icon?: string): IconName {
  return (icon && SECTION_ICONS[icon]) || "book";
}

export function archiveKindIcon(kind: ArchiveItem["kind"]): IconName {
  return KIND_ICONS[kind];
}

function itemCountLabel(count: number): string {
  return count === 1 ? "1 registro" : `${count} registros`;
}

export function ArchiveSectionCard({
  section,
  items,
}: {
  section: ArchiveSection;
  items: ArchiveItem[];
}) {
  const total = countArchiveItems(items, section.slug);

  return (
    <article className="archive-section-card">
      <div className="archive-section-card__head">
        <span className="archive-section-card__icon">
          <Icon name={archiveSectionIcon(section.icon)} size={20} />
        </span>
        <span className="archive-section-card__count">{itemCountLabel(total)}</span>
      </div>

      <h3>
        <Link to={archiveSectionPath(section.slug)}>{section.title}</Link>
      </h3>
      <p className="archive-section-card__description">{section.description}</p>

      <ul className="archive-section-card__list">
        {section.subsections.map((subsection) => (
          <li key={subsection.slug}>
            <Link to={archiveSubsectionPath(section.slug, subsection.slug)}>
              {subsection.title}
            </Link>
            <span>{countArchiveItems(items, section.slug, subsection.slug)}</span>
          </li>
        ))}
      </ul>

      <Link className="link-arrow" to={archiveSectionPath(section.slug)}>
        Explorar sección <Icon name="arrow-right" size={15} />
      </Link>
    </article>
  );
}

export function ArchiveItemCard({ item }: { item: ArchiveItem }) {
  const date = archiveItemDateLabel(item);

  return (
    <article className="archive-card">
      <div className="archive-card__top">
        <span className="archive-card__kind">
          <Icon name={archiveKindIcon(item.kind)} size={14} />
          {ARCHIVE_ITEM_KIND_LABELS[item.kind]}
        </span>
        <span className="archive-card__top-right">
          {item.featured && <Badge tone="strong">Destacado</Badge>}
          {date && <span className="archive-card__date">{date}</span>}
        </span>
      </div>

      <h3>
        <Link to={archiveItemPath(item)}>{item.title}</Link>
      </h3>
      <p className="archive-card__summary">{item.summary}</p>

      {item.tags.length > 0 && (
        <ul className="tag-list" aria-label="Temas">
          {item.tags.slice(0, 4).map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}

      <div className="archive-card__footer">
        <Link className="link-arrow" to={archiveItemPath(item)}>
          Ver ficha <Icon name="arrow-right" size={15} />
        </Link>
        {item.assets.length > 0 && (
          <span className="archive-card__assets">
            <Icon name="external" size={12} /> {item.assets.length}{" "}
            {item.assets.length === 1 ? "material" : "materiales"}
          </span>
        )}
      </div>
    </article>
  );
}

export function ArchiveSidebar({
  archive,
  activeSection,
  activeSubsection,
}: {
  archive: Archive;
  activeSection?: string;
  activeSubsection?: string;
}) {
  return (
    <aside className="archive-sidebar">
      <p className="archive-sidebar__eyebrow">Archivo</p>
      <nav className="archive-sidebar__nav" aria-label="Secciones del archivo">
        {archive.sections.map((section) => {
          const active = section.slug === activeSection;
          return (
            <div
              className={`archive-sidebar__group${active ? " is-active" : ""}`}
              key={section.slug}
            >
              <Link className="archive-sidebar__link" to={archiveSectionPath(section.slug)}>
                <span>{section.title}</span>
                <span className="archive-sidebar__count">
                  {countArchiveItems(archive.items, section.slug)}
                </span>
              </Link>

              {active && (
                <ul className="archive-sidebar__subs">
                  {section.subsections.map((subsection) => (
                    <li key={subsection.slug}>
                      <Link
                        className={
                          subsection.slug === activeSubsection ? "is-current" : undefined
                        }
                        to={archiveSubsectionPath(section.slug, subsection.slug)}
                      >
                        <span>{subsection.title}</span>
                        <span>
                          {countArchiveItems(archive.items, section.slug, subsection.slug)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
      <Link className="archive-sidebar__back" to="/archivo">
        <Icon name="arrow-left" size={14} /> Portada del archivo
      </Link>
    </aside>
  );
}

function AssetLink({ asset }: { asset: ArchiveAsset }) {
  const external = !isInternalUrl(asset.url);

  return (
    <a
      href={asset.url}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      {...(asset.download ? { download: true } : {})}
    >
      {asset.label} <Icon name={external ? "external" : "arrow-right"} size={12} />
    </a>
  );
}

export function ArchiveAssetList({ assets }: { assets: ArchiveAsset[] }) {
  if (assets.length === 0) {
    return (
      <p className="archive-assets__empty">
        Esta ficha es descriptiva y todavía no tiene un archivo o enlace asociado.
      </p>
    );
  }

  return (
    <ul className="archive-assets">
      {assets.map((asset) => (
        <li className="archive-asset" key={asset.id}>
          <div className="archive-asset__head">
            <span className="archive-asset__icon">
              <Icon name={ASSET_ICONS[asset.kind]} size={18} />
            </span>
            <div className="archive-asset__body">
              <p className="archive-asset__title">
                <AssetLink asset={asset} />
              </p>
              <p className="archive-asset__meta">
                {ARCHIVE_ASSET_KIND_LABELS[asset.kind]} ·{" "}
                {ARCHIVE_ASSET_SOURCE_LABELS[asset.source]}
                {asset.format ? ` · ${asset.format}` : ""}
                {asset.size ? ` · ${asset.size}` : ""}
              </p>
              {asset.description && (
                <p className="archive-asset__description">{asset.description}</p>
              )}
            </div>
          </div>

          {asset.preview === "pdf" && isInternalUrl(asset.url) && (
            <div className="archive-asset__preview">
              <iframe src={asset.url} title={asset.label} loading="lazy" />
            </div>
          )}

          {asset.preview === "imagen" && isInternalUrl(asset.url) && (
            <a
              className="archive-asset__image"
              href={asset.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src={asset.url} alt={asset.label} loading="lazy" />
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
