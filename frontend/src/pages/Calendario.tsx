import { useRequiredContent } from "../content-context";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { todayIso } from "../lib/format";
import { Calendar } from "../components/Calendar";
import { EventItem } from "../components/Cards";
import { ContactBand } from "../components/ContactBand";
import { PageHeader } from "../components/PageHeader";
import { Section } from "../components/Section";

export function Calendario() {
  useDocumentTitle("Calendario");
  const content = useRequiredContent();

  const today = todayIso();
  const upcoming = [...content.calendar]
    .filter((event) => event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const past = [...content.calendar]
    .filter((event) => event.date < today)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  return (
    <>
      <PageHeader
        eyebrow="Agenda"
        title="Calendario de actividades"
        lead="Seminarios técnicos, convocatorias y actividades de formación del CIDTIEE. Navegá por mes o consultá las próximas fechas."
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Calendario" }]}
      />

      <Section tight>
        <Calendar events={content.calendar} />
      </Section>

      <Section
        alt
        eyebrow="Próximamente"
        title="Próximas actividades"
        lead="Fechas confirmadas y plazos de convocatorias."
      >
        {upcoming.length > 0 ? (
          <div className="event-list event-list--wide">
            {upcoming.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="calendar__empty">
            No hay actividades futuras registradas. Consultá esta sección periódicamente o seguí
            las novedades del centro.
          </p>
        )}
      </Section>

      {past.length > 0 && (
        <Section
          eyebrow="Historial"
          title="Actividades recientes"
          lead="Las últimas actividades realizadas por el centro."
        >
          <div className="event-list event-list--wide">
            {past.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        </Section>
      )}

      <ContactBand
        eyebrow="Agenda"
        title="¿Querés recibir novedades?"
        lead="Escribinos para sumarte a la difusión de seminarios, cursos y convocatorias."
      />
    </>
  );
}
