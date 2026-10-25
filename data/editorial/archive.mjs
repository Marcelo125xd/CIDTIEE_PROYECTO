/**
 * Capa editorial del Archivo del CIDTIEE.
 *
 * El Archivo es una organización propia del portal: no modifica Notion ni
 * publica el export crudo. Reúne, ordena y describe material público que ya
 * existe en el centro y agrega un catálogo acotado de congresos, llamados,
 * becas y enlaces institucionales.
 *
 * Reglas de privacidad:
 *  - No se incluyen reuniones, tareas, finanzas, datos de estudiantes,
 *    credenciales, CUIT/CBU ni enlaces a carpetas privadas.
 *  - Los enlaces externos se revisan antes de publicarse.
 *  - Las páginas internas del export se usan solo como referencia editorial.
 *
 * Este archivo se procesa en scripts/build-content.mjs. La estructura final
 * se valida con ArchiveSchema y se publica dentro de ContentSchema.
 */

export const archiveIntro =
  "El Archivo reúne y ordena la producción, las actividades y los materiales públicos del CIDTIEE. Funciona como una capa histórica y documental del portal: conserva fichas descriptivas, facilita la búsqueda por etapas y reúne en un mismo lugar los enlaces y archivos que antes estaban dispersos.";

export const archiveScopeNotes = [
  "El Archivo es una organización del portal. No modifica la estructura de Notion ni publica su export original.",
  "Solo se incluye material público y curado. Quedan fuera las reuniones, las tareas internas, las finanzas y los datos personales.",
  "Cada registro tiene una ficha dentro del portal. Cuando existe un archivo local o un enlace público, la ficha ofrece la vista previa o el acceso correspondiente.",
  "Los enlaces externos se abren en una pestaña nueva. Los archivos alojados en el portal se identifican como documentos locales.",
];

export const archiveSections = [
  {
    id: "archivo-publicaciones",
    slug: "publicaciones",
    title: "Publicaciones",
    shortTitle: "Publicaciones",
    description:
      "Producción científica del centro organizada por tipo de publicación y año, con ficha descriptiva y acceso a la fuente cuando está disponible.",
    intro: [
      "El archivo de publicaciones reúne artículos en revistas, trabajos presentados en congresos, capítulos y preprints. La organización por tipo permite reconstruir la producción del centro sin depender del orden en que fue cargada en Notion.",
      "Cada registro conserva título, autores, medio de publicación, año y enlaces disponibles. Las publicaciones sin DOI o URL permanecen como ficha interna para no perder el registro histórico.",
    ],
    icon: "file",
    order: 1,
    subsections: [
      {
        id: "archivo-publicaciones-revistas",
        slug: "revistas",
        title: "Revistas",
        description:
          "Artículos publicados o aceptados en revistas nacionales e internacionales.",
        order: 1,
      },
      {
        id: "archivo-publicaciones-congresos",
        slug: "congresos",
        title: "Congresos",
        description:
          "Trabajos presentados en congresos, jornadas y reuniones científicas.",
        order: 2,
      },
      {
        id: "archivo-publicaciones-otras",
        slug: "otras",
        title: "Capítulos y preprints",
        description:
          "Capítulos de libro, preprints y otros formatos de producción científica.",
        order: 3,
      },
    ],
  },
  {
    id: "archivo-seminarios",
    slug: "seminarios",
    title: "Seminarios",
    shortTitle: "Seminarios",
    description:
      "Histórico del ciclo de seminarios técnicos del centro, con ediciones realizadas y actividades en organización.",
    intro: [
      "El archivo de seminarios conserva la memoria del ciclo técnico del CIDTIEE. Cada edición se documenta con su año, tema, expositores y materiales disponibles.",
      "La separación entre próximos y anteriores permite distinguir la programación vigente del histórico. Las ediciones sin fecha exacta se conservan con su año de referencia.",
    ],
    icon: "calendar",
    order: 2,
    subsections: [
      {
        id: "archivo-seminarios-proximos",
        slug: "proximos",
        title: "Próximos",
        description:
          "Seminarios programados o en organización que todavía no se realizaron.",
        order: 1,
      },
      {
        id: "archivo-seminarios-anteriores",
        slug: "anteriores",
        title: "Anteriores",
        description:
          "Ediciones realizadas del ciclo de seminarios técnicos del centro.",
        order: 2,
      },
    ],
  },
  {
    id: "archivo-proyectos-pid",
    slug: "proyectos-pid",
    title: "Proyectos-PID",
    shortTitle: "Proyectos-PID",
    description:
      "Proyectos de investigación y desarrollo del centro ordenados por estado: vigentes, en evaluación, terminados y rechazados.",
    intro: [
      "El archivo de proyectos reúne los PID, PID-PP, PIFIC, PICTO y otras iniciativas de investigación del centro. La organización por estado permite leer la trayectoria de cada proyecto y distinguir la cartera vigente del histórico.",
      "Cada ficha enlaza al detalle público del proyecto cuando existe. Los proyectos finalizados permanecen en el archivo como antecedente de las líneas de trabajo del CIDTIEE.",
    ],
    icon: "flask",
    order: 3,
    subsections: [
      {
        id: "archivo-proyectos-vigentes",
        slug: "vigentes",
        title: "Vigentes",
        description: "Proyectos en ejecución o con continuidad prevista.",
        order: 1,
      },
      {
        id: "archivo-proyectos-evaluacion",
        slug: "en-evaluacion",
        title: "En evaluación",
        description:
          "Proyectos presentados y pendientes de evaluación o definición.",
        order: 2,
      },
      {
        id: "archivo-proyectos-terminados",
        slug: "terminados",
        title: "Terminados",
        description: "Proyectos concluidos que integran el histórico del centro.",
        order: 3,
      },
      {
        id: "archivo-proyectos-rechazados",
        slug: "rechazados",
        title: "Rechazados",
        description:
          "Presentaciones que no obtuvieron financiamiento y se conservan como antecedente.",
        order: 4,
      },
    ],
  },
  {
    id: "archivo-internacionalizacion",
    slug: "internacionalizacion",
    title: "Internacionalización",
    shortTitle: "Internacionalización",
    description:
      "Becas, convocatorias y oportunidades de formación en el exterior relevantes para integrantes y estudiantes del centro.",
    intro: [
      "El archivo de internacionalización reúne oportunidades de becas y convocatorias externas que el centro difunde entre sus integrantes. Incluye tanto las becas gestionadas por el CIDTIEE como los llamados de universidades y organismos internacionales.",
      "Las fichas indican el estado cuando está confirmado y enlazan al sitio oficial de cada convocatoria. Las fechas y condiciones deben verificarse siempre en la fuente original.",
    ],
    icon: "graduation",
    order: 4,
    subsections: [
      {
        id: "archivo-internacionalizacion-becas",
        slug: "becas",
        title: "Becas",
        description:
          "Becas de investigación, formación doctoral y movilidad académica.",
        order: 1,
      },
      {
        id: "archivo-internacionalizacion-convocatorias",
        slug: "convocatorias",
        title: "Convocatorias",
        description:
          "Llamados y programas de financiamiento para formación en el exterior.",
        order: 2,
      },
    ],
  },
  {
    id: "archivo-congresos",
    slug: "congresos",
    title: "Congresos y llamados",
    shortTitle: "Congresos y llamados",
    description:
      "Calendario histórico de congresos, fechas de presentación de trabajos y llamados de interés para el centro.",
    intro: [
      "Este archivo reúne congresos, jornadas y llamados que el centro sigue o en los que participa. La información se ordena por año y se conserva como calendario de referencia.",
      "Las fechas son las publicadas por cada organización y pueden cambiar. Para presentar un trabajo o iniciar una postulación, consultá siempre el sitio oficial del evento o llamado.",
    ],
    icon: "network",
    order: 5,
    subsections: [
      {
        id: "archivo-congresos-congresos",
        slug: "congresos",
        title: "Congresos",
        description:
          "Congresos, simposios y jornadas con edición y sitio oficial.",
        order: 1,
      },
      {
        id: "archivo-congresos-llamados",
        slug: "llamados",
        title: "Llamados",
        description:
          "Convocatorias de proyectos, premios y presentación de trabajos.",
        order: 2,
      },
    ],
  },
  {
    id: "archivo-documentos",
    slug: "documentos",
    title: "Documentos y enlaces",
    shortTitle: "Documentos y enlaces",
    description:
      "Enlaces institucionales, repositorios, fuentes de consulta y canales de difusión del centro.",
    intro: [
      "Este archivo reúne los enlaces de referencia del CIDTIEE: el sitio institucional, el departamento del que depende, repositorios académicos, canales de difusión y fuentes públicas de información energética.",
      "Cada enlace se presenta con una ficha breve para explicar qué información contiene y por qué es útil. Los documentos locales se incorporan en el futuro con su ruta de archivo y vista previa.",
    ],
    icon: "book",
    order: 6,
    subsections: [
      {
        id: "archivo-documentos-institucionales",
        slug: "institucionales",
        title: "Institucionales",
        description:
          "Sitios, páginas y referencias de la UTN, la Facultad y el centro.",
        order: 1,
      },
      {
        id: "archivo-documentos-repositorios",
        slug: "repositorios",
        title: "Repositorios",
        description:
          "Perfiles académicos y repositorios de acceso abierto.",
        order: 2,
      },
      {
        id: "archivo-documentos-fuentes",
        slug: "fuentes",
        title: "Fuentes y observatorios",
        description:
          "Observatorios, informes y sitios de consulta sobre energía y tarifas.",
        order: 3,
      },
      {
        id: "archivo-documentos-difusion",
        slug: "difusion",
        title: "Difusión",
        description: "Canales institucionales de novedades y actividades.",
        order: 4,
      },
    ],
  },
];

/**
 * Reglas de clasificación para registros del catálogo que no traen una
 * sección explícita. El orden importa: gana la primera regla que coincide.
 */
export const archiveClassificationRules = [
  {
    id: "beca-internacional",
    test: /beca|scholarship|daad|carolina|elap/i,
    section: "internacionalizacion",
    subsection: "becas",
  },
  {
    id: "convocatoria-llamado",
    test: /convocatoria|llamado|premio|concurso/i,
    section: "congresos",
    subsection: "llamados",
  },
  {
    id: "congreso-evento",
    test: /congreso|simposio|jornada|conferencia|cfp|call for papers/i,
    section: "congresos",
    subsection: "congresos",
  },
  {
    id: "repositorio-academico",
    test: /repositorio|researchgate|zenodo/i,
    section: "documentos",
    subsection: "repositorios",
  },
  {
    id: "canal-difusion",
    test: /instagram|linkedin|red social/i,
    section: "documentos",
    subsection: "difusion",
  },
  {
    id: "fuente-observatorio",
    test: /observatorio|informe|reporte|tarifa|electric insights/i,
    section: "documentos",
    subsection: "fuentes",
  },
  {
    id: "referencia-institucional",
    test: /sitio|página|pagina|portal|departamento|facultad|utn|biblioteca/i,
    section: "documentos",
    subsection: "institucionales",
  },
];

/**
 * Clasificación explícita para registros del catálogo que, por su naturaleza,
 * no deben resolverse con las reglas generales. Las becas externas son
 * convocatorias de organismos internacionales: se archivan como tales y no
 * como becas gestionadas por el centro.
 */
export const archiveCatalogOverrides = {
  "int-becas-carolina": {
    section: "internacionalizacion",
    subsection: "convocatorias",
    kind: "convocatoria",
  },
  "int-becas-daad": {
    section: "internacionalizacion",
    subsection: "convocatorias",
    kind: "convocatoria",
  },
  "int-becas-canada": {
    section: "internacionalizacion",
    subsection: "convocatorias",
    kind: "convocatoria",
  },
};

/**
 * Registros que no se publican automáticamente. Se listan en el reporte de
 * revisión para que una persona decida su destino.
 */
export const archiveReviewCandidates = [
  {
    source: "notion",
    title: "Años anteriores",
    reason:
      "Agrupa congresos de años previos sin año ni edición; hay que desglosarla antes de publicar.",
    suggestedSection: "congresos",
  },
  {
    source: "notion",
    title: "Artículos para congresos",
    reason:
      "Contiene borradores y estados de envío; no se publica hasta contar con la versión aceptada.",
    suggestedSection: "publicaciones",
  },
  {
    source: "notion",
    title: "Preprints",
    reason:
      "No se pudo determinar si los preprints son públicos o si tienen DOI/URL estable.",
    suggestedSection: "publicaciones",
  },
  {
    source: "notion",
    title: "Congresos posibles",
    reason:
      "Lista de oportunidades sin fechas confirmadas; revisar cada edición antes de publicar.",
    suggestedSection: "congresos",
  },
  {
    source: "notion",
    title: "2024",
    reason:
      "Página de año sin categoría explícita; requiere revisión para asignarla a una sección.",
  },
  {
    source: "notion",
    title: "2025",
    reason:
      "Página de año sin categoría explícita; requiere revisión para asignarla a una sección.",
  },
];

/**
 * Catálogo de registros públicos que no provienen de las colecciones
 * estructuradas de content.mjs. No incluye notas internas, montos,
 * responsables de tareas ni enlaces a carpetas privadas.
 */
export const archiveCatalog = [
  {
    key: "cong-cittie-2026",
    title:
      "V CITTIE 2026 — Congreso de Investigación y Transferencia Tecnológica en Ingeniería Eléctrica",
    summary:
      "Congreso de investigación y transferencia en ingeniería eléctrica organizado por la UTN Facultad Regional San Francisco.",
    kind: "congreso",
    year: 2026,
    status: "Edición 2026",
    tags: ["Congreso", "Ingeniería eléctrica", "Transferencia"],
    body: [
      "El CITTIE reúne trabajos de investigación, desarrollo y transferencia tecnológica vinculados con la ingeniería eléctrica. La edición 2026 se difunde a través del sitio oficial del congreso.",
      "La ficha conserva el enlace de consulta y la referencia de edición. Las fechas de presentación y las condiciones de participación deben verificarse en la fuente oficial.",
    ],
    facts: [
      { label: "Tipo", value: "Congreso" },
      { label: "Edición", value: "V CITTIE 2026" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Sitio oficial del congreso",
        kind: "enlace",
        url: "https://www.frsf.utn.edu.ar/investigacion-y-vinculacion/investigacion-y-vinculacion/congresos",
        source: "externo",
        description: "Información, fechas y presentación de trabajos.",
      },
    ],
    featured: true,
    origin: "notion",
    sourceRef: "Calendario de Congresos",
  },
  {
    key: "cong-cidel-2026",
    title: "CIDEL 2026",
    summary:
      "Congreso internacional de distribución eléctrica con espacio para presentación de resúmenes y trabajos.",
    kind: "congreso",
    year: 2026,
    date: "2026-10-14",
    endDate: "2026-10-16",
    status: "Realizado",
    tags: ["Congreso", "Distribución eléctrica"],
    body: [
      "CIDEL es un congreso internacional dedicado a la distribución eléctrica. La edición 2026 se realizó del 14 al 16 de octubre.",
      "El registro conserva el enlace oficial para consultar memorias, próximas ediciones y condiciones de participación.",
    ],
    facts: [
      { label: "Tipo", value: "Congreso internacional" },
      { label: "Edición", value: "2026" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Sitio oficial de CIDEL 2026",
        kind: "enlace",
        url: "https://cidel2026.com/",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Calendario de Congresos",
  },
  {
    key: "cong-cadi-caedi-2026",
    title: "CADI-CAEDI 2026",
    summary:
      "Congreso Argentino de Ingeniería y Congreso Argentino de Enseñanza de la Ingeniería.",
    kind: "congreso",
    year: 2026,
    date: "2026-09-23",
    endDate: "2026-09-25",
    status: "Realizado",
    tags: ["Congreso", "Ingeniería", "Enseñanza"],
    body: [
      "CADI-CAEDI reúne trabajos de ingeniería y de enseñanza de la ingeniería. La edición 2026 se realizó del 23 al 25 de septiembre.",
      "El registro conserva el enlace de consulta de la edición y su referencia histórica.",
    ],
    facts: [
      { label: "Tipo", value: "Congreso" },
      { label: "Edición", value: "2026" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Sitio de CADI-CAEDI 2026",
        kind: "enlace",
        url: "https://confedi.org.ar/cadi/edicion-2026",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Calendario de Congresos",
  },
  {
    key: "cong-cmtyta-2026",
    title:
      "CMTyTA 2026 — Congreso sobre Medios de Transporte y Tecnologías Asociadas",
    summary:
      "Congreso sobre medios de transporte, infraestructura y tecnologías asociadas.",
    kind: "congreso",
    year: 2026,
    date: "2026-10-07",
    endDate: "2026-10-09",
    status: "Realizado",
    tags: ["Congreso", "Transporte", "Tecnología"],
    body: [
      "El Congreso sobre Medios de Transporte y Tecnologías Asociadas reúne investigaciones y experiencias sobre movilidad y sistemas de transporte. La edición 2026 se realizó del 7 al 9 de octubre.",
      "El enlace oficial permite consultar la información general del congreso y sus próximas ediciones.",
    ],
    facts: [
      { label: "Tipo", value: "Congreso" },
      { label: "Edición", value: "2026" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Sitio oficial de CMTyTA",
        kind: "enlace",
        url: "https://www.congresotransporte.com.ar/",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Calendario de Congresos",
  },
  {
    key: "cong-argencon-2026",
    title: "ARGENCON 2026",
    summary:
      "Congreso argentino de ingeniería organizado en el ámbito de IEEE Argentina.",
    kind: "congreso",
    year: 2026,
    date: "2026-11-11",
    endDate: "2026-11-13",
    status: "Programado",
    tags: ["Congreso", "IEEE", "Ingeniería"],
    body: [
      "ARGENCON es un congreso de ingeniería del ámbito de IEEE Argentina. La edición 2026 está programada del 11 al 13 de noviembre.",
      "La ficha conserva la referencia de edición. Las fechas y las condiciones de presentación deben confirmarse con la organización.",
    ],
    facts: [
      { label: "Tipo", value: "Congreso" },
      { label: "Edición", value: "2026" },
    ],
    assets: [],
    featured: false,
    origin: "notion",
    sourceRef: "Calendario de Congresos",
  },
  {
    key: "cong-urucon-2026",
    title: "URUCON 2026",
    summary:
      "Congreso de IEEE Uruguay con presentación de trabajos y publicación en IEEE Xplore.",
    kind: "congreso",
    year: 2026,
    date: "2026-11-16",
    endDate: "2026-11-18",
    status: "Programado",
    tags: ["Congreso", "IEEE", "IEEE Xplore"],
    body: [
      "URUCON es el congreso de IEEE Uruguay. La edición 2026 está programada del 16 al 18 de noviembre y sus trabajos se publican en IEEE Xplore.",
      "El sitio oficial reúne las bases, los plazos y la información de inscripción.",
    ],
    facts: [
      { label: "Tipo", value: "Congreso" },
      { label: "Edición", value: "2026" },
      { label: "Publicación", value: "IEEE Xplore" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Sitio oficial de URUCON",
        kind: "enlace",
        url: "https://urucon.uy/",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Calendario de Congresos",
  },
  {
    key: "cong-clagtee-2026",
    title: "CLAGTEE 2026",
    summary:
      "Congreso latinoamericano de generación y transmisión de energía eléctrica.",
    kind: "congreso",
    year: 2026,
    date: "2026-10-28",
    endDate: "2026-10-30",
    status: "Programado",
    tags: ["Congreso", "Energía eléctrica", "IEEE Xplore"],
    body: [
      "CLAGTEE reúne trabajos sobre generación, transmisión y distribución de energía eléctrica. La edición 2026 está programada del 28 al 30 de octubre.",
      "El sitio oficial concentra el programa, los plazos y las condiciones de publicación.",
    ],
    facts: [
      { label: "Tipo", value: "Congreso" },
      { label: "Edición", value: "2026" },
      { label: "Publicación", value: "IEEE Xplore" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Sitio oficial de CLAGTEE 2026",
        kind: "enlace",
        url: "https://www.clagtee2026.org/",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Calendario de Congresos",
  },
  {
    key: "cong-sgsma-2026",
    title: "SGSMA 2026",
    summary:
      "Simposio sobre medición, comunicación y automatización de sistemas de potencia.",
    kind: "congreso",
    year: 2026,
    status: "Edición 2026",
    tags: ["Simposio", "Sistemas de potencia", "Automatización"],
    body: [
      "SGSMA es un simposio técnico dedicado a la medición, la comunicación y la automatización en sistemas de potencia. La ficha conserva la referencia de la edición 2026.",
      "Las fechas y los plazos deben consultarse en el sitio oficial del simposio.",
    ],
    facts: [
      { label: "Tipo", value: "Simposio" },
      { label: "Edición", value: "2026" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Sitio oficial de SGSMA 2026",
        kind: "enlace",
        url: "https://sgsma2026.cl/?page_id=2575",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Calendario de Congresos",
  },
  {
    key: "cong-eriac-2027",
    title: "ERIAC 2027",
    summary:
      "Encuentro regional iberoamericano de ingeniería, con edición programada para mayo de 2027.",
    kind: "congreso",
    year: 2027,
    date: "2027-05-23",
    endDate: "2027-05-27",
    status: "Programado",
    tags: ["Congreso", "Iberoamérica", "Ingeniería"],
    body: [
      "ERIAC reúne a la comunidad iberoamericana de ingeniería. La edición 2027 está programada del 23 al 27 de mayo.",
      "El enlace oficial permite consultar las sedes, los plazos y las condiciones de participación.",
    ],
    facts: [
      { label: "Tipo", value: "Congreso" },
      { label: "Edición", value: "2027" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Sitio oficial de ERIAC",
        kind: "enlace",
        url: "https://eriac.com.py/",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Calendario de Congresos",
  },
  {
    key: "llamado-cba-ciencia-productiva",
    title: "Córdoba Ciencia Productiva",
    summary:
      "Convocatoria del Ministerio de Producción, Ciencia e Innovación Tecnológica de Córdoba para proyectos de investigación aplicada e innovación.",
    kind: "llamado",
    year: 2026,
    date: "2026-02-16",
    status: "Cerrada",
    tags: ["Convocatoria", "Financiamiento", "Córdoba"],
    body: [
      "Córdoba Ciencia Productiva es una convocatoria provincial orientada a proyectos de investigación aplicada, innovación pública e innovación productiva.",
      "La edición 2026 cerró el 16 de febrero. La ficha conserva el enlace oficial como antecedente para próximas convocatorias.",
    ],
    facts: [
      { label: "Tipo", value: "Convocatoria de proyectos" },
      { label: "Jurisdicción", value: "Provincia de Córdoba" },
      { label: "Cierre", value: "16 de febrero de 2026" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Córdoba Ciencia Productiva",
        kind: "enlace",
        url: "https://cytcordoba.cba.gov.ar/cordoba-ciencia-productiva/",
        source: "externo",
        description: "Bases, líneas de financiamiento y novedades de la convocatoria.",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "CBA Ciencia Productiva",
  },
  {
    key: "llamado-proyectos-estrategicos",
    title:
      "Convocatoria Proyectos Estratégicos para el Desarrollo Sostenible",
    summary:
      "Convocatoria nacional para proyectos estratégicos vinculados con el desarrollo sostenible, incluida la gestión de energía en establecimientos.",
    kind: "llamado",
    status: "Convocatoria nacional",
    tags: ["Convocatoria", "Desarrollo sostenible", "Energía"],
    body: [
      "La convocatoria de Proyectos Estratégicos para el Desarrollo Sostenible incluye líneas de trabajo sobre energía y gestión de residuos en establecimientos corporativos, de turismo, educación y salud.",
      "La ficha conserva el enlace oficial para consultar las bases vigentes y las condiciones de presentación.",
    ],
    facts: [
      { label: "Tipo", value: "Convocatoria nacional" },
      { label: "Organismo", value: "Estado nacional" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Bases de la convocatoria",
        kind: "enlace",
        url: "https://www.argentina.gob.ar/servicio/convocatoria-proyectos-estrategicos-para-el-desarrollo-sostenible",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Convocatoria Proyectos Estratégicos",
  },
  {
    key: "llamado-invap-tesis",
    title: "Concurso de Mejores Tesis de Ingeniería — INVAP",
    summary:
      "Concurso para tesis de grado, maestría y posgrado en ingeniería, con edición de referencia 2024.",
    kind: "llamado",
    year: 2024,
    status: "Edición 2024",
    tags: ["Concurso", "Tesis", "Ingeniería"],
    body: [
      "El concurso de Mejores Tesis de Ingeniería de INVAP distingue trabajos de grado, maestría y posgrado. La edición de referencia es 2024.",
      "El enlace oficial reúne las bases y el historial del concurso.",
    ],
    facts: [
      { label: "Tipo", value: "Concurso de tesis" },
      { label: "Edición", value: "2024" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Concurso de Tesis INVAP",
        kind: "enlace",
        url: "https://www.invap.com.ar/concursotesis",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Concurso mejores tesis de ingeniería",
  },
  {
    key: "llamado-cai-preingenieria",
    title: "Premio Pre-Ingeniería CAI",
    summary:
      "Premio del Centro Argentino de Ingenieros para estudiantes del último año de carreras de ingeniería.",
    kind: "llamado",
    year: 2023,
    status: "Ediciones 2022 y 2023",
    tags: ["Premio", "Estudiantes", "Ingeniería"],
    body: [
      "El Premio Pre-Ingeniería del CAI está dirigido a estudiantes del último año de ingeniería. El archivo conserva las ediciones 2022 y 2023 como referencia.",
      "Los enlaces oficiales permiten consultar las bases y los resultados de cada edición.",
    ],
    facts: [
      { label: "Tipo", value: "Premio" },
      { label: "Organiza", value: "Centro Argentino de Ingenieros" },
    ],
    assets: [
      {
        key: "edicion-2022",
        label: "Premio Pre-Ingeniería 2022",
        kind: "enlace",
        url: "https://cai.org.ar/premio-pre-ingenieria-2022/",
        source: "externo",
      },
      {
        key: "edicion-2023",
        label: "Premio Pre-Ingeniería 2023",
        kind: "enlace",
        url: "https://cai.org.ar/premio-pre-ingenieria-2023/",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Premio pre ingeniería CAI",
  },
  {
    key: "int-becas-carolina",
    title: "Becas Carolina 2026-2027",
    summary:
      "Convocatoria de la Fundación Carolina para formación de posgrado e investigación en España.",
    kind: "beca",
    year: 2026,
    status: "Convocatoria externa",
    tags: ["Beca", "Posgrado", "España"],
    body: [
      "La Fundación Carolina convoca a becas de posgrado, doctorado e investigación en universidades españolas. La edición 2026-2027 se difunde a través de su sitio oficial.",
      "Las bases, los plazos y los requisitos deben consultarse en la convocatoria original.",
    ],
    facts: [
      { label: "Tipo", value: "Beca de posgrado e investigación" },
      { label: "Organiza", value: "Fundación Carolina" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Convocatoria de Becas Carolina 2026-2027",
        kind: "enlace",
        url: "https://www.fundacioncarolina.es/convocatoria-de-becas-2026-2027/",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Internacionalización",
  },
  {
    key: "int-becas-daad",
    title: "Becas DAAD — UTN",
    summary:
      "Programa de becas del Servicio Alemán de Intercambio Académico difundido por la Secretaría de Relaciones Internacionales de la UTN.",
    kind: "beca",
    status: "Convocatoria externa",
    tags: ["Beca", "Alemania", "Intercambio"],
    body: [
      "El DAAD ofrece becas de estudio, investigación y movilidad académica en Alemania. La UTN difunde las oportunidades a través de su Secretaría de Relaciones Internacionales.",
      "La ficha conserva el enlace institucional con las convocatorias y requisitos vigentes.",
    ],
    facts: [
      { label: "Tipo", value: "Beca de intercambio" },
      { label: "Organiza", value: "DAAD" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Becas DAAD en la UTN",
        kind: "enlace",
        url: "https://www.utn.edu.ar/es/secretaria-rrii/srrii-utn-daad",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Internacionalización",
  },
  {
    key: "int-becas-canada",
    title: "Becas Canada — ELAP",
    summary:
      "Programa de intercambio académico para estudiantes de América Latina y el Caribe en instituciones canadienses.",
    kind: "beca",
    status: "Convocatoria externa",
    tags: ["Beca", "Canadá", "Intercambio"],
    body: [
      "El programa Emerging Leaders in the Americas Program (ELAP) ofrece oportunidades de intercambio en instituciones canadienses para estudiantes de América Latina y el Caribe.",
      "El sitio oficial reúne los requisitos, las instituciones participantes y los plazos de postulación.",
    ],
    facts: [
      { label: "Tipo", value: "Beca de intercambio" },
      { label: "Organiza", value: "Gobierno de Canadá" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Becas ELAP — Canadá",
        kind: "enlace",
        url: "https://www.educanada.ca/scholarships-bourses/can/institutions/elap-pfla.aspx?lang=eng",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Internacionalización",
  },
  {
    key: "doc-sitio-cidtiee",
    title: "Sitio institucional del CIDTIEE",
    summary:
      "Página del centro en el sitio de investigación de la UTN Facultad Regional Córdoba.",
    kind: "enlace",
    tags: ["Institucional", "Sitio web"],
    body: [
      "El sitio institucional reúne información general del CIDTIEE, sus líneas de trabajo, servicios, integrantes y producción.",
      "Se conserva como referencia externa porque el portal actual amplía y reorganiza esa información.",
    ],
    facts: [
      { label: "Tipo", value: "Sitio institucional" },
      { label: "Organiza", value: "CIDTIEE" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Sitio del CIDTIEE",
        kind: "enlace",
        url: "https://www.investigacion.frc.utn.edu.ar/cidtiee/",
        source: "externo",
      },
    ],
    featured: true,
    origin: "curado",
  },
  {
    key: "doc-biblioteca",
    title: "Biblioteca del CIDTIEE",
    summary:
      "Espacio de documentos del centro: memorias, presentaciones de seminarios, resoluciones y material de consulta.",
    kind: "documento",
    tags: ["Biblioteca", "Documentos"],
    body: [
      "La Biblioteca del CIDTIEE reúne materiales de consulta y documentación institucional. El enlace corresponde al espacio de biblioteca del sitio anterior del centro.",
      "A medida que se incorporen archivos locales al portal, sus fichas aparecerán en esta misma sección con vista previa y descarga.",
    ],
    facts: [
      { label: "Tipo", value: "Biblioteca" },
      { label: "Contenido", value: "Memorias, presentaciones y resoluciones" },
    ],
    assets: [
      {
        key: "biblioteca",
        label: "Biblioteca en el sitio institucional",
        kind: "enlace",
        url: "https://www.investigacion.frc.utn.edu.ar/cidtiee/?pIs=3161",
        source: "externo",
      },
    ],
    featured: false,
    origin: "curado",
  },
  {
    key: "doc-departamento",
    title: "Departamento de Ingeniería Eléctrica",
    summary:
      "Información académica del departamento del que depende el CIDTIEE en la FRC UTN.",
    kind: "enlace",
    tags: ["Institucional", "UTN", "Ingeniería eléctrica"],
    body: [
      "El CIDTIEE depende de la Secretaría de Ciencia y Técnica y del Departamento de Ingeniería Eléctrica de la UTN Facultad Regional Córdoba.",
      "El enlace reúne información académica y de gestión del departamento.",
    ],
    facts: [
      { label: "Tipo", value: "Unidad académica" },
      { label: "Organiza", value: "UTN Facultad Regional Córdoba" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Departamento de Ingeniería Eléctrica",
        kind: "enlace",
        url: "http://www.institucional.frc.utn.edu.ar/electrica/",
        source: "externo",
      },
    ],
    featured: false,
    origin: "curado",
  },
  {
    key: "doc-utn-frc",
    title: "UTN Facultad Regional Córdoba",
    summary:
      "Sitio principal de la Facultad Regional Córdoba, con información académica e institucional.",
    kind: "enlace",
    tags: ["Institucional", "UTN"],
    body: [
      "La Facultad Regional Córdoba es la unidad académica en la que se desarrolla la actividad del CIDTIEE.",
      "El sitio institucional concentra novedades, carreras, investigación y servicios de la facultad.",
    ],
    facts: [
      { label: "Tipo", value: "Sitio institucional" },
      { label: "Organiza", value: "UTN Facultad Regional Córdoba" },
    ],
    assets: [
      {
        key: "sitio",
        label: "UTN Facultad Regional Córdoba",
        kind: "enlace",
        url: "https://www.frc.utn.edu.ar/",
        source: "externo",
      },
    ],
    featured: false,
    origin: "curado",
  },
  {
    key: "doc-researchgate",
    title: "Perfil CIDTIEE en ResearchGate",
    summary:
      "Perfil académico del centro con publicaciones, proyectos y líneas de investigación.",
    kind: "enlace",
    tags: ["Repositorio", "ResearchGate", "Publicaciones"],
    body: [
      "El perfil institucional en ResearchGate reúne publicaciones, proyectos y líneas de trabajo del CIDTIEE.",
      "Se conserva como canal de consulta y difusión de la producción científica.",
    ],
    facts: [
      { label: "Tipo", value: "Perfil académico" },
      { label: "Plataforma", value: "ResearchGate" },
    ],
    assets: [
      {
        key: "perfil",
        label: "CIDTIEE en ResearchGate",
        kind: "enlace",
        url: "https://www.researchgate.net/lab/CIDTIEE-Miguel-Piumetto",
        source: "externo",
      },
    ],
    featured: false,
    origin: "curado",
  },
  {
    key: "doc-zenodo",
    title: "Repositorio Zenodo",
    summary:
      "Repositorio de acceso abierto para depositar y citar materiales de investigación, presentaciones y datos.",
    kind: "enlace",
    tags: ["Repositorio", "Acceso abierto", "Datos"],
    body: [
      "Zenodo es un repositorio de acceso abierto que permite depositar y citar publicaciones, presentaciones, datos y software de investigación.",
      "El enlace es una referencia general para el depósito de materiales del centro.",
    ],
    facts: [
      { label: "Tipo", value: "Repositorio" },
      { label: "Plataforma", value: "Zenodo" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Repositorio Zenodo",
        kind: "enlace",
        url: "https://zenodo.org/",
        source: "externo",
      },
    ],
    featured: false,
    origin: "curado",
  },
  {
    key: "doc-instagram",
    title: "CIDTIEE en Instagram",
    summary:
      "Canal institucional de novedades, seminarios y actividades del centro.",
    kind: "enlace",
    tags: ["Difusión", "Instagram", "Redes"],
    body: [
      "El perfil de Instagram del CIDTIEE difunde novedades, seminarios, actividades de formación y resultados del centro.",
      "Se conserva como canal complementario al archivo y a la agenda del portal.",
    ],
    facts: [
      { label: "Tipo", value: "Red social" },
      { label: "Plataforma", value: "Instagram" },
    ],
    assets: [
      {
        key: "perfil",
        label: "Instagram del CIDTIEE",
        kind: "enlace",
        url: "https://www.instagram.com/cidtiee.frc.utn/",
        source: "externo",
      },
    ],
    featured: false,
    origin: "curado",
  },
  {
    key: "doc-linkedin",
    title: "CIDTIEE en LinkedIn",
    summary:
      "Canal institucional de actualidad, vinculación y oportunidades de colaboración.",
    kind: "enlace",
    tags: ["Difusión", "LinkedIn", "Redes"],
    body: [
      "El perfil de LinkedIn del CIDTIEE difunde actualidad institucional, vinculación con el medio y oportunidades de colaboración.",
      "Se conserva como canal complementario al archivo y a la agenda del portal.",
    ],
    facts: [
      { label: "Tipo", value: "Red social" },
      { label: "Plataforma", value: "LinkedIn" },
    ],
    assets: [
      {
        key: "perfil",
        label: "LinkedIn del CIDTIEE",
        kind: "enlace",
        url: "https://www.linkedin.com/in/cidtiee-frc-utn/",
        source: "externo",
      },
    ],
    featured: false,
    origin: "curado",
  },
  {
    key: "doc-observatorio-rural",
    title: "Observatorio Rural — UTN Facultad Regional Trenque Lauquen",
    summary:
      "Observatorio de la UTN con informes y datos sobre el medio rural y su relación con la energía.",
    kind: "enlace",
    tags: ["Observatorio", "Energía", "Fuentes"],
    body: [
      "El Observatorio Rural de la UTN Facultad Regional Trenque Lauquen publica informes y datos sobre el medio rural.",
      "Se incorpora como fuente de consulta para temas de energía, territorio y desarrollo productivo.",
    ],
    facts: [
      { label: "Tipo", value: "Observatorio" },
      { label: "Organiza", value: "UTN Facultad Regional Trenque Lauquen" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Observatorio Rural",
        kind: "enlace",
        url: "https://web.frtl.utn.edu.ar/observatorio-rural/",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Observatorio CIDTIEE",
  },
  {
    key: "doc-otes",
    title: "Observatorio de Trabajo, Economía y Sociedad (OTES)",
    summary:
      "Observatorio que publica informes sobre presupuesto, economía y sociedad en Córdoba.",
    kind: "enlace",
    tags: ["Observatorio", "Economía", "Córdoba"],
    body: [
      "OTES publica informes sobre trabajo, economía y sociedad, incluidos análisis del presupuesto provincial.",
      "Se incorpora como fuente de consulta para el estudio de tarifas y regulación.",
    ],
    facts: [
      { label: "Tipo", value: "Observatorio" },
      { label: "Ámbito", value: "Córdoba" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Observatorio de Trabajo, Economía y Sociedad",
        kind: "enlace",
        url: "https://otescba.com/",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Observatorio CIDTIEE",
  },
  {
    key: "doc-iiep",
    title: "Instituto Interdisciplinario de Economía Política (IIEP)",
    summary:
      "Instituto de investigación económica con publicaciones sobre tarifas y política energética.",
    kind: "enlace",
    tags: ["Fuente", "Economía", "Tarifas"],
    body: [
      "El IIEP publica investigaciones y análisis sobre economía política, incluidos informes vinculados con tarifas y servicios públicos.",
      "Se incorpora como fuente de consulta para el archivo de mercados y regulación.",
    ],
    facts: [
      { label: "Tipo", value: "Centro de investigación" },
      { label: "Ámbito", value: "Argentina" },
    ],
    assets: [
      {
        key: "sitio",
        label: "IIEP",
        kind: "enlace",
        url: "https://twitter.com/iiep_oficial",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Observatorio CIDTIEE",
  },
  {
    key: "doc-electric-insights",
    title: "Electric Insights — reportes del sistema eléctrico",
    summary:
      "Reportes y visualizaciones sobre el sistema eléctrico del Reino Unido.",
    kind: "enlace",
    tags: ["Fuente", "Sistema eléctrico", "Reportes"],
    body: [
      "Electric Insights publica reportes y visualizaciones sobre la operación del sistema eléctrico del Reino Unido.",
      "Se incorpora como fuente de consulta y comparación internacional.",
    ],
    facts: [
      { label: "Tipo", value: "Reportes" },
      { label: "Ámbito", value: "Reino Unido" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Electric Insights",
        kind: "enlace",
        url: "https://reports.electricinsights.co.uk/",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Observatorio CIDTIEE",
  },
  {
    key: "doc-tarifas-uncuyo",
    title: "Tarifas y servicios públicos — UNCuyo",
    summary:
      "Espacio de la Facultad de Ciencias Económicas de la UNCuyo con información sobre tarifas y servicios públicos.",
    kind: "enlace",
    tags: ["Fuente", "Tarifas", "Servicios públicos"],
    body: [
      "La Facultad de Ciencias Económicas de la Universidad Nacional de Cuyo mantiene un espacio de consulta sobre tarifas y servicios públicos.",
      "Se incorpora como fuente de referencia para el análisis regulatorio y tarifario.",
    ],
    facts: [
      { label: "Tipo", value: "Fuente académica" },
      { label: "Organiza", value: "UNCuyo" },
    ],
    assets: [
      {
        key: "sitio",
        label: "Tarifas y servicios públicos",
        kind: "enlace",
        url: "https://fce.uncuyo.edu.ar/tarifas_servicios_publicos/",
        source: "externo",
      },
    ],
    featured: false,
    origin: "notion",
    sourceRef: "Observatorio CIDTIEE",
  },
];
