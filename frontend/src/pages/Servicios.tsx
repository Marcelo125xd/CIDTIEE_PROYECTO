import { Link } from "react-router-dom";
import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { ServiceCard } from "../components/Cards";
import { ContactBand } from "../components/ContactBand";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { Section } from "../components/Section";

export function Servicios() {
  useDocumentTitle("Servicios");
  const content = useRequiredContent();

  const categories = [...new Set(content.services.map((service) => service.category))];
  const groups = categories.map((category) => ({
    category,
    services: content.services.filter((service) => service.category === category),
  }));

  return (
    <>
      <PageHeader
        eyebrow="Servicios"
        title="Capacidades técnicas al servicio del sector"
        lead="Estudios, mediciones, análisis y capacitaciones para empresas, cooperativas, organismos y profesionales de la ingeniería eléctrica."
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Servicios" }]}
        actions={
          <>
            <a className="btn btn--solid" href="mailto:cidtiee@gmail.com">
              <Icon name="mail" size={16} /> Solicitar una propuesta
            </a>
            <Link className="btn" to="/transferencia">
              Ver experiencia
            </Link>
          </>
        }
      />

      <section className="stat-strip" aria-label="Servicios del centro">
        <div className="container stat-strip__grid">
          <div className="stat-strip__item">
            <span className="stat-strip__value">{content.services.length}</span>
            <span className="stat-strip__label">Servicios técnicos</span>
          </div>
          <div className="stat-strip__item">
            <span className="stat-strip__value">{categories.length}</span>
            <span className="stat-strip__label">Áreas de especialidad</span>
          </div>
          <div className="stat-strip__item">
            <span className="stat-strip__value">{content.cases.length}</span>
            <span className="stat-strip__label">Casos realizados</span>
          </div>
          <div className="stat-strip__item">
            <span className="stat-strip__value">UTN</span>
            <span className="stat-strip__label">Respaldo académico</span>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Especialidades"
        title="Qué podemos hacer"
        lead="Cada servicio se adapta al alcance y al contexto del cliente, con entregables técnicos claros."
      >
        <div className="service-groups">
          {groups.map((group) => (
            <div className="service-group" key={group.category}>
              <div className="service-group__head">
                <h3>{group.category}</h3>
                <span>{group.services.length}</span>
              </div>
              <div className="grid grid--2">
                {group.services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        alt
        eyebrow="Modalidades"
        title="Formas de trabajo"
        lead="La vinculación puede adoptar distintas formas según la necesidad y el grado de desarrollo."
      >
        <div className="grid grid--3">
          <article className="modality-card">
            <Icon name="file" size={22} />
            <h3>Estudios técnicos</h3>
            <p>Informes de diagnóstico, factibilidad, calidad de potencia, protecciones o planificación.</p>
          </article>
          <article className="modality-card">
            <Icon name="flask" size={22} />
            <h3>Desarrollo y modelado</h3>
            <p>Modelos de simulación, sistemas expertos, herramientas de cálculo y prototipos.</p>
          </article>
          <article className="modality-card">
            <Icon name="graduation" size={22} />
            <h3>Capacitación</h3>
            <p>Cursos y talleres a medida para equipos técnicos, instaladores y docentes.</p>
          </article>
        </div>
      </Section>

      <ContactBand
        eyebrow="Servicios"
        title="Armemos una propuesta"
        lead="Escribinos con tu necesidad y coordinamos una primera reunión técnica."
      />
    </>
  );
}
