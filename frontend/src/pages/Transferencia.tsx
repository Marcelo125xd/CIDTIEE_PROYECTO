import { Link } from "react-router-dom";
import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { CaseCard, ProductionItem } from "../components/Cards";
import { ContactBand } from "../components/ContactBand";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { Section } from "../components/Section";

export function Transferencia() {
  useDocumentTitle("Transferencia");
  const content = useRequiredContent();

  const cases = [...content.cases].sort((a, b) => b.year - a.year);
  const production = [...content.production].sort(
    (a, b) => (b.year ?? 0) - (a.year ?? 0),
  );

  return (
    <>
      <PageHeader
        eyebrow="Transferencia"
        title="Conocimiento aplicado al sector eléctrico"
        lead="El CIDTIEE transfiere capacidades técnicas a empresas, cooperativas y organismos mediante estudios, desarrollos, asistencia técnica y formación especializada."
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Transferencia" }]}
        actions={
          <>
            <Link className="btn btn--solid" to="/servicios">
              Ver servicios <Icon name="arrow-right" size={15} />
            </Link>
            <a className="btn" href="mailto:cidtiee@gmail.com">
              Contactar al centro
            </a>
          </>
        }
      />

      <section className="stat-strip" aria-label="Trayectoria de transferencia">
        <div className="container stat-strip__grid">
          <div className="stat-strip__item">
            <span className="stat-strip__value">{cases.length}</span>
            <span className="stat-strip__label">Casos de transferencia</span>
          </div>
          <div className="stat-strip__item">
            <span className="stat-strip__value">{production.length}</span>
            <span className="stat-strip__label">Producciones tecnológicas</span>
          </div>
          <div className="stat-strip__item">
            <span className="stat-strip__value">EPEC</span>
            <span className="stat-strip__label">Principal organismo vinculado</span>
          </div>
          <div className="stat-strip__item">
            <span className="stat-strip__value">UTN</span>
            <span className="stat-strip__label">Respaldo institucional</span>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Experiencia"
        title="Casos de transferencia"
        lead="Estudios y desarrollos realizados para el sector eléctrico, con foco en distribución, transmisión, protecciones y calidad de la energía."
      >
        <div className="grid grid--2">
          {cases.map((item) => (
            <CaseCard key={item.id} item={item} />
          ))}
        </div>
      </Section>

      <Section
        alt
        eyebrow="Producción tecnológica"
        title="Desarrollos y modelos"
        lead="Software, modelos y estudios que integran la producción tecnológica del centro. Algunos cuentan con registro de propiedad intelectual."
      >
        <div className="production-list">
          {production.map((item) => (
            <ProductionItem key={item.id} item={item} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Cómo trabajamos"
        title="De la consulta al resultado"
        lead="Un proceso simple y trazable para cada trabajo de transferencia."
      >
        <div className="process-grid">
          <article className="process-step">
            <span className="process-step__num">01</span>
            <h3>Consulta inicial</h3>
            <p>Relevamos la necesidad, el contexto técnico y los objetivos del trabajo.</p>
          </article>
          <article className="process-step">
            <span className="process-step__num">02</span>
            <h3>Propuesta técnica</h3>
            <p>Definimos alcance, metodología, entregables y plazos con el equipo responsable.</p>
          </article>
          <article className="process-step">
            <span className="process-step__num">03</span>
            <h3>Desarrollo y seguimiento</h3>
            <p>Ejecutamos el estudio o desarrollo con instancias de intercambio y validación.</p>
          </article>
          <article className="process-step">
            <span className="process-step__num">04</span>
            <h3>Informe y transferencia</h3>
            <p>Entregamos resultados documentados y acompañamos su implementación.</p>
          </article>
        </div>
      </Section>

      <ContactBand
        eyebrow="Transferencia"
        title="¿Tenés un desafío técnico?"
        lead="Contanos qué necesitás resolver y evaluamos cómo el CIDTIEE puede ayudarte."
      />
    </>
  );
}
