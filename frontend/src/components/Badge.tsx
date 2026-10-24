import type { ReactNode } from "react";
import type {
  BecaStatus,
  ProjectStatus,
  PublicationStatus,
  SeminarStatus,
} from "@cidtiee/shared";

type Tone = "outline" | "solid" | "muted" | "dashed" | "strong";

export function Badge({
  children,
  tone = "outline",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={`badge badge--${tone}${className ? ` ${className}` : ""}`}>{children}</span>
  );
}

const projectTones: Record<ProjectStatus, Tone> = {
  "en-curso": "solid",
  finalizado: "outline",
  "en-evaluacion": "dashed",
  "en-preparacion": "muted",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const labels: Record<ProjectStatus, string> = {
    "en-curso": "En curso",
    finalizado: "Finalizado",
    "en-evaluacion": "En evaluación",
    "en-preparacion": "En preparación",
  };
  return <Badge tone={projectTones[status]}>{labels[status]}</Badge>;
}

const publicationTones: Record<PublicationStatus, Tone> = {
  publicado: "outline",
  aceptado: "solid",
  "en-revision": "dashed",
  "en-preparacion": "muted",
};

export function PublicationStatusBadge({ status }: { status: PublicationStatus }) {
  const labels: Record<PublicationStatus, string> = {
    publicado: "Publicado",
    aceptado: "Aceptado",
    "en-revision": "En revisión",
    "en-preparacion": "En preparación",
  };
  return <Badge tone={publicationTones[status]}>{labels[status]}</Badge>;
}

const seminarTones: Record<SeminarStatus, Tone> = {
  realizado: "outline",
  proximo: "solid",
  "en-organizacion": "dashed",
};

export function SeminarStatusBadge({ status }: { status: SeminarStatus }) {
  const labels: Record<SeminarStatus, string> = {
    realizado: "Realizado",
    proximo: "Próximo",
    "en-organizacion": "En organización",
  };
  return <Badge tone={seminarTones[status]}>{labels[status]}</Badge>;
}

const becaTones: Record<BecaStatus, Tone> = {
  abierta: "solid",
  cerrada: "muted",
  permanente: "outline",
  externa: "dashed",
};

export function BecaStatusBadge({ status }: { status: BecaStatus }) {
  const labels: Record<BecaStatus, string> = {
    abierta: "Abierta",
    cerrada: "Cerrada",
    permanente: "Permanente",
    externa: "Externa",
  };
  return <Badge tone={becaTones[status]}>{labels[status]}</Badge>;
}
