import { Link } from "react-router-dom";
import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { BecaCard, SeminarCard } from "../components/Cards";
import { ContactBand } from "../components/ContactBand";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { Section } from "../components/Section";

export function Formacion() {
  useDocumentTitle("Formación");
  const content = useRequiredContent();

  const openBecas = content.becas.filter((beca) => beca.status === "abierta");
  const latestSeminars = [...content.seminars]
    .sort((a, b) => (b.date ?? `${b.year}-01-01`).localeCompare(a.date ?? `${a.year}-01-01`))
    .slice(0, 3);
  const otherBecas = content.becas.filter(
    (beca) => beca.status === "permanente" || beca.status === "externa",
  );

  return (
    <>
      <PageHeader
        eyebrow="Formación"
        title="Formación de recursos humanos en energía eléctrica"
        lead="El CIDTIEE forma investigadores y profesionales a través de trabajos finales, tesis, becas, seminarios técnicos y capacitaciones especializadas."
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Formación" }]}
        actions={
          <>
            <Link className="btn btn--solid" to="/becas">
              Becas y convocatorias <Icon name="arrow-right" size={15} />
            </Link>
            <Link className="btn" to="/seminarios">
              Seminarios técnicos
            </Link>
          </>
        }
      />

      <Section
        eyebrow="Trayectorias"
        title="Cómo se forma en el CIDTIEE"
        lead="La formación se integra con la investigación y la transferencia, con acompañamiento de investigadores del centro."
      >
        <div className="path-grid">
          <article className="path-card">
            <span className="path-card__num">01</span>
            <h3>Trabajos finales de grado</h3>
            <p>
              Estudiantes avanzados desarrollan su trabajo final en temas de sistemas de potencia,
              gestión de la demanda, generación distribuida o movilidad eléctrica.
            </p>
            <Link className="link-arrow" to="/becas">
              Ver convocatorias <Icon name="arrow-right" size={15} />
            </Link>
          </article>
          <article className="path-card">
            <span className="path-card__num">02</span>
            <h3>Tesis de posgrado</h3>
            <p>
              Dirección de tesis de maestría y doctorado en ingeniería, con producción científica y
              vinculación con problemas reales del sector.
            </p>
            <Link className="link-arrow" to="/institucional">
              Conocer al equipo <Icon name="arrow-right" size={15} />
            </Link>
          </article>
          <article className="path-card">
            <span className="path-card__num">03</span>
            <h3>Becas de investigación</h3>
            <p>
              Becas de iniciación, doctorales y posdoctorales que permiten dedicación a la
              investigación y a la formación avanzada.
            </p>
            <Link className="link-arrow" to="/becas">
              Ver becas <Icon name="arrow-right" size={15} />
            </Link>
          </article>
          <article className="path-card">
            <span className="path-card__num">04</span>
            <h3>Capacitación profesional</h3>
            <p>
              Seminarios técnicos y cursos a medida sobre seguridad eléctrica, eficiencia,
              generación distribuida, movilidad eléctrica y sistemas de potencia.
            </p>
            <Link className="link-arrow" to="/servicios">
              Ver capacitaciones <Icon name="arrow-right" size={15} />
            </Link>
          </article>
        </div>
      </Section>

      {openBecas.length > 0 && (
        <Section
          alt
          eyebrow="Convocatorias abiertas"
          title="Oportunidades para estudiantes"
          lead="Convocatorias vigentes para realizar trabajos finales o iniciarte en la investigación."
          action={
            <Link className="btn btn--small" to="/becas">
              Todas las convocatorias <Icon name="arrow-right" size={15} />
            </Link>
          }
        >
          <div className="grid grid--2">
            {openBecas.map((beca) => (
              <BecaCard key={beca.id} beca={beca} />
            ))}
          </div>
        </Section>
      )}

      <Section
        eyebrow="Seminarios"
        title="Últimas ediciones"
        lead="Un espacio de actualización técnica abierto a profesionales, docentes y estudiantes."
        action={
          <Link className="btn btn--small" to="/seminarios">
            Ver todos los seminarios <Icon name="arrow-right" size={15} />
          </Link>
        }
      >
        <div className="seminar-list">
          {latestSeminars.map((seminar) => (
            <SeminarCard key={seminar.id} seminar={seminar} />
          ))}
        </div>
      </Section>

      {otherBecas.length > 0 && (
        <Section
          alt
          eyebrow="Becas"
          title="Otras oportunidades"
          lead="Programas permanentes y convocatorias externas con acompañamiento del centro."
        >
          <div className="beca-list">
            {otherBecas.map((beca) => (
              <article className="beca-row" key={beca.id}>
                <div>
                  <p className="beca-row__kind">{beca.kind === "beca" ? "Beca" : "Convocatoria"}</p>
                  <h3>{beca.name}</h3>
                  <p>{beca.description}</p>
                </div>
                <div className="beca-row__meta">
                  <span>{beca.audience}</span>
                  <Link className="link-arrow" to="/becas">
                    Ver detalles <Icon name="arrow-right" size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Section>
      )}

      <ContactBand
        eyebrow="Formación"
        title="¿Estás buscando un tema de tesis o trabajo final?"
        lead="Escribinos con tus intereses y te orientamos sobre las líneas disponibles."
      />
    </>
  );
}
