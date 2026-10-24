import { Icon } from "./Icon";

function pageItems(page: number, totalPages: number): Array<number | string> {
  const wanted = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  const pages = [...wanted]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);

  const items: Array<number | string> = [];
  let previous = 0;
  for (const value of pages) {
    if (previous > 0 && value - previous > 1) {
      items.push(`gap-${previous}`);
    }
    items.push(value);
    previous = value;
  }
  return items;
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Paginación">
      <button
        className="pagination__arrow"
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
      >
        <Icon name="arrow-left" size={16} />
        <span>Anterior</span>
      </button>

      <div className="pagination__pages">
        {pageItems(page, totalPages).map((item) =>
          typeof item === "number" ? (
            <button
              key={item}
              type="button"
              className={`pagination__page${item === page ? " is-current" : ""}`}
              aria-current={item === page ? "page" : undefined}
              aria-label={`Página ${item}`}
              onClick={() => onChange(item)}
            >
              {item}
            </button>
          ) : (
            <span key={item} className="pagination__gap" aria-hidden="true">
              …
            </span>
          ),
        )}
      </div>

      <button
        className="pagination__arrow"
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
      >
        <span>Siguiente</span>
        <Icon name="arrow-right" size={16} />
      </button>
    </nav>
  );
}
