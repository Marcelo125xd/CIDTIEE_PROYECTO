import { Link } from "react-router-dom";
import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { formatDate, todayIso } from "../lib/format";
import { ContactBand } from "../components/ContactBand";
import {
  AreaCard,
  CompactPublication,
  EventItem,
  NewsCard,
  ProjectCard,
  ServiceCard,
} from "../components/Cards";
import { Icon } from "../components/Icon";
import { Section } from "../components/Section";

export function Home() {
  useDocumentTitle();
  const content = useRequiredContent();
  const { site } = content;

  const currentProjects = content.projects
    .filter((project) => project.status === "en-curso")
    .sort((a, b) => b.startYear - a.startYear)
    .slice(0, 3);

  const latestPublications = [...content.publications]
    .sort((a, b) => b.year - a.year || Number(b.featured) - Number(a.featured))
    .slice(0, 4);

  const upcoming = [...content.calendar]
    .filter((event) => event.date >= todayIso())
    .sort((a, b) => a.date.localeCompare(b.date));

  const agenda =
    upcoming.length > 0
      ? upcoming.slice(0, 4)
      : [...content.calendar].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  const nextEvent = upcoming[0];

  const news = [...content.news]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const services = content.services.filter((service) => service.featured).slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">{site.hero.eyebrow}</p>
            <h1>{site.hero.title}</h1>
            <p className="hero__lead">{site.hero.lead}</p>
            <div className="hero__actions">
              <Link className="btn btn--solid" to={site.hero.primaryCta.href}>
                {site.hero.primaryCta.label} <Icon name="arrow-right" size={16} />
              </Link>
              {site.hero.secondaryCta && (
                <Link className="btn" to={site.hero.secondaryCta.href}>
                  {site.hero.secondaryCta.label}
                </Link>
              )}
            </div>
            <p className="hero__resolution">{site.resolution}</p>
          </div>

          <div className="stats" aria-label="El CIDTIEE en cifras">
            {site.stats.slice(0, 6).map((stat) => (
              <div className="stat" key={stat.key}>
                <span className="stat__value">
                  {stat.value}
                  {stat.suffix ?? ""}
                </span>
                <span className="stat__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {nextEvent && (
        <div className="next-event">
          <div className="container next-event__inner">
            <span className="next-event__label">
              <Icon name="calendar" size={15} /> Próxima actividad
            </span>
            <span className="next-event__date">{formatDate(nextEvent.date)}</span>
            <span className="next-event__title">{nextEvent.title}</span>
            <Link className="next-event__link" to="/calendario">
              Ver agenda <Icon name="arrow-right" size={14} />
            </Link>
          </div>
        </div>
      )}

      <Section
        eyebrow="Investigación"
        title="Líneas de trabajo"
        lead="Seis ejes articulan la investigación aplicada, la formación y la transferencia del centro."
        action={
          <Link className="btn btn--small" to="/observatorio">
            Ver observatorio <Icon name="arrow-right" size={15} />
          </Link>
        }
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
        lead="Proyectos PID y PID-PP que abordan los desafíos técnicos, económicos y regulatorios del sistema eléctrico."
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
        eyebrow="Actualidad"
        title="Agenda y novedades"
        lead="Seminarios, convocatorias y las últimas actividades del centro."
        action={
          <Link className="btn btn--small" to="/calendario">
            Calendario completo <Icon name="calendar" size={15} />
          </Link>
        }
      >
        <div className="split-grid">
          <div className="panel">
            <p className="panel-title">
              Próximas actividades <span>{agenda.length}</span>
            </p>
            <div className="event-list">
              {agenda.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </div>
          </div>
          <div className="panel">
            <p className="panel-title">
              Novedades <span>{news.length}</span>
            </p>
            <div className="news-list">
              {news.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        alt
        eyebrow="Producción científica"
        title="Publicaciones recientes"
        lead="Artículos en revistas internacionales, congresos y capítulos de libro de los integrantes del CIDTIEE."
        action={
          <Link className="btn btn--small" to="/observatorio/publicaciones">
            Ver publicaciones <Icon name="arrow-right" size={15} />
          </Link>
        }
      >
        <div className="compact-grid">
          {latestPublications.map((publication) => (
            <CompactPublication key={publication.id} publication={publication} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Transferencia"
        title="Servicios técnicos"
        lead="Capacidades del centro al servicio de empresas, cooperativas, organismos y profesionales del sector."
        action={
          <Link className="btn btn--small" to="/servicios">
            Ver todos los servicios <Icon name="arrow-right" size={15} />
          </Link>
        }
      >
        <div className="grid grid--2">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Section>

      <ContactBand />
    </>
  );
}
