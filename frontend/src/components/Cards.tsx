import { Link } from "react-router-dom";
import type {
  Area,
  Beca,
  CalendarEvent,
  CaseStudy,
  News,
  Person,
  Production,
  Project,
  Publication,
  Resource,
  Seminar,
  Service,
} from "@cidtiee/shared";
import {
  BECA_KIND_LABELS,
  CALENDAR_TYPE_LABELS,
  PROJECT_TYPE_LABELS,
  PUBLICATION_TYPE_LABELS,
} from "@cidtiee/shared";
import { Badge, BecaStatusBadge, ProjectStatusBadge, SeminarStatusBadge } from "./Badge";
import { Icon } from "./Icon";
import { iconForArea, iconForResource, iconForService } from "../lib/icons";
import { formatAuthors, formatDate, truncate, yearRange } from "../lib/format";

export function AreaCard({ area }: { area: Area }) {
  return (
    <article className="card area-card" id={area.slug}>
      <div className="card__top">
        <span className="card__icon">
          <Icon name={iconForArea(area.icon)} size={24} />
        </span>
        <span className="card__kicker">Línea de investigación</span>
      </div>
      <h3 className="card__title">{area.name}</h3>
      <p className="card__text">{area.description}</p>
      <ul className="card__list">
        {area.lines.slice(0, 4).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="card__footer">
        <Link className="link-arrow" to={`/observatorio/proyectos?area=${area.id}`}>
          Ver proyectos <Icon name="arrow-right" size={15} />
        </Link>
      </div>
    </article>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card project-card">
      <div className="card__top">
        <span className="card__kicker">{project.code ?? PROJECT_TYPE_LABELS[project.type]}</span>
        <ProjectStatusBadge status={project.status} />
      </div>
      <h3 className="card__title">
        <Link to={`/observatorio/proyectos/${project.slug}`}>{project.title}</Link>
      </h3>
      <p className="card__text">{project.summary}</p>
      <div className="card__meta">
        <span>{yearRange(project.startYear, project.endYear)}</span>
        <span>{PROJECT_TYPE_LABELS[project.type]}</span>
        {project.director && <span>{project.director}</span>}
      </div>
      {project.tags.length > 0 && (
        <ul className="tag-list" aria-label="Temas">
          {project.tags.slice(0, 3).map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
      <div className="card__footer">
        <Link className="link-arrow" to={`/observatorio/proyectos/${project.slug}`}>
          Ver proyecto <Icon name="arrow-right" size={15} />
        </Link>
      </div>
    </article>
  );
}

export function PublicationItem({
  publication,
  showAbstract = false,
}: {
  publication: Publication;
  showAbstract?: boolean;
}) {
  const href = publication.url ?? (publication.doi ? `https://doi.org/${publication.doi}` : null);

  return (
    <article className="pub-item">
      <div className="pub-item__year" aria-label={`Año ${publication.year}`}>
        {publication.year}
      </div>
      <div className="pub-item__body">
        <div className="pub-item__top">
          <span className="pub-item__type">{PUBLICATION_TYPE_LABELS[publication.type]}</span>
          {publication.featured && <Badge tone="strong">Destacada</Badge>}
        </div>
        <h3 className="pub-item__title">
          {href ? (
            <a href={href} target="_blank" rel="noreferrer noopener">
              {publication.title} <Icon name="external" size={13} />
            </a>
          ) : (
            publication.title
          )}
        </h3>
        <p className="pub-item__authors">{formatAuthors(publication.authors)}</p>
        <p className="pub-item__venue">{publication.venue}</p>
        {showAbstract && publication.abstract && (
          <p className="pub-item__abstract">{publication.abstract}</p>
        )}
        <div className="pub-item__links">
          {publication.doi && (
            <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noreferrer noopener">
              DOI: {publication.doi}
            </a>
          )}
          {publication.url && publication.doi && (
            <a href={publication.url} target="_blank" rel="noreferrer noopener">
              Ver publicación <Icon name="external" size={12} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function SeminarCard({ seminar }: { seminar: Seminar }) {
  const dateLabel = seminar.date ? formatDate(seminar.date) : `Año ${seminar.year}`;

  return (
    <article className="seminar-card" id={seminar.slug}>
      <div className="seminar-card__edition">
        <span className="seminar-card__number">
          {seminar.edition ? String(seminar.edition).padStart(2, "0") : "—"}
        </span>
        <span className="seminar-card__label">Seminario técnico</span>
      </div>
      <div className="seminar-card__body">
        <div className="seminar-card__top">
          <h3>{seminar.title}</h3>
          <SeminarStatusBadge status={seminar.status} />
        </div>
        <p className="seminar-card__meta">
          <span>
            <Icon name="calendar" size={14} /> {dateLabel}
          </span>
          {seminar.time && (
            <span>
              <Icon name="clock" size={14} /> {seminar.time}
            </span>
          )}
          {seminar.location && (
            <span>
              <Icon name="pin" size={14} /> {seminar.location}
            </span>
          )}
        </p>
        <p className="seminar-card__text">{seminar.description}</p>
        {seminar.topics.length > 0 && (
          <ul className="tag-list" aria-label="Temas">
            {seminar.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        )}
        {(seminar.programUrl || seminar.materialUrl || seminar.registrationUrl) && (
          <div className="seminar-card__links">
            {seminar.programUrl && (
              <a href={seminar.programUrl} target="_blank" rel="noreferrer noopener">
                Programa <Icon name="external" size={12} />
              </a>
            )}
            {seminar.materialUrl && (
              <a href={seminar.materialUrl} target="_blank" rel="noreferrer noopener">
                Material <Icon name="external" size={12} />
              </a>
            )}
            {seminar.registrationUrl && (
              <a href={seminar.registrationUrl} target="_blank" rel="noreferrer noopener">
                Inscripción <Icon name="external" size={12} />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function BecaCard({ beca }: { beca: Beca }) {
  const contactIsEmail = beca.contact?.includes("@");

  return (
    <article className="beca-card" id={beca.slug}>
      <div className="beca-card__top">
        <Badge tone="outline">{BECA_KIND_LABELS[beca.kind]}</Badge>
        <BecaStatusBadge status={beca.status} />
      </div>
      <h3>{beca.name}</h3>
      <p className="beca-card__description">{beca.description}</p>
      <dl className="beca-card__meta">
        <div>
          <dt>Dirigido a</dt>
          <dd>{beca.audience}</dd>
        </div>
        <div>
          <dt>Período</dt>
          <dd>
            {beca.year}
            {beca.closing ? ` · cierre ${formatDate(beca.closing)}` : ""}
          </dd>
        </div>
      </dl>
      {beca.conditions.length > 0 && (
        <div className="beca-card__conditions">
          <p className="beca-card__label">Condiciones</p>
          <ul>
            {beca.conditions.map((condition) => (
              <li key={condition}>{condition}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="beca-card__footer">
        {beca.contact && contactIsEmail && (
          <a className="btn btn--small btn--solid" href={`mailto:${beca.contact}`}>
            <Icon name="mail" size={15} /> Consultar
          </a>
        )}
        {beca.url && (
          <a className="link-arrow" href={beca.url} target="_blank" rel="noreferrer noopener">
            Más información <Icon name="external" size={13} />
          </a>
        )}
      </div>
    </article>
  );
}

export function NewsCard({ item }: { item: News }) {
  return (
    <article className="news-card">
      <div className="news-card__meta">
        <span>{item.tag}</span>
        <time dateTime={item.date}>{formatDate(item.date)}</time>
      </div>
      <h3>
        <Link to={`/medios#${item.id}`}>{item.title}</Link>
      </h3>
      <p>{item.summary}</p>
      <Link className="link-arrow" to={`/medios#${item.id}`}>
        Leer novedad <Icon name="arrow-right" size={15} />
      </Link>
    </article>
  );
}

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <a
      className="resource-card"
      href={resource.url}
      target="_blank"
      rel="noreferrer noopener"
    >
      <span className="resource-card__icon">
        <Icon name={iconForResource(resource.icon)} size={22} />
      </span>
      <span className="resource-card__body">
        <span className="resource-card__type">{resource.type}</span>
        <span className="resource-card__title">{resource.title}</span>
        <span className="resource-card__text">{resource.description}</span>
      </span>
      <Icon name="arrow-up-right" size={16} className="resource-card__arrow" />
    </a>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="card service-card" id={service.slug}>
      <div className="card__top">
        <span className="card__icon">
          <Icon name={iconForService(service.icon)} size={24} />
        </span>
        <span className="card__kicker">{service.category}</span>
      </div>
      <h3 className="card__title">{service.name}</h3>
      <p className="card__text">{service.description}</p>
      <ul className="card__list">
        {service.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="card__footer">
        <a
          className="link-arrow"
          href={`mailto:cidtiee@gmail.com?subject=${encodeURIComponent(`Consulta: ${service.name}`)}`}
        >
          Consultar <Icon name="mail" size={14} />
        </a>
      </div>
    </article>
  );
}

export function PersonCard({
  person,
  areaNames = [],
}: {
  person: Person;
  areaNames?: string[];
}) {
  const initials = person.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <article className="person-card" id={person.id}>
      <div className="person-card__avatar" aria-hidden="true">
        {initials}
      </div>
      <div className="person-card__body">
        <h3>
          {person.title ? `${person.title} ` : ""}
          {person.name}
        </h3>
        <p className="person-card__role">{person.role}</p>
        {person.bio && <p className="person-card__bio">{person.bio}</p>}
        {areaNames.length > 0 && <p className="person-card__areas">{areaNames.join(" · ")}</p>}
        <div className="person-card__links">
          {person.email && (
            <a href={`mailto:${person.email}`}>
              <Icon name="mail" size={13} /> Correo
            </a>
          )}
          {person.profileUrl && (
            <a href={person.profileUrl} target="_blank" rel="noreferrer noopener">
              <Icon name="external" size={13} /> Perfil
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function CaseCard({ item }: { item: CaseStudy }) {
  return (
    <article className="card case-card">
      <div className="card__top">
        <span className="card__kicker">{item.client}</span>
        <span className="case-card__year">{item.year}</span>
      </div>
      <h3 className="card__title">{item.title}</h3>
      <p className="card__text">{item.description}</p>
      {item.outcome && <p className="case-card__outcome">{item.outcome}</p>}
      {item.tags.length > 0 && (
        <ul className="tag-list" aria-label="Temas">
          {item.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function ProductionItem({ item }: { item: Production }) {
  return (
    <article className="production-item">
      <div className="production-item__year">{item.year ?? "—"}</div>
      <div className="production-item__body">
        <div className="production-item__top">
          <span>{item.type}</span>
          {item.withIp && <Badge tone="solid">Con propiedad intelectual</Badge>}
        </div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        {item.registration && <p className="production-item__reg">{item.registration}</p>}
      </div>
    </article>
  );
}

export function EventItem({ event }: { event: CalendarEvent }) {
  const date = new Date(`${event.date.slice(0, 10)}T12:00:00`);
  const day = Number.isNaN(date.getTime()) ? event.date.slice(8, 10) : String(date.getDate());
  const month = Number.isNaN(date.getTime())
    ? event.date.slice(5, 7)
    : date.toLocaleDateString("es-AR", { month: "short" });

  const content = (
    <>
      <span className="event-item__date" aria-hidden="true">
        <span className="event-item__day">{day}</span>
        <span className="event-item__month">{month}</span>
      </span>
      <span className="event-item__body">
        <span className="event-item__type">{CALENDAR_TYPE_LABELS[event.type]}</span>
        <span className="event-item__title">{event.title}</span>
        <span className="event-item__meta">
          {formatDate(event.date)}
          {event.location ? ` · ${event.location}` : ""}
        </span>
      </span>
    </>
  );

  if (event.url) {
    return (
      <a className="event-item" href={event.url} target="_blank" rel="noreferrer noopener">
        {content}
        <Icon name="arrow-up-right" size={15} className="event-item__arrow" />
      </a>
    );
  }

  return <div className="event-item">{content}</div>;
}

export function CompactPublication({ publication }: { publication: Publication }) {
  return (
    <article className="compact-pub">
      <p className="compact-pub__meta">
        {publication.year} · {PUBLICATION_TYPE_LABELS[publication.type]}
      </p>
      <h3>{truncate(publication.title, 150)}</h3>
      <p className="compact-pub__authors">{formatAuthors(publication.authors)}</p>
      <p className="compact-pub__venue">{publication.venue}</p>
    </article>
  );
}
