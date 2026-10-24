import { useId, type ReactNode } from "react";
import { Icon } from "./Icon";

export type SelectOption = {
  value: string;
  label: string;
};

export function SearchField({
  label = "Buscar",
  value,
  onChange,
  placeholder = "Buscar…",
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="field field--search">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="field__control">
        <Icon name="search" size={17} className="field__icon" />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}) {
  const id = useId();
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FilterBar({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="filters">
      <div className="filters__fields">{children}</div>
      {actions && <div className="filters__actions">{actions}</div>}
    </div>
  );
}

export function ResultsMeta({
  total,
  singular,
  plural,
  children,
}: {
  total: number;
  singular: string;
  plural: string;
  children?: ReactNode;
}) {
  return (
    <div className="results-meta">
      <p>
        <strong>{total}</strong> {total === 1 ? singular : plural}
      </p>
      {children}
    </div>
  );
}
