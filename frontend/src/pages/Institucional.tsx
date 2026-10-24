import type { PersonCategory } from "@cidtiee/shared";
import { PERSON_CATEGORY_LABELS } from "@cidtiee/shared";
import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { ContactBand } from "../components/ContactBand";
import { PersonCard } from "../components/Cards";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { Section } from "../components/Section";

const CATEGORY_ORDER: PersonCategory[] = ["direccion", "investigacion", "honorario"];

export function Institucional() {
  useDocumentTitle("Institucional");
  const content = useRequiredContent();
  const { site } = content;

  const areaName = (id: string) => content.areas.find((area) => area.id === id)?.name;

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    people: content.people
      .filter((person) => person.category === category)
      .sort((a, b) => a.name.localeCompare(b.name, "es")),
  })).filter((group) => group.people.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Institucional"
        title="Un centro de investigación de la UTN Facultad Regional Córdoba"
        lead={site.tagline}
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Institucional" }]}
      />

      <Section
        eyebrow="Trayectoria"
        title="Historia del centro"
        lead="Del Grupo de Investigación sobre Calidad de Potencia al CIDTIEE."
      >
        <div className="prose-layout">
          <div className="prose">
            {site.history.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>{site.facilities}</p>
          </div>
          <aside className="fact-panel">
            <p className="panel-title">Datos institucionales</p>
            <dl className="meta-list">
              <div>
                <dt>Universidad</dt>
                <dd>{site.university}</dd>
              </div>
              <div>
                <dt>Facultad</dt>
                <dd>{site.faculty}</dd>
              </div>
              <div>
                <dt>Departamento</dt>
                <dd>{site.department}</dd>
              </div>
              <div>
                <dt>Creación</dt>
                <dd>27 de junio de 2019</dd>
              </div>
              <div>
                <dt>Resolución</dt>
                <dd>CSU 780/2019</dd>
              </div>
              <div>
                <dt>Sede</dt>
                <dd>{site.contact.city}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </Section>

      <Section
        alt
        eyebrow="Identidad"
        title="Misión, visión y valores"
        lead="El marco que orienta la actividad académica, técnica y de vinculación del centro."
      >
        <div className="identity-grid">
          <article className="identity-card">
            <p className="identity-card__label">Misión</p>
            <p>{site.mission}</p>
          </article>
          <article className="identity-card">
            <p className="identity-card__label">Visión</p>
            <p>{site.vision}</p>
          </article>
          <article className="identity-card">
            <p className="identity-card__label">Valores</p>
            <ul className="value-list">
              {site.values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </article>
        </div>
      </Section>

      <Section
        eyebrow="Objetivos"
        title="Qué nos proponemos"
        lead="Objetivos generales aprobados en la creación del centro."
      >
        <ol className="objective-list">
          {site.objectives.map((objective, index) => (
            <li key={objective}>
              <span className="objective-list__num">{String(index + 1).padStart(2, "0")}</span>
              <span>{objective}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        alt
        eyebrow="Autoridades"
        title="Conducción institucional"
        lead="Dirección y coordinación de las áreas de investigación, capacitación y servicios."
      >
        <div className="grid grid--4">
          {site.authorities.map((authority) => (
            <article className="authority-card" key={`${authority.role}-${authority.name}`}>
              <p className="authority-card__role">{authority.role}</p>
              <h3>{authority.name}</h3>
              {authority.area && <p className="authority-card__area">{authority.area}</p>}
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="personas"
        eyebrow="Equipo"
        title="Integrantes"
        lead="Investigadores, profesionales y miembros honorarios que forman parte del CIDTIEE."
      >
        <div className="people-groups">
          {groups.map((group) => (
            <div className="people-group" key={group.category}>
              <div className="people-group__head">
                <h3>{PERSON_CATEGORY_LABELS[group.category]}</h3>
                <span>{group.people.length}</span>
              </div>
              <div className="grid grid--2">
                {group.people.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    areaNames={person.areaIds
                      .map(areaName)
                      .filter((name): name is string => Boolean(name))}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        alt
        eyebrow="Contacto"
        title="Cómo encontrarnos"
        lead="El centro está abierto a consultas de estudiantes, profesionales, empresas e instituciones."
      >
        <div className="contact-grid">
          <div className="contact-card">
            <p className="panel-title">Dirección y contacto</p>
            <address>
              <p>{site.contact.address}</p>
              <p>
                {site.contact.city}
                {site.contact.postalCode ? ` · ${site.contact.postalCode}` : ""}
              </p>
              <p>
                <a href={`mailto:${site.contact.email}`}>
                  <Icon name="mail" size={15} /> {site.contact.email}
                </a>
              </p>
              <p>
                <a href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}>
                  <Icon name="phone" size={15} /> {site.contact.phone}
                  {site.contact.extension ? ` · int. ${site.contact.extension}` : ""}
                </a>
              </p>
              {site.contact.mapsUrl && (
                <p>
                  <a href={site.contact.mapsUrl} target="_blank" rel="noreferrer noopener">
                    <Icon name="pin" size={15} /> Ver ubicación en el mapa
                  </a>
                </p>
              )}
            </address>
          </div>

          <div className="contact-card">
            <p className="panel-title">Enlaces institucionales</p>
            <ul className="link-list">
              {site.links.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noreferrer noopener">
                    <span>{link.label}</span>
                    <Icon name="arrow-up-right" size={15} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <ContactBand
        eyebrow="Vinculación"
        title="Acercate al CIDTIEE"
        lead="Podemos orientarte sobre formación, proyectos, becas o asistencia técnica."
      />
    </>
  );
}
