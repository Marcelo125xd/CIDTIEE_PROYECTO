import { Link } from "react-router-dom";
import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { AreaCard, ProjectCard, PublicationItem } from "../components/Cards";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { Section } from "../components/Section";

export function Observatorio() {
  useDocumentTitle("Observatorio");
  const content = useRequiredContent();

  const currentProjects = content.projects
    .filter((project) => project.status === "en-curso")
    .sort((a, b) => b.startYear - a.startYear)
    .slice(0, 3);

  const latestPublications = [...content.publications]
    .sort((a, b) => b.year - a.year || Number(b.featured) - Number(a.featured))
    .slice(0, 6);

  return (
    <>
      <PageHeader
        eyebrow="Observatorio"
        title="Investigación, desarrollo y producción científica"
        lead="El observatorio reúne las líneas de investigación, los proyectos y las publicaciones del CIDTIEE. Es el punto de entrada al conocimiento que produce el centro."
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Observatorio" }]}
        actions={
          <>
            <Link className="btn btn--solid" to="/observatorio/proyectos">
              Ver proyectos <Icon name="arrow-right" size={15} />
            </Link>
            <Link className="btn" to="/observatorio/publicaciones">
              Ver publicaciones
            </Link>
          </>
        }
      />

      <section className="stat-strip" aria-label="Resumen de investigación">
        <div className="container stat-strip__grid">
          {content.site.stats.slice(0, 4).map((stat) => (
            <div className="stat-strip__item" key={stat.key}>
              <span className="stat-strip__value">
                {stat.value}
                {stat.suffix ?? ""}
              </span>
              <span className="stat-strip__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <Section
        eyebrow="Líneas"
        title="Áreas de investigación"
        lead="Cada línea combina formación de recursos humanos, proyectos y transferencia de resultados."
      >
        <div className="grid grid--3">
          {content.areas.map((area) => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      </Section>

      <Section
        alt
        eyebrow="Proyectos"
        title="Investigación en curso"
        lead="Los proyectos activos articulan las líneas del centro con las necesidades del sistema eléctrico."
        action={
          <Link className="btn btn--small" to="/observatorio/proyectos">
            Todos los proyectos <Icon name="arrow-right" size={15} />
          </Link>
        }
      >
        <div className="grid grid--3">
          {currentProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Publicaciones"
        title="Producción científica reciente"
        lead="Artículos, congresos y capítulos de libro de los integrantes del centro."
        action={
          <Link className="btn btn--small" to="/observatorio/publicaciones">
            Ver todas <Icon name="arrow-right" size={15} />
          </Link>
        }
      >
        <div className="pub-list">
          {latestPublications.map((publication) => (
            <PublicationItem key={publication.id} publication={publication} />
          ))}
        </div>
      </Section>

      <Section
        alt
        eyebrow="Producción tecnológica"
        title="Desarrollos y estudios para el sector"
        lead="Modelos, simulaciones y sistemas desarrollados junto a empresas e instituciones del sector eléctrico."
        action={
          <Link className="btn btn--small" to="/transferencia">
            Ver transferencia <Icon name="arrow-right" size={15} />
          </Link>
        }
      >
        <div className="production-grid">
          {content.production.slice(0, 3).map((item) => (
            <article className="production-mini" key={item.id}>
              <p className="production-mini__meta">
                {item.type} {item.year ? `· ${item.year}` : ""}
              </p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.registration && <span>{item.registration}</span>}
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
