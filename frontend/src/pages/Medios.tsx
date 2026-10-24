import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { formatDate } from "../lib/format";
import { ResourceCard } from "../components/Cards";
import { ContactBand } from "../components/ContactBand";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { Section } from "../components/Section";

export function Medios() {
  useDocumentTitle("Medios");
  const content = useRequiredContent();

  const news = [...content.news].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.date.localeCompare(a.date);
  });

  return (
    <>
      <PageHeader
        eyebrow="Medios"
        title="Novedades y difusión"
        lead="Actividades, convocatorias y resultados del CIDTIEE. Un espacio para seguir la actualidad del centro y acceder a sus recursos."
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Medios" }]}
      />

      <Section
        eyebrow="Actualidad"
        title="Novedades del centro"
        lead="Las últimas actividades, participaciones y anuncios institucionales."
      >
        <div className="news-articles">
          {news.map((item) => (
            <article className="news-article" id={item.id} key={item.id}>
              <div className="news-article__meta">
                <span className="news-article__tag">{item.tag}</span>
                <time dateTime={item.date}>{formatDate(item.date)}</time>
              </div>
              <h2>{item.title}</h2>
              <p className="news-article__summary">{item.summary}</p>
              <div className="prose">
                {item.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {item.url && (
                <a
                  className="link-arrow"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Más información <Icon name="external" size={14} />
                </a>
              )}
            </article>
          ))}
        </div>
      </Section>

      <Section
        alt
        eyebrow="Recursos"
        title="Enlaces y repositorios"
        lead="Publicaciones, materiales, perfiles institucionales y repositorios de acceso abierto."
      >
        <div className="resource-grid">
          {content.resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Redes"
        title="Seguinos"
        lead="Difundimos actividades, convocatorias y resultados en nuestras redes institucionales."
      >
        <div className="social-grid">
          {content.site.links.map((link) => (
            <a
              className="social-card"
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span>{link.label}</span>
              <Icon name="arrow-up-right" size={17} />
            </a>
          ))}
        </div>
      </Section>

      <ContactBand
        eyebrow="Comunicación"
        title="¿Tenés una novedad para difundir?"
        lead="Escribinos para coordinar la publicación de actividades, convocatorias o resultados."
      />
    </>
  );
}
