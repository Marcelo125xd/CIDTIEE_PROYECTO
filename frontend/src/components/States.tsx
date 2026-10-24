import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function Loading({ label = "Cargando información…" }: { label?: string }) {
  return (
    <div className="state state--loading" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="container page-state">
      <Loading label="Cargando el portal del CIDTIEE…" />
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="state state--error" role="alert">
      <Icon name="info" size={22} />
      <div>
        <p className="state__title">No se pudo cargar la información</p>
        <p className="state__text">{message}</p>
        {onRetry && (
          <button className="btn btn--small" type="button" onClick={onRetry}>
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({
  title = "Sin resultados",
  description,
  action,
}: {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="state state--empty">
      <Icon name="search" size={22} />
      <div>
        <p className="state__title">{title}</p>
        {description && <p className="state__text">{description}</p>}
        {action}
      </div>
    </div>
  );
}
