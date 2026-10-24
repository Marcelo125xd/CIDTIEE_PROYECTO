import { Link } from "react-router-dom";
import { useContent } from "../content-context";
import { Icon } from "./Icon";

export function ContactBand({
  eyebrow = "Vinculación",
  title = "¿Querés trabajar con el CIDTIEE?",
  lead = "Podemos analizar tu necesidad, proponer un alcance técnico y acompañar el desarrollo de una solución.",
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
}) {
  const { content } = useContent();
  const site = content?.site;

  return (
    <section className="contact-band">
      <div className="container contact-band__inner">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{lead}</p>
        </div>
        <div className="contact-band__actions">
          <a
            className="btn btn--solid"
            href={`mailto:${site?.contact.email ?? "cidtiee@gmail.com"}`}
          >
            <Icon name="mail" size={16} /> Escribinos
          </a>
          <Link className="btn" to="/servicios">
            Ver servicios <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
