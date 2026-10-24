import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  lead,
  action,
  children,
  className,
  alt = false,
  tight = false,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  alt?: boolean;
  tight?: boolean;
}) {
  const classes = [
    "section",
    alt ? "section--alt" : "",
    tight ? "section--tight" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} className={classes}>
      <div className="container">
        {(title || lead || action) && (
          <div className="section__head">
            <div className="section__copy">
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              {title && <h2 className="section__title">{title}</h2>}
              {lead && <div className="section__lead">{lead}</div>}
            </div>
            {action && <div className="section__action">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
