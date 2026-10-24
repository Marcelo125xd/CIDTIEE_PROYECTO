import { useMemo, useState } from "react";
import type { CalendarEvent } from "@cidtiee/shared";
import { CALENDAR_TYPE_LABELS } from "@cidtiee/shared";
import { EventItem } from "./Cards";
import { Icon } from "./Icon";
import { formatMonthYear, todayIso } from "../lib/format";
import { pad } from "../lib/text";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

type Cursor = { year: number; month: number };

function monthFromIso(iso: string): Cursor {
  const [year, month] = iso.slice(0, 7).split("-").map(Number);
  return {
    year: Number.isFinite(year) ? (year ?? new Date().getFullYear()) : new Date().getFullYear(),
    month: Number.isFinite(month) ? Math.max(0, Math.min(11, (month ?? 1) - 1)) : 0,
  };
}

function initialCursor(events: CalendarEvent[]): Cursor {
  const today = todayIso();
  const currentMonth = events.some((event) => event.date.slice(0, 7) === today.slice(0, 7));
  if (currentMonth) return monthFromIso(today);

  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const next = sorted.find((event) => event.date >= today);
  const last = sorted.at(-1);
  const reference = next ?? last;

  if (reference) return monthFromIso(reference.date);

  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

export function Calendar({ events }: { events: CalendarEvent[] }) {
  const [cursor, setCursor] = useState<Cursor>(() => initialCursor(events));
  const today = todayIso();

  const years = useMemo(() => {
    const values = events.map((event) => Number.parseInt(event.date.slice(0, 4), 10));
    const current = new Date().getFullYear();
    const min = Math.min(current, ...values.filter(Number.isFinite));
    const max = Math.max(current, ...values.filter(Number.isFinite));
    return Array.from({ length: max - min + 1 }, (_, index) => min + index).sort((a, b) => b - a);
  }, [events]);

  const monthKey = `${cursor.year}-${pad(cursor.month + 1)}`;
  const monthEvents = useMemo(
    () => events.filter((event) => event.date.slice(0, 7) === monthKey),
    [events, monthKey],
  );

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    for (const event of monthEvents) {
      const day = Number.parseInt(event.date.slice(8, 10), 10);
      if (!Number.isFinite(day)) continue;
      const list = map.get(day) ?? [];
      list.push(event);
      map.set(day, list);
    }
    return map;
  }, [monthEvents]);

  const firstDay = new Date(cursor.year, cursor.month, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();

  const cells: Array<number | null> = [];
  for (let index = 0; index < offset; index += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  const eventTypes = [...new Set(events.map((event) => event.type))];

  function move(delta: number) {
    setCursor((current) => {
      const date = new Date(current.year, current.month + delta, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  }

  return (
    <div className="calendar">
      <div className="calendar__main">
        <div className="calendar__controls">
          <button
            className="cal-nav"
            type="button"
            onClick={() => move(-1)}
            aria-label="Mes anterior"
          >
            <Icon name="arrow-left" size={15} />
            <span className="cal-nav__text">Anterior</span>
          </button>

          <div className="calendar__selects">
            <label className="sr-only" htmlFor="cal-month">
              Mes
            </label>
            <select
              id="cal-month"
              value={cursor.month}
              onChange={(event) =>
                setCursor((current) => ({ ...current, month: Number(event.target.value) }))
              }
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="cal-year">
              Año
            </label>
            <select
              id="cal-year"
              value={cursor.year}
              onChange={(event) =>
                setCursor((current) => ({ ...current, year: Number(event.target.value) }))
              }
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            className="cal-nav"
            type="button"
            onClick={() => move(1)}
            aria-label="Mes siguiente"
          >
            <span className="cal-nav__text">Siguiente</span>
            <Icon name="arrow-right" size={15} />
          </button>
        </div>

        <div className="cal__caption">
          {formatMonthYear(cursor.year, cursor.month)}
          <span>{monthEvents.length > 0 ? `${monthEvents.length} actividades` : "Sin actividades"}</span>
        </div>

        <table className="cal">
          <thead>
            <tr>
              {WEEKDAYS.map((day) => (
                <th key={day} scope="col">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: cells.length / 7 }, (_, week) => (
              <tr key={week}>
                {cells.slice(week * 7, week * 7 + 7).map((day, index) => {
                  if (day === null) {
                    return <td key={`empty-${week}-${index}`} className="cal__cell cal__cell--empty" />;
                  }
                  const iso = `${cursor.year}-${pad(cursor.month + 1)}-${pad(day)}`;
                  const dayEvents = eventsByDay.get(day) ?? [];
                  return (
                    <td
                      key={iso}
                      className={[
                        "cal__cell",
                        iso === today ? "cal__cell--today" : "",
                        dayEvents.length > 0 ? "cal__cell--event" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span className="cal__num">{day}</span>
                      {dayEvents.length > 0 && (
                        <span className="cal__marks">
                          {dayEvents.map((event) => (
                            <span
                              key={event.id}
                              className={`cal__mark cal__mark--${event.type}`}
                              title={event.title}
                            />
                          ))}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {eventTypes.length > 0 && (
          <ul className="legend" aria-label="Referencias del calendario">
            {eventTypes.map((type) => (
              <li key={type}>
                <span className={`legend__mark legend__mark--${type}`} aria-hidden="true" />
                {CALENDAR_TYPE_LABELS[type]}
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside className="calendar__side" aria-label="Actividades del mes">
        <p className="panel-title">
          Actividad del mes <span>{formatMonthYear(cursor.year, cursor.month)}</span>
        </p>
        {monthEvents.length > 0 ? (
          <div className="event-list">
            {monthEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="calendar__empty">
            No hay actividades registradas para este mes. Podés navegar con las flechas o los
            selectores.
          </p>
        )}
      </aside>
    </div>
  );
}
