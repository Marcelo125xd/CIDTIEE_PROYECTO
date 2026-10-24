import type { IconName } from "../components/Icon";

const areaIcons: Record<string, IconName> = {
  potencia: "bolt",
  energia: "chart",
  redes: "network",
  mercado: "chart",
  movilidad: "car",
  formacion: "graduation",
};

const serviceIcons: Record<string, IconName> = {
  eficiencia: "leaf",
  factura: "file",
  medicion: "chart",
  renovable: "sun",
  pliego: "file",
  movilidad: "car",
  carga: "plug",
  potencia: "bolt",
  seguridad: "shield",
  digital: "network",
  formacion: "graduation",
};

const resourceIcons: Record<string, IconName> = {
  biblioteca: "book",
  publicacion: "file",
  researchgate: "flask",
  instagram: "external",
  linkedin: "external",
  utn: "graduation",
  departamento: "graduation",
  repositorio: "book",
};

export function iconForArea(value?: string): IconName {
  return (value && areaIcons[value]) || "flask";
}

export function iconForService(value?: string): IconName {
  return (value && serviceIcons[value]) || "flask";
}

export function iconForResource(value?: string): IconName {
  return (value && resourceIcons[value]) || "file";
}
