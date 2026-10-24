const CONFIG = {
  NOTION_TOKEN: '',
  DB_TAREAS: '',
  DB_ALUMNOS: '',
  DB_DOCENTES: '',
  DB_REUNIONES: '',
  DB_PUBLICACIONES: '',
  DB_FINANZAS: '',
  DB_BECAS: '',
  USUARIO: ''
};

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

const ENTIDADES = [
  {
    clave: 'tareas',
    etiqueta: 'Tareas',
    db: 'DB_TAREAS',
    titulo: 'nombre',
    campos: [
      { etiqueta: 'Nombre', clave: 'nombre', resumen: true },
      { etiqueta: 'Descripción', clave: 'descripcion' },
      { etiqueta: 'Tipo', clave: 'tipo', resumen: true },
      { etiqueta: 'Estado', clave: 'estado', resumen: true },
      { etiqueta: 'Información', clave: 'informacion' },
      { etiqueta: 'Prioridad', clave: 'prioridad', resumen: true }
    ]
  },
  {
    clave: 'alumnos',
    etiqueta: 'Alumnos',
    db: 'DB_ALUMNOS',
    titulo: 'nombre',
    campos: [
      { etiqueta: 'Nombre', clave: 'nombre', resumen: true },
      { etiqueta: 'Tipo', clave: 'tipo', resumen: true },
      { etiqueta: 'Fecha', clave: 'fecha' },
      { etiqueta: 'Estado', clave: 'estado', resumen: true },
      { etiqueta: 'Docente a cargo', clave: 'docenteACargo', resumen: true },
      { etiqueta: 'Entregas', clave: 'entregas' },
      { etiqueta: 'Comentarios', clave: 'comentarios' }
    ]
  },
  {
    clave: 'docentes',
    etiqueta: 'Docentes',
    db: 'DB_DOCENTES',
    titulo: 'nombre',
    campos: [
      { etiqueta: 'Nombre', clave: 'nombre', resumen: true },
      { etiqueta: 'Rol', clave: 'rol', resumen: true },
      { etiqueta: 'Cátedra o departamento', clave: 'catedra' },
      { etiqueta: 'Cargo', clave: 'cargo' },
      { etiqueta: 'Proyectos asignados', clave: 'proyectosAsignados' },
      { etiqueta: 'Estado', clave: 'estado', resumen: true },
      { etiqueta: 'Contacto', clave: 'contacto' },
      { etiqueta: 'Comentarios', clave: 'comentarios' }
    ]
  },
  {
    clave: 'reuniones',
    etiqueta: 'Reuniones',
    db: 'DB_REUNIONES',
    titulo: 'nombre',
    campos: [
      { etiqueta: 'Nombre', clave: 'nombre', resumen: true },
      { etiqueta: 'Fecha', clave: 'fecha', resumen: true },
      { etiqueta: 'Tipo', clave: 'tipo', resumen: true },
      { etiqueta: 'Temario', clave: 'temario' },
      { etiqueta: 'Tareas', clave: 'tareas' }
    ]
  },
  {
    clave: 'publicaciones',
    etiqueta: 'Publicaciones',
    db: 'DB_PUBLICACIONES',
    titulo: 'nombre',
    campos: [
      { etiqueta: 'Nombre', clave: 'nombre', resumen: true },
      { etiqueta: 'Tipo', clave: 'tipo', resumen: true },
      { etiqueta: 'Fecha', clave: 'fecha' },
      { etiqueta: 'Tareas', clave: 'tareas' },
      { etiqueta: 'Descripción', clave: 'descripcion' }
    ]
  },
  {
    clave: 'finanzas',
    etiqueta: 'Finanzas',
    db: 'DB_FINANZAS',
    titulo: 'nombre',
    campos: [
      { etiqueta: 'Nombre', clave: 'nombre', resumen: true },
      { etiqueta: 'CUIT', clave: 'cuit' },
      { etiqueta: 'CBU', clave: 'cbu' },
      { etiqueta: 'Fecha', clave: 'fecha' },
      { etiqueta: 'Factura', clave: 'factura', resumen: true },
      { etiqueta: 'Descripción', clave: 'descripcion' },
      { etiqueta: 'Archivos adjuntos', clave: 'archivosAdjuntos' }
    ]
  },
  {
    clave: 'becas',
    etiqueta: 'Becas',
    db: 'DB_BECAS',
    titulo: 'nombre',
    campos: [
      { etiqueta: 'Nombre', clave: 'nombre', resumen: true },
      { etiqueta: 'Apertura', clave: 'apertura' },
      { etiqueta: 'Cierre', clave: 'cierre' },
      { etiqueta: 'Web', clave: 'web' },
      { etiqueta: 'Descripción', clave: 'descripcion' },
      { etiqueta: 'Condiciones', clave: 'condiciones' }
    ]
  }
];

const MARCA_EVENTO = {
  'Cátedra': { clase: 'cal--reunion', etiqueta: 'Cátedra' },
  'Seguimiento de proyecto': { clase: 'cal--reunion', etiqueta: 'Seguimiento de proyecto' },
  'Entrega de alumnos': { clase: 'cal--entrega', etiqueta: 'Entrega de alumnos' },
  'Convocatoria': { clase: 'cal--beca', etiqueta: 'Convocatoria' },
  'Administrativa': { clase: 'cal--entrega', etiqueta: 'Administrativa' }
};

const PRIORIDAD_ORDEN = { Alta: 0, Media: 1, Baja: 2 };
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function descriptor(clave) {
  const encontrado = ENTIDADES.filter(function (entidad) { return entidad.clave === clave; })[0];
  if (!encontrado) {
    throw new Error('No pudimos identificar esa base de datos. Recargá la página o avisá a soporte.');
  }
  return encontrado;
}

function usandoNotion() {
  return typeof CONFIG.NOTION_TOKEN === 'string' && CONFIG.NOTION_TOKEN.trim().length > 0;
}

function datosMock() {
  const mock = window.CIDTIEE_MOCK;
  if (!mock || !mock.datos) {
    throw new Error('No pudimos cargar la información. Recargá la página o avisá a soporte.');
  }
  return mock.datos;
}

function usuarioActual() {
  if (!usandoNotion() && window.CIDTIEE_MOCK && window.CIDTIEE_MOCK.usuario) {
    return window.CIDTIEE_MOCK.usuario;
  }
  return {
    nombre: CONFIG.USUARIO || 'Usuario sin sesión',
    rol: '',
    catedra: '',
    proyectos: []
  };
}

function valorNotion(propiedad) {
  if (!propiedad || !propiedad.type) { return ''; }
  switch (propiedad.type) {
    case 'title': return propiedad.title.map(function (trozo) { return trozo.plain_text; }).join('');
    case 'rich_text': return propiedad.rich_text.map(function (trozo) { return trozo.plain_text; }).join('');
    case 'select': return propiedad.select ? propiedad.select.name : '';
    case 'status': return propiedad.status ? propiedad.status.name : '';
    case 'multi_select': return propiedad.multi_select.map(function (opcion) { return opcion.name; });
    case 'date': return propiedad.date ? propiedad.date.start : '';
    case 'checkbox': return propiedad.checkbox;
    case 'number': return propiedad.number;
    case 'email': return propiedad.email;
    case 'phone_number': return propiedad.phone_number;
    case 'url': return propiedad.url;
    case 'files': return propiedad.files.map(function (archivo) { return archivo.name; });
    case 'people': return propiedad.people.map(function (persona) { return persona.name; });
    case 'relation': return propiedad.relation.map(function (vinculo) { return vinculo.id; });
    case 'created_time': return propiedad.created_time;
    default: return '';
  }
}

function normalizarNotion(entidad, pagina) {
  const registro = { id: pagina.id };
  entidad.campos.forEach(function (campo) {
    registro[campo.clave] = valorNotion(pagina.properties[campo.etiqueta]);
  });
  return registro;
}

function consultarNotion(entidad) {
  const idBase = CONFIG[entidad.db];
  if (!idBase) {
    return Promise.reject(new Error(
      'La base "' + entidad.etiqueta + '" todavía no está conectada a Notion. Recargá la página o avisá a soporte.'
    ));
  }
  return fetch(NOTION_API + '/databases/' + idBase + '/query', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + CONFIG.NOTION_TOKEN.trim(),
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ page_size: 100 })
  })
    .then(function (respuesta) {
      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 401 || respuesta.status === 403
            ? 'No pudimos conectar con Notion: la clave de acceso no es válida. Avisá a soporte.'
            : 'No pudimos conectar con Notion. Revisá tu conexión o avisá a soporte.'
        );
      }
      return respuesta.json();
    })
    .then(function (json) {
      return (json.results || []).map(function (pagina) {
        return normalizarNotion(entidad, pagina);
      });
    });
}

function obtenerEntidad(clave) {
  const entidad = descriptor(clave);
  if (!usandoNotion()) {
    return Promise.resolve(datosMock()[clave] || []);
  }
  return consultarNotion(entidad);
}

function obtenerTodas() {
  if (!usandoNotion()) {
    return Promise.resolve(datosMock());
  }
  return Promise.all(ENTIDADES.map(function (entidad) {
    return consultarNotion(entidad).then(function (filas) {
      var conjunto = {};
      conjunto[entidad.clave] = filas;
      return conjunto;
    });
  })).then(function (partes) {
    return partes.reduce(function (acumulado, parte) {
      Object.keys(parte).forEach(function (clave) { acumulado[clave] = parte[clave]; });
      return acumulado;
    }, {});
  });
}

function hoyISO() {
  const momento = new Date();
  return momento.getFullYear() + '-' + String(momento.getMonth() + 1).padStart(2, '0') + '-' + String(momento.getDate()).padStart(2, '0');
}

function etiquetaMes(clave) {
  const partes = clave.split('-');
  return MESES[Number(partes[1]) - 1] + ' ' + partes[0];
}

function mesConMasReuniones(reuniones) {
  const conteo = {};
  reuniones.forEach(function (reunion) {
    const clave = String(reunion.fecha).slice(0, 7);
    conteo[clave] = (conteo[clave] || 0) + 1;
  });
  const claves = Object.keys(conteo);
  claves.sort(function (a, b) {
    return conteo[b] - conteo[a] || a.localeCompare(b);
  });
  return claves.length ? claves[0] : hoyISO().slice(0, 7);
}

function construirCifras(datos) {
  const tareas = datos.tareas || [];
  const abiertas = tareas.filter(function (tarea) {
    return ['Pendiente', 'En curso', 'En revisión'].indexOf(tarea.estado) > -1;
  });
  const proyectos = [];
  (datos.docentes || []).forEach(function (docente) {
    if (docente.estado !== 'Activo') { return; }
    (docente.proyectosAsignados || []).forEach(function (proyecto) {
      if (proyectos.indexOf(proyecto) === -1) { proyectos.push(proyecto); }
    });
  });
  return {
    proyectosActivos: proyectos.length,
    alumnosVinculados: (datos.alumnos || []).filter(function (alumno) {
      return alumno.estado !== 'Baja justificada';
    }).length,
    publicaciones: (datos.publicaciones || []).length,
    tareasAbiertas: abiertas.length
  };
}

function construirAgenda(reuniones, mes) {
  return reuniones
    .filter(function (reunion) { return String(reunion.fecha).slice(0, 7) === mes; })
    .sort(function (a, b) { return String(a.fecha).localeCompare(String(b.fecha)); })
    .map(function (reunion) {
      return {
        id: reunion.id,
        fecha: String(reunion.fecha),
        dia: Number(String(reunion.fecha).slice(8, 10)),
        nombre: reunion.nombre,
        tipo: reunion.tipo,
        cantidadTareas: (reunion.tareas || []).length,
        marca: MARCA_EVENTO[reunion.tipo] || { clase: 'cal--reunion', etiqueta: reunion.tipo }
      };
    });
}

function construirLeyenda(agenda) {
  const vistas = [];
  agenda.forEach(function (evento) {
    const repetida = vistas.some(function (item) { return item.clase === evento.marca.clase; });
    if (!repetida) { vistas.push({ clase: evento.marca.clase, etiqueta: evento.marca.etiqueta }); }
  });
  return vistas;
}

function construirEventos(reuniones) {
  const mes = mesConMasReuniones(reuniones);
  const agenda = construirAgenda(reuniones, mes);
  const partes = mes.split('-');
  const numeroMes = Number(partes[1]);
  const anio = Number(partes[0]);
  const mesSiguiente = numeroMes === 12 ? anio + 1 + '-01' : anio + '-' + String(numeroMes + 1).padStart(2, '0');

  return {
    mes: mes,
    etiquetaMes: etiquetaMes(mes),
    anio: anio,
    numeroMes: numeroMes,
    diasDelMes: new Date(anio, numeroMes, 0).getDate(),
    agenda: agenda,
    leyenda: construirLeyenda(agenda),
    proximas: construirAgenda(reuniones, mesSiguiente).slice(0, 3)
  };
}

function construirMisProyectos(datos, usuario) {
  const tareas = (datos.tareas || [])
    .filter(function (tarea) {
      return ['Pendiente', 'En curso', 'En revisión'].indexOf(tarea.estado) > -1;
    })
    .sort(function (a, b) {
      return (PRIORIDAD_ORDEN[a.prioridad] === undefined ? 9 : PRIORIDAD_ORDEN[a.prioridad])
        - (PRIORIDAD_ORDEN[b.prioridad] === undefined ? 9 : PRIORIDAD_ORDEN[b.prioridad])
        || String(a.nombre).localeCompare(String(b.nombre));
    })
    .map(function (tarea) {
      return {
        id: tarea.id,
        titulo: tarea.nombre,
        meta: tarea.prioridad + ' · ' + tarea.estado
      };
    });

  const entregas = [];
  (datos.alumnos || []).forEach(function (alumno) {
    if (alumno.docenteACargo !== usuario.nombre) { return; }
    (alumno.entregas || []).forEach(function (entrega) {
      if (entrega.estado !== 'Pendiente') { return; }
      entregas.push({
        id: alumno.id + '/' + entrega.titulo,
        titulo: entrega.titulo + ' — ' + alumno.nombre,
        meta: 'Vence el ' + String(entrega.fecha).split('-').reverse().join('/') + ' · ' + alumno.tipo,
        orden: String(entrega.fecha)
      });
    });
  });
  entregas.sort(function (a, b) { return a.orden.localeCompare(b.orden); });

  const reuniones = (datos.reuniones || [])
    .filter(function (reunion) { return String(reunion.fecha) >= hoyISO(); })
    .sort(function (a, b) { return String(a.fecha).localeCompare(String(b.fecha)); })
    .slice(0, 4)
    .map(function (reunion) {
      return {
        id: reunion.id,
        titulo: reunion.nombre,
        meta: String(reunion.fecha).split('-').reverse().join('/') + ' · ' + reunion.tipo
      };
    });

  return {
    usuario: usuario,
    grupos: [
      { titulo: 'Tareas abiertas', items: tareas },
      { titulo: 'Próximas reuniones', items: reuniones },
      { titulo: 'Entregas de alumnos a cargo', items: entregas }
    ]
  };
}

const notionService = {
  modo: function () {
    return usandoNotion() ? 'notion' : 'mock';
  },

  marcas: function () {
    return MARCA_EVENTO;
  },

  listarEntidades: function () {
    return ENTIDADES.map(function (entidad) {
      return {
        clave: entidad.clave,
        etiqueta: entidad.etiqueta,
        titulo: entidad.titulo,
        campos: entidad.campos
      };
    });
  },

  obtenerResumen: function () {
    return obtenerTodas().then(function (datos) {
      return {
        cifras: construirCifras(datos),
        eventos: construirEventos(datos.reuniones || []),
        misProyectos: construirMisProyectos(datos, usuarioActual())
      };
    });
  },

  obtenerRegistros: function (clave) {
    return obtenerEntidad(clave);
  },

  obtenerDetalle: function (clave, id) {
    const entidad = descriptor(clave);
    return obtenerEntidad(clave).then(function (filas) {
      const registro = filas.filter(function (fila) { return String(fila.id) === String(id); })[0];
      if (!registro) {
        throw new Error(
          'No encontramos esa tarjeta. Puede que la hayas borrado en Notion: actualizá la página para ver los datos más recientes.'
        );
      }
      return {
        entidad: entidad.etiqueta,
        titulo: registro[entidad.titulo] || 'Sin título',
        campoTitulo: entidad.campos.filter(function (campo) {
          return campo.clave === entidad.titulo;
        })[0].etiqueta,
        campos: entidad.campos
          .filter(function (campo) { return campo.clave !== 'id'; })
          .map(function (campo) {
            return { etiqueta: campo.etiqueta, valor: registro[campo.clave] };
          })
      };
    });
  }
};

window.CONFIG = CONFIG;
window.notionService = notionService;
