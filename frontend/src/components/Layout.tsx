import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useContent } from "../content-context";
import { useTheme } from "../lib/theme";
import { Icon } from "./Icon";

const NAV_ITEMS = [
  { to: "/institucional", label: "Institucional" },
  { to: "/observatorio", label: "Observatorio" },
  { to: "/archivo", label: "Archivo" },
  { to: "/transferencia", label: "Transferencia" },
  { to: "/formacion", label: "Formación" },
  { to: "/servicios", label: "Servicios" },
  { to: "/calendario", label: "Agenda" },
  { to: "/medios", label: "Medios" },
];

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header className="site-header">
        <div className="container header__top">
          <Link className="brand" to="/" aria-label="CIDTIEE, ir al inicio">
            <span className="brand__mark" aria-hidden="true">
              C
            </span>
            <span className="brand__text">
              <span className="brand__name">CIDTIEE</span>
              <span className="brand__sub">UTN · Facultad Regional Córdoba</span>
            </span>
          </Link>

          <div className="header__tools">
            <Link className="icon-button" to="/buscar" aria-label="Buscar en el sitio">
              <Icon name="search" size={18} />
            </Link>
            <button
              className="theme-toggle"
              type="button"
              onClick={toggle}
              aria-pressed={theme === "dark"}
              aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
              <span className="theme-toggle__label">
                {theme === "dark" ? "Modo claro" : "Modo oscuro"}
              </span>
            </button>
          </div>
        </div>
      </header>

      <nav className={`site-nav${open ? " is-open" : ""}`} aria-label="Navegación principal">
        <div className="container nav__inner">
          <button
            className="nav__toggle"
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-controls="nav-list"
          >
            <Icon name={open ? "close" : "menu"} size={18} />
            <span>{open ? "Cerrar" : "Menú"}</span>
          </button>

          <ul className="nav__list" id="nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `nav__link${isActive ? " is-active" : ""}`}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <Link className="nav__search" to="/buscar">
            <Icon name="search" size={16} />
            <span>Buscar</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

function SiteFooter() {
  const { content } = useContent();
  const site = content?.site;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <p className="footer__name">CIDTIEE</p>
          <p className="footer__full">
            {site?.fullName ?? "Centro de Investigación, Desarrollo y Transferencia de Ingeniería en Energía Eléctrica"}
          </p>
          <p className="footer__text">
            {site?.description ??
              "Investigación, desarrollo y transferencia en ingeniería en energía eléctrica en la UTN Facultad Regional Córdoba."}
          </p>
          {site?.resolution && <p className="footer__resolution">{site.resolution}</p>}
        </div>

        <div className="footer__col">
          <h2>Secciones</h2>
          <ul>
            <li>
              <Link to="/institucional">Institucional</Link>
            </li>
            <li>
              <Link to="/observatorio">Observatorio</Link>
            </li>
            <li>
              <Link to="/archivo">Archivo</Link>
            </li>
            <li>
              <Link to="/transferencia">Transferencia</Link>
            </li>
            <li>
              <Link to="/servicios">Servicios</Link>
            </li>
            <li>
              <Link to="/formacion">Formación</Link>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h2>Recursos</h2>
          <ul>
            <li>
              <Link to="/observatorio/proyectos">Proyectos</Link>
            </li>
            <li>
              <Link to="/observatorio/publicaciones">Publicaciones</Link>
            </li>
            <li>
              <Link to="/seminarios">Seminarios</Link>
            </li>
            <li>
              <Link to="/becas">Becas y convocatorias</Link>
            </li>
            <li>
              <Link to="/calendario">Calendario</Link>
            </li>
            <li>
              <Link to="/medios">Medios</Link>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h2>Contacto</h2>
          {site ? (
            <address className="footer__address">
              <p>{site.contact.address}</p>
              <p>
                {site.contact.city}
                {site.contact.postalCode ? ` · ${site.contact.postalCode}` : ""}
              </p>
              <p>
                <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </p>
              <p>
                <a href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}>{site.contact.phone}</a>
                {site.contact.extension ? ` · int. ${site.contact.extension}` : ""}
              </p>
            </address>
          ) : (
            <p className="footer__text">Información de contacto institucional.</p>
          )}
          {site && site.links.length > 0 && (
            <ul className="footer__social">
              {site.links.slice(0, 4).map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noreferrer noopener">
                    {link.label} <Icon name="external" size={12} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="container footer__legal">
        <span>
          © {year} CIDTIEE · UTN Facultad Regional Córdoba
        </span>
        <span>Sitio público · Contenido institucional</span>
        <Link to="/buscar">Buscar en el sitio</Link>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#contenido">
        Ir al contenido principal
      </a>
      <SiteHeader />
      <main id="contenido" className="site-main">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
