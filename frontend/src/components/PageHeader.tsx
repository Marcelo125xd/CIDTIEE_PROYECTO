import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export type Crumb = {
  label: string;
  to?: string;
};

export function PageHeader({
  eyebrow,
  title,
  lead,
  actions,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  actions?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <header className="page-head">
      <div className="container">
        {crumbs && crumbs.length > 0 && (
          <nav className="breadcrumbs" aria-label="Ubicación">
            {crumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="breadcrumbs__item">
                {index > 0 && <span className="breadcrumbs__sep">/</span>}
                {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span>{crumb.label}</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <div className="page-head__row">
          <div className="page-head__copy">
            <h1>{title}</h1>
            {lead && <div className="page-head__lead">{lead}</div>}
          </div>
          {actions && <div className="page-head__actions">{actions}</div>}
        </div>
        {children}
      </div>
    </header>
  );
}
