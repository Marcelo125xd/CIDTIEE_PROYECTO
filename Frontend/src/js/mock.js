const MOCK_TAREAS = [
  {
    id: 'T-01',
    nombre: 'Calibración del osciloscopio de banco',
    descripcion: 'Renovación del certificado de calibración del instrumental del banco 2.',
    tipo: 'Investigación',
    estado: 'En revisión',
    informacion: 'Certificado recibido del proveedor; pendiente la firma de la dirección.',
    prioridad: 'Alta'
  },
  {
    id: 'T-02',
    nombre: 'Informe de avance bimestral',
    descripcion: 'Consolidado de avances de los proyectos activos para el informe al rectorado.',
    tipo: 'Administración',
    estado: 'Pendiente',
    informacion: 'Vence el último viernes del mes en curso.',
    prioridad: 'Alta'
  },
  {
    id: 'T-03',
    nombre: 'Artículo para revista indexada',
    descripcion: 'Envío del manuscrito sobre armónicos de osciladores libres.',
    tipo: 'Divulgación',
    estado: 'En curso',
    informacion: 'Revisión de coautores en curso; envío previsto para el mes entrante.',
    prioridad: 'Media'
  },
  {
    id: 'T-04',
    nombre: 'Muestreo en planta',
    descripcion: 'Toma de muestras de temperatura y presión en el sector de compresión.',
    tipo: 'Investigación',
    estado: 'En curso',
    informacion: 'Requiere autorización del área de seguridad, expediente HSA-2026-114.',
    prioridad: 'Alta'
  },
  {
    id: 'T-05',
    nombre: 'Protocolo de ensayos de fatiga',
    descripcion: 'Definición de las condiciones de ensayo para el banco de oscilaciones.',
    tipo: 'Investigación',
    estado: 'Completada',
    informacion: 'Documento aprobado por el comité técnico en junio.',
    prioridad: 'Media'
  },
  {
    id: 'T-06',
    nombre: 'Coordinación de becarios',
    descripcion: 'Acompañamiento mensual del equipo de becarios y pasantes.',
    tipo: 'Administración',
    estado: 'Pendiente',
    informacion: 'Tres becarios activos y dos pasantes en curso.',
    prioridad: 'Baja'
  },
  {
    id: 'T-07',
    nombre: 'Ciclo de capacitaciones 2026',
    descripcion: 'Planificación de las cuatro ediciones del ciclo de capacitaciones.',
    tipo: 'Docencia',
    estado: 'En curso',
    informacion: 'Preinscripción abierta; sede a confirmar.',
    prioridad: 'Media'
  },
  {
    id: 'T-08',
    nombre: 'Recuperación de instrumental',
    descripcion: 'Cotización de reemplazo de las fuentes de alimentación del laboratorio.',
    tipo: 'Investigación',
    estado: 'Pendiente',
    informacion: 'Presupuesto solicitado al área de finanzas.',
    prioridad: 'Alta'
  },
  {
    id: 'T-09',
    nombre: 'Firma de convenio',
    descripcion: 'Gestión del convenio marco con la facultad de ingeniería.',
    tipo: 'Extensión',
    estado: 'En revisión',
    informacion: 'Pendiente de revisión jurídica.',
    prioridad: 'Media'
  },
  {
    id: 'T-10',
    nombre: 'Presentación en congreso',
    descripcion: 'Preparación de la comunicación oral para el congreso de control automático.',
    tipo: 'Divulgación',
    estado: 'Pendiente',
    informacion: 'Resumen enviado y aceptado; falta cerrar la presentación.',
    prioridad: 'Media'
  },
  {
    id: 'T-11',
    nombre: 'Rendición de fondos',
    descripcion: 'Cierre de la rendición del proyecto ANI 2025.',
    tipo: 'Administración',
    estado: 'En curso',
    informacion: 'Falta adjuntar comprobantes de dos viajes.',
    prioridad: 'Alta'
  },
  {
    id: 'T-12',
    nombre: 'Definición del esquema de datos',
    descripcion: 'Contrato de datos para la API del portal institucional.',
    tipo: 'Administración',
    estado: 'Pendiente',
    informacion: 'Depende de la disponibilidad del equipo de desarrollo.',
    prioridad: 'Baja'
  },
  {
    id: 'T-13',
    nombre: 'Revisión del protocolo de seguridad',
    descripcion: 'Actualización del protocolo de acceso al laboratorio de oscilaciones.',
    tipo: 'Investigación',
    estado: 'Cancelada',
    informacion: 'Suspendida: la comisión lo retomará en el próximo período.',
    prioridad: 'Baja'
  },
  {
    id: 'T-14',
    nombre: 'Ateneo de resultados parciales',
    descripcion: 'Presentación de resultados del semestre en el ateneo institucional.',
    tipo: 'Divulgación',
    estado: 'Completada',
    informacion: 'Asistieron cuarenta y cinco personas entre docentes y alumnos.',
    prioridad: 'Media'
  },
  {
    id: 'T-15',
    nombre: 'Búsqueda de financiamiento',
    descripcion: 'Exploración de convocatorias nacionales y provinciales abiertas.',
    tipo: 'Administración',
    estado: 'En curso',
    informacion: 'Dos propuestas en armado para la próxima convocatoria.',
    prioridad: 'Alta'
  }
];

const MOCK_ALUMNOS = [
  {
    id: 'A-01',
    tipo: 'Grado',
    nombre: 'Lucía Fernández',
    fecha: '2026-03-02',
    estado: 'Evaluación pendiente',
    docenteACargo: 'Dra. Julieta Ramírez',
    entregas: [
      { titulo: 'Informe de avance', fecha: '2026-08-14', estado: 'Entregado' },
      { titulo: 'Trabajo final', fecha: '2026-09-30', estado: 'Pendiente' }
    ],
    comentarios: 'Buen desempeño en los ensayos de laboratorio; solicitará beca para el año siguiente.'
  },
  {
    id: 'A-02',
    tipo: 'Grado',
    nombre: 'Tomás Aguirre',
    fecha: '2026-03-02',
    estado: 'En curso',
    docenteACargo: 'Dr. Nicolás Sosa',
    entregas: [
      { titulo: 'Informe de avance', fecha: '2026-08-14', estado: 'Entregado' }
    ],
    comentarios: 'Carga horaria reducida, aprobada por la comisión evaluadora.'
  },
  {
    id: 'A-03',
    tipo: 'Investigación',
    nombre: 'Mariana Ortiz',
    fecha: '2025-09-15',
    estado: 'Pasantía en curso',
    docenteACargo: 'Dra. Julieta Ramírez',
    entregas: [
      { titulo: 'Memoria de mitad de pasantía', fecha: '2026-08-31', estado: 'Entregado' },
      { titulo: 'Informe final de pasantía', fecha: '2026-10-15', estado: 'Pendiente' }
    ],
    comentarios: 'Trabaja en la caracterización de osciladores del banco 1.'
  },
  {
    id: 'A-04',
    tipo: 'Investigación',
    nombre: 'Bruno Otero',
    fecha: '2025-09-15',
    estado: 'En curso',
    docenteACargo: 'Ing. Paula Gómez',
    entregas: [
      { titulo: 'Informe semestral', fecha: '2026-08-31', estado: 'Entregado' }
    ],
    comentarios: 'Presenta buen desempeño en el análisis de datos de campo.'
  },
  {
    id: 'A-05',
    tipo: 'Grado',
    nombre: 'Carla Medina',
    fecha: '2024-09-02',
    estado: 'Pasantía en curso',
    docenteACargo: 'Dr. Nicolás Sosa',
    entregas: [
      { titulo: 'Informe de avance', fecha: '2026-08-14', estado: 'Entregado' },
      { titulo: 'Informe final de pasantía', fecha: '2026-11-20', estado: 'Pendiente' }
    ],
    comentarios: 'Adjunta un anexo con el registro de ensayos.'
  },
  {
    id: 'A-06',
    tipo: 'Grado',
    nombre: 'Diego Salas',
    fecha: '2024-09-02',
    estado: 'Baja justificada',
    docenteACargo: 'Ing. Paula Gómez',
    entregas: [
      { titulo: 'Informe de avance', fecha: '2026-05-15', estado: 'Entregado' }
    ],
    comentarios: 'Baja solicitada por cambio de residencia; se conserva el historial de entregas.'
  },
  {
    id: 'A-07',
    tipo: 'Investigación',
    nombre: 'Ana Lucía Pereyra',
    fecha: '2026-04-01',
    estado: 'En curso',
    docenteACargo: 'Dra. Julieta Ramírez',
    entregas: [
      { titulo: 'Plan de trabajo', fecha: '2026-04-30', estado: 'Entregado' }
    ],
    comentarios: 'Incorporada al proyecto de eficiencia energética en junio.'
  },
  {
    id: 'A-08',
    tipo: 'Grado',
    nombre: 'Franco Escobar',
    fecha: '2026-04-01',
    estado: 'Evaluación pendiente',
    docenteACargo: 'Dr. Martín Quiroga',
    entregas: [
      { titulo: 'Informe de avance', fecha: '2026-08-14', estado: 'Entregado' },
      { titulo: 'Trabajo final', fecha: '2026-09-30', estado: 'Pendiente' }
    ],
    comentarios: 'Consultar bibliografía adicional sobre redes de sensores.'
  },
  {
    id: 'A-09',
    tipo: 'Investigación',
    nombre: 'Rocío Vázquez',
    fecha: '2026-06-15',
    estado: 'En curso',
    docenteACargo: 'Ing. Paula Gómez',
    entregas: [
      { titulo: 'Plan de trabajo', fecha: '2026-07-01', estado: 'Entregado' }
    ],
    comentarios: 'Novedades de su proyecto se presentarán en el ateneo.'
  }
];

const MOCK_DOCENTES = [
  {
    id: 'D-01',
    nombre: 'Dra. Julieta Ramírez',
    rol: 'Investigadora principal',
    catedra: 'Cátedra de Oscilaciones',
    cargo: 'Directora del centro',
    proyectosAsignados: ['Oscilaciones de procesos industriales', 'Eficiencia energética'],
    estado: 'Activo',
    contacto: { email: 'jramirez@ejemplo-universidad.test', telefono: '+54 11 4000-0101' },
    comentarios: 'Coordina las reuniones de cátedra y el informe bimestral.'
  },
  {
    id: 'D-02',
    nombre: 'Dr. Nicolás Sosa',
    rol: 'Docente-investigador',
    catedra: 'Departamento de Electrónica',
    cargo: 'Profesor Titular',
    proyectosAsignados: ['Instrumentación y medición'],
    estado: 'Activo',
    contacto: { email: 'nsosa@ejemplo-universidad.test', telefono: '+54 11 4000-0102' },
    comentarios: 'Referente del banco de oscilaciones y del instrumental compartido.'
  },
  {
    id: 'D-03',
    nombre: 'Ing. Paula Gómez',
    rol: 'Investigadora asistente',
    catedra: 'Departamento de Ingeniería Industrial',
    cargo: 'Auxiliar de Primera',
    proyectosAsignados: ['Oscilaciones de procesos industriales'],
    estado: 'Finalizando',
    contacto: { email: 'pgomez@ejemplo-universidad.test', telefono: '+54 11 4000-0103' },
    comentarios: 'Cierra su proyecto de oscilaciones antes de finalizar su doctorado.'
  },
  {
    id: 'D-04',
    nombre: 'Dr. Martín Quiroga',
    rol: 'Coordinador de área',
    catedra: 'Cátedra de Oscilaciones',
    cargo: 'Profesor Adjunto',
    proyectosAsignados: ['Eficiencia energética', 'Redes de sensores'],
    estado: 'Activo',
    contacto: { email: 'mquiroga@ejemplo-universidad.test', telefono: '+54 11 4000-0104' },
    comentarios: 'Encargado de la presentación ante la ANSyF.'
  },
  {
    id: 'D-05',
    nombre: 'Lic. Andrea Bruno',
    rol: 'Docente',
    catedra: 'Departamento de Física',
    cargo: 'Jefa de Departamento',
    proyectosAsignados: ['Modelado numérico'],
    estado: 'Finalizando',
    contacto: { email: 'abruno@ejemplo-universidad.test', telefono: '+54 11 4000-0105' },
    comentarios: 'El proyecto de modelado numérico llega a su cierre en diciembre.'
  },
  {
    id: 'D-06',
    nombre: 'Cr. Ignacio Peralta',
    rol: 'Becario asistente',
    catedra: 'Cátedra de Oscilaciones',
    cargo: 'Auxiliar de Segunda',
    proyectosAsignados: ['Modelado numérico'],
    estado: 'Activo',
    contacto: { email: 'iperalta@ejemplo-universidad.test', telefono: '+54 11 4000-0106' },
    comentarios: 'Beca de posgrado; continuidad sujeta a la evaluación anual.'
  },
  {
    id: 'D-07',
    nombre: 'Dra. Silvia Cañete',
    rol: 'Investigadora emérita',
    catedra: 'Departamento de Electrónica',
    cargo: 'Profesora Titular (jubilada)',
    proyectosAsignados: [],
    estado: 'Detenido',
    contacto: { email: 'scañete@ejemplo-universidad.test', telefono: '+54 11 4000-0107' },
    comentarios: 'Proyectos archivados a pedido de la interesada; conserva la autoría de sus publicaciones.'
  },
  {
    id: 'D-08',
    nombre: 'Ing. Héctor Barrios',
    rol: 'Responsable de laboratorio',
    catedra: 'Laboratorio de Oscilaciones',
    cargo: 'Jefe de Laboratorio',
    proyectosAsignados: ['Oscilaciones de procesos industriales', 'Redes de sensores'],
    estado: 'Activo',
    contacto: { email: 'hbarrios@ejemplo-universidad.test', telefono: '+54 11 4000-0108' },
    comentarios: 'Gestiona el instrumental compartido y los ensayos de terceros.'
  }
];

const MOCK_REUNIONES = [
  {
    id: 'R-01',
    nombre: 'Reunión de cátedra',
    fecha: '2026-09-04',
    tipo: 'Cátedra',
    temario: 'Estado de los proyectos activos y prioridades del bimestre.',
    tareas: ['T-02', 'T-04', 'T-15']
  },
  {
    id: 'R-02',
    nombre: 'Seguimiento del proyecto de oscilaciones',
    fecha: '2026-09-08',
    tipo: 'Seguimiento de proyecto',
    temario: 'Resultados del muestreo en planta y ajuste del protocolo de fatiga.',
    tareas: ['T-04', 'T-05']
  },
  {
    id: 'R-03',
    nombre: 'Entrega de informes de alumnos',
    fecha: '2026-09-11',
    tipo: 'Entrega de alumnos',
    temario: 'Recepción de informes de avance del primer semestre.',
    tareas: ['T-12']
  },
  {
    id: 'R-04',
    nombre: 'Apertura de convocatoria de becas',
    fecha: '2026-09-18',
    tipo: 'Convocatoria',
    temario: 'Definición de condiciones y difusión de la convocatoria.',
    tareas: ['T-07', 'T-15']
  },
  {
    id: 'R-05',
    nombre: 'Reunión de cátedra',
    fecha: '2026-09-25',
    tipo: 'Cátedra',
    temario: 'Cierre de tareas del bimestre y preparación del informe de avance.',
    tareas: ['T-02', 'T-08']
  },
  {
    id: 'R-06',
    nombre: 'Administración de fondos',
    fecha: '2026-09-29',
    tipo: 'Administrativa',
    temario: 'Revisión de rendiciones pendientes y compras del laboratorio.',
    tareas: ['T-08', 'T-11']
  },
  {
    id: 'R-07',
    nombre: 'Reunión de cátedra',
    fecha: '2026-08-27',
    tipo: 'Cátedra',
    temario: 'Balance del período anterior y planificación del siguiente.',
    tareas: ['T-05', 'T-14']
  },
  {
    id: 'R-08',
    nombre: 'Seguimiento del proyecto de energía',
    fecha: '2026-10-02',
    tipo: 'Seguimiento de proyecto',
    temario: 'Primera medición de eficiencia con la red de sensores.',
    tareas: ['T-01', 'T-10']
  }
];

const MOCK_PUBLICACIONES = [
  {
    id: 'P-01',
    nombre: 'Armónicos en osciladores de baja potencia',
    tipo: 'Revista',
    fecha: '2026-05-12',
    tareas: ['T-03', 'T-05'],
    descripcion: 'Caracterización espectral en cámara anecoica; revista de la facultad de ingeniería.'
  },
  {
    id: 'P-02',
    nombre: 'Sensores piezorresistivos para monitorización estructural',
    tipo: 'Congreso',
    fecha: '2026-06-03',
    tareas: ['T-04', 'T-10'],
    descripcion: 'Presentación oral en el congreso argentino de control automático.'
  },
  {
    id: 'P-03',
    nombre: 'Método numérico para predecir fatiga',
    tipo: 'Revista',
    fecha: '2026-07-20',
    tareas: ['T-05'],
    descripcion: 'Comparación de modelos frente a ensayos de banco; revista de física aplicada.'
  },
  {
    id: 'P-04',
    nombre: 'Muestreo de temperatura en el sector de compresión',
    tipo: 'Congreso',
    fecha: '2026-08-14',
    tareas: ['T-04'],
    descripcion: 'Póster aceptado en el taller de automatización y electrónica.'
  },
  {
    id: 'P-05',
    nombre: 'Eficiencia energética en instalaciones de laboratorio',
    tipo: 'Revista',
    fecha: '2026-09-02',
    tareas: ['T-01', 'T-15'],
    descripcion: 'Artículo en revisión; segunda ronda de revisores en curso.'
  },
  {
    id: 'P-06',
    nombre: 'Redes de sensores de bajo consumo',
    tipo: 'Congreso',
    fecha: '2026-09-11',
    tareas: ['T-10'],
    descripcion: 'Borrador de comunicación para el simposio de instrumentación.'
  }
];

const MOCK_FINANZAS = [
  {
    id: 'F-01',
    nombre: 'Rendición ANI 2025',
    cuit: '30-71234567-9',
    cbu: '0140356601500000019532',
    fecha: '2026-09-10',
    factura: 'Factura A',
    descripcion: 'Cierre del proyecto ANI 2025 con dos viajes pendientes de comprobante.',
    archivosAdjuntos: ['F-01-rendicion-ANI-2025.pdf', 'F-01-comprobantes-viajes.zip']
  },
  {
    id: 'F-02',
    nombre: 'Compra de instrumental de laboratorio',
    cuit: '30-70987654-3',
    cbu: '0140356601500000091826',
    fecha: '2026-09-05',
    factura: 'Factura B',
    descripcion: 'Fuentes de alimentación para el banco 2.',
    archivosAdjuntos: ['F-02-presupuesto.pdf', 'F-02-factura-B.pdf']
  },
  {
    id: 'F-03',
    nombre: 'Beca de posgrado 2026',
    cuit: '30-70987654-3',
    cbu: '0140356601500000077431',
    fecha: '2026-08-28',
    factura: 'Recibo',
    descripcion: 'Transferencia de la beca de posgrado del becario asistente.',
    archivosAdjuntos: ['F-03-recibo-beca.pdf']
  },
  {
    id: 'F-04',
    nombre: 'Seguro de laboratorio',
    cuit: '30-65432109-7',
    cbu: '0110599520000001234567',
    fecha: '2026-07-15',
    factura: 'Factura A',
    descripcion: 'Póliza anual del laboratorio de oscilaciones.',
    archivosAdjuntos: ['F-04-poliza.pdf']
  },
  {
    id: 'F-05',
    nombre: 'Publicación de actas de congreso',
    cuit: '30-59876543-1',
    cbu: '0140356601500000044558',
    fecha: '2026-06-18',
    factura: 'Factura B',
    descripcion: 'Gastos de publicación de las actas del congreso de control automático.',
    archivosAdjuntos: ['F-05-actas.pdf']
  },
  {
    id: 'F-06',
    nombre: 'Borrador de presupuesto anual 2027',
    cuit: '30-45678912-4',
    cbu: '0110599520000009081720',
    fecha: '2026-05-30',
    factura: 'Presupuesto',
    descripcion: 'Borrador de presupuesto anual presentado a la dirección del centro.',
    archivosAdjuntos: ['F-06-presupuesto-2027.xlsx']
  }
];

const MOCK_BECAS = [
  {
    id: 'B-01',
    nombre: 'Beca de investigación de posgrado',
    apertura: '2026-09-18',
    cierre: '2026-10-09',
    web: 'https://becas.ejemplo-universidad.test/2026/posgrado',
    descripcion: 'Beca para tesistas de doctorado asignados a proyectos del centro.',
    condiciones: 'Carga horaria de veinte horas semanales. Titular con evaluación de desempeño trimestral.'
  },
  {
    id: 'B-02',
    nombre: 'Beca de ayudantía',
    apertura: '2026-09-18',
    cierre: '2026-10-09',
    web: 'https://becas.ejemplo-universidad.test/2026/ayudantia',
    descripcion: 'Ayudantía en el laboratorio de oscilaciones para alumnos de grado.',
    condiciones: 'Dos años de carga horaria. Se requiere aprobado en físico-matemáticas y disponibilidad de seis horas semanales.'
  },
  {
    id: 'B-03',
    nombre: 'Beca de finalización de estudios',
    apertura: '2026-08-03',
    cierre: '2026-08-28',
    web: 'https://becas.ejemplo-universidad.test/2026/finalizacion',
    descripcion: 'Beca para alumnos de grado que culminan su trabajo final en el centro.',
    condiciones: 'Apertura y cierre cumplidos. Se evalúan las nuevas solicitudes en la convocatoria de diciembre.'
  },
  {
    id: 'B-04',
    nombre: 'Beca de extensión y transferencia',
    apertura: '2026-10-01',
    cierre: '2026-10-30',
    web: 'https://becas.ejemplo-universidad.test/2027/extension',
    descripcion: 'Beca para tareas de transferencia tecnológica y asistencia técnica.',
    condiciones: 'Prioridad para alumnos del último año. Convocatoria proyectada para octubre.'
  },
  {
    id: 'B-05',
    nombre: 'Beca de apoyo a la publicación',
    apertura: '2026-07-06',
    cierre: '2026-07-31',
    web: 'https://becas.ejemplo-universidad.test/2026/memoria',
    descripcion: 'Beca para el apoyo a la publicación y organización de congresos.',
    condiciones: 'Cerrada. La convocatoria se reanuda en el mes de junio de 2027.'
  }
];

const MOCK_DATOS = {
  tareas: MOCK_TAREAS,
  alumnos: MOCK_ALUMNOS,
  docentes: MOCK_DOCENTES,
  reuniones: MOCK_REUNIONES,
  publicaciones: MOCK_PUBLICACIONES,
  finanzas: MOCK_FINANZAS,
  becas: MOCK_BECAS
};

const MOCK_USUARIO = {
  nombre: 'Dra. Julieta Ramírez',
  rol: 'Investigadora principal',
  catedra: 'Cátedra de Oscilaciones',
  proyectos: ['Oscilaciones de procesos industriales', 'Eficiencia energética']
};

const MOCK_MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

window.CIDTIEE_MOCK = {
  datos: MOCK_DATOS,
  usuario: MOCK_USUARIO,
  meses: MOCK_MESES
};
