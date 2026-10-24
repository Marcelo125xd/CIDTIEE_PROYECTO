import { Link } from "react-router-dom";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { Icon } from "../components/Icon";

export function NotFound() {
  useDocumentTitle("Página no encontrada");

  return (
    <div className="container page-state not-found">
      <p className="eyebrow">Error 404</p>
      <h1>Página no encontrada</h1>
      <p className="not-found__lead">
        La dirección que buscás no existe o el contenido cambió de lugar. Podés volver al inicio
        o explorar las secciones principales del portal.
      </p>
      <div className="not-found__actions">
        <Link className="btn btn--solid" to="/">
          Volver al inicio <Icon name="arrow-right" size={16} />
        </Link>
        <Link className="btn" to="/buscar">
          <Icon name="search" size={16} /> Buscar en el sitio
        </Link>
      </div>
      <div className="not-found__links">
        <Link to="/observatorio">Observatorio</Link>
        <Link to="/servicios">Servicios</Link>
        <Link to="/formacion">Formación</Link>
        <Link to="/calendario">Calendario</Link>
        <Link to="/medios">Medios</Link>
      </div>
    </div>
  );
}
