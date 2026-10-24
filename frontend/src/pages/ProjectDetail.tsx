import { Link, useParams } from "react-router-dom";
import { PROJECT_STATUS_LABELS, PROJECT_TYPE_LABELS } from "@cidtiee/shared";
import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { yearRange } from "../lib/format";
import { Badge, ProjectStatusBadge } from "../components/Badge";
import { ProjectCard } from "../components/Cards";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { Section } from "../components/Section";

export function ProjectDetail() {
  const content = useRequiredContent();
  const { slug } = useParams();
  const project = content.projects.find((item) => item.slug === slug);

  useDocumentTitle(project?.title ?? "Proyecto no encontrado");

  if (!project) {
    return (
      <div className="container page-state">
        <p className="eyebrow">Observatorio</p>
        <h1>Proyecto no encontrado</h1>
        <p>El proyecto que buscás no existe o cambió de dirección.</p>
        <Link className="btn btn--solid" to="/observatorio/proyectos">
          Volver a proyectos <Icon name="arrow-left" size={15} />
        </Link>
      </div>
    );
  }

  const areaNames = project.areas
    .map((id) => content.areas.find((area) => area.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  const related = content.projects
    .filter(
      (item) =>
        item.slug !== project.slug && item.areas.some((area) => project.areas.includes(area)),
    )
    .slice(0, 3);

  const description = project.description.length > 0 ? project.description : [project.summary];

  return (
    <>
      <PageHeader
        eyebrow={project.code ?? "Proyecto de investigación"}
        title={project.title}
        lead={project.summary}
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Observatorio", to: "/observatorio" },
          { label: "Proyectos", to: "/observatorio/proyectos" },
          { label: "Detalle" },
        ]}
        actions={
          <div className="detail-badges">
            <ProjectStatusBadge status={project.status} />
            <Badge tone="outline">{project.type}</Badge>
          </div>
        }
      />

      <section className="page-body">
        <div className="container detail-layout">
          <div className="detail-main">
            <div className="prose">
              {description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {project.tags.length > 0 && (
              <div className="detail-block">
                <p className="panel-title">Temas</p>
                <ul className="tag-list">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.participants.length > 0 && (
              <div className="detail-block">
                <p className="panel-title">Participantes</p>
                <ul className="link-list link-list--plain">
                  {project.participants.map((participant) => (
                    <li key={participant}>{participant}</li>
                  ))}
                </ul>
              </div>
            )}

            {areaNames.length > 0 && (
              <div className="detail-block">
                <p className="panel-title">Líneas de investigación</p>
                <ul className="tag-list">
                  {areaNames.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="detail-block">
              <p className="panel-title">Contacto</p>
              <p className="detail-contact">
                Para consultas sobre este proyecto, escribinos a{" "}
                <a href={`mailto:cidtiee@gmail.com?subject=${encodeURIComponent(project.title)}`}>
                  cidtiee@gmail.com
                </a>
                .
              </p>
            </div>
          </div>

          <aside className="detail-aside">
            <p className="panel-title">Ficha del proyecto</p>
            <dl className="meta-list">
              {project.code && (
                <div>
                  <dt>Código</dt>
                  <dd>{project.code}</dd>
                </div>
              )}
              <div>
                <dt>Tipo</dt>
                <dd>{PROJECT_TYPE_LABELS[project.type]}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{PROJECT_STATUS_LABELS[project.status]}</dd>
              </div>
              <div>
                <dt>Período</dt>
                <dd>{yearRange(project.startYear, project.endYear)}</dd>
              </div>
              {project.director && (
                <div>
                  <dt>Dirección</dt>
                  <dd>{project.director}</dd>
                </div>
              )}
              {project.codirector && (
                <div>
                  <dt>Codirección</dt>
                  <dd>{project.codirector}</dd>
                </div>
              )}
              {project.funding && (
                <div>
                  <dt>Financiamiento</dt>
                  <dd>{project.funding}</dd>
                </div>
              )}
              {areaNames.length > 0 && (
                <div>
                  <dt>Líneas</dt>
                  <dd>{areaNames.join(", ")}</dd>
                </div>
              )}
            </dl>
            <a
              className="btn btn--solid btn--block"
              href={`mailto:cidtiee@gmail.com?subject=${encodeURIComponent(project.title)}`}
            >
              <Icon name="mail" size={16} /> Consultar por el proyecto
            </a>
            <Link className="btn btn--block" to="/observatorio/proyectos">
              <Icon name="arrow-left" size={15} /> Volver al listado
            </Link>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <Section
          alt
          eyebrow="Seguir explorando"
          title="Proyectos relacionados"
          lead="Otros proyectos del centro vinculados a las mismas líneas de investigación."
        >
          <div className="grid grid--3">
            {related.map((item) => (
              <ProjectCard key={item.id} project={item} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
