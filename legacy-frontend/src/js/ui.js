const UI = {
  servicio: window.notionService,
  entidadActual: null,
  registrosActuales: [],
  cacheDetalle: {},
  mesVisible: null,
  reuniones: [],
  marcas: {}
};

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const DIAS_CORTOS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const ANIO_MIN = new Date().getFullYear() - 3;
const ANIO_MAX = new Date().getFullYear() + 2;
const CLASES_ESTADO = {
  'Activo': 'estado--activo',
  'Finalizando': 'estado--finalizando',
  'Detenido': 'estado--detenido'
};
const LLAVE_TEMA = 'cidtiee.tema';
const LLAVE_BIENVENIDA = 'cidtiee.bienvenida';

const ICONOS = {
  tareas: '<path d="M4 6.5h2.4M4 12h2.4M4 17.5h2.4M10 6.5h10M10 12h10M10 17.5h10"/>',
  alumnos: '<circle cx="9" cy="8" r="3.2"/><path d="M3.4 19.2a5.6 5.6 0 0 1 11.2 0"/><path d="M16.2 5.4a2.8 2.8 0 0 1 0 5.4"/><path d="M17.4 14.6a5.2 5.2 0 0 1 3.2 4.6"/>',
  docentes: '<circle cx="8" cy="8" r="2.8"/><path d="M2.8 19a5.2 5.2 0 0 1 10.4 0"/><rect x="14.5" y="3.5" width="7" height="5"/><path d="M14.5 6h7M18 8.5V12M15.5 12h5"/>',
  reuniones: '<rect x="3.5" y="5" width="17" height="15"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/><path d="M7.5 13h4M7.5 16.5h9"/>',
  publicaciones: '<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5V8h4M9 12.5h6M9 16h6"/>',
  finanzas: '<path d="M5 3.5h14v17l-2.33-1.5L14.34 20.5 12 19l-2.34 1.5L7.33 19 5 20.5z"/><path d="M9 8.5h6M9 12.5h6"/>',
  becas: '<path d="M2.5 9 12 4.6 21.5 9 12 13.4z"/><path d="M6.6 10.9v4.4c0 1.5 2.4 2.7 5.4 2.7s5.4-1.2 5.4-2.7v-4.4"/><path d="M20.2 10v4.2"/>'
};

const PISTAS = {
  tareas: 'Tus pendientes',
  alumnos: 'Alumnos a cargo',
  docentes: 'Equipo y proyectos',
  reuniones: 'Reuniones y entregas',
  publicaciones: 'Artículos de revista',
  finanzas: 'Facturas y rendiciones',
  becas: 'Convocatorias abiertas'
};

const MENSAJES = {
  general: 'No pudimos cargar la información.',
  sugerencia: 'Recargá la página o avisá a soporte.',
  conexion: 'No pudimos conectar con Notion.'
};

function crear(tag, clase, contenido) {
  const nodo = document.createElement(tag);
  if (clase) { nodo.className = clase; }
  if (contenido !== undefined && contenido !== null) { nodo.textContent = contenido; }
  return nodo;
}

function soloLectores(texto) {
  return crear('span', 'sr-only', texto);
}

function sinAcentos(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function fechaLarga(iso) {
  const partes = String(iso).split('-');
  const dia = Number(partes[2]);
  const mes = Number(partes[1]);
  const indice = (new Date(Number(partes[0]), mes - 1, dia).getDay() + 6) % 7;
  return DIAS_SEMANA[indice] + ' ' + dia + ' de ' + MESES[mes - 1].toLowerCase() + ' de ' + partes[0];
}

function valorVacio(valor) {
  if (typeof valor === 'boolean') { return false; }
  if (Array.isArray(valor)) { return valor.length === 0; }
  if (valor && typeof valor === 'object') { return Object.keys(valor).length === 0; }
  return valor === '' || valor === null || valor === undefined;
}

function detalleTecnico(error) {
  if (typeof console !== 'undefined' && console.error) {
    console.error('[CIDTIEE]', error);
  }
}

function pintarError(contenedor, mensaje, reintentar) {
  contenedor.textContent = '';
  const caja = crear('div', 'error-carga');
  caja.appendChild(crear('p', 'error-carga__texto', mensaje + ' ' + MENSAJES.sugerencia));
  if (typeof reintentar === 'function') {
    const boton = crear('button', 'error-carga__accion', 'Reintentar');
    boton.type = 'button';
    boton.addEventListener('click', reintentar);
    caja.appendChild(boton);
  }
  contenedor.appendChild(caja);
}

function errorEnTabla(mensaje, reintentar) {
  const cuerpo = document.getElementById('cal-cuerpo');
  const titulo = document.getElementById('cal-titulo');
  cuerpo.textContent = '';
  titulo.textContent = 'Calendario no disponible';
  const fila = document.createElement('tr');
  const celda = document.createElement('td');
  celda.colSpan = 7;
  celda.appendChild(crear('p', 'error-carga__texto', mensaje + ' ' + MENSAJES.sugerencia));
  if (typeof reintentar === 'function') {
    const boton = crear('button', 'error-carga__accion', 'Reintentar');
    boton.type = 'button';
    boton.addEventListener('click', reintentar);
    celda.appendChild(boton);
  }
  fila.appendChild(celda);
  cuerpo.appendChild(fila);
}

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
  const boton = document.getElementById('theme-toggle');
  if (boton) {
    const oscuro = tema === 'dark';
    boton.setAttribute('aria-pressed', oscuro ? 'true' : 'false');
    const etiqueta = boton.querySelector('.theme-toggle__etiqueta');
    if (etiqueta) { etiqueta.textContent = oscuro ? 'Modo claro' : 'Modo oscuro'; }
  }
}

function temaGuardado() {
  try {
    return window.localStorage.getItem(LLAVE_TEMA);
  } catch (error) {
    return null;
  }
}

function guardarTema(tema) {
  try {
    window.localStorage.setItem(LLAVE_TEMA, tema);
  } catch (error) {
    return;
  }
}

function iniciarTema() {
  const guardado = temaGuardado();
  if (guardado === 'dark' || guardado === 'light') {
    aplicarTema(guardado);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    aplicarTema('dark');
  }
  const boton = document.getElementById('theme-toggle');
  if (!boton) { return; }
  boton.addEventListener('click', function () {
    const actual = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    aplicarTema(actual);
    guardarTema(actual);
  });
}

function pintarCifras(cifras) {
  const caja = document.getElementById('cifras');
  caja.textContent = '';
  [
    { valor: cifras.proyectosActivos, label: 'Proyectos activos' },
    { valor: cifras.alumnosVinculados, label: 'Alumnos vinculados' },
    { valor: cifras.publicaciones, label: 'Publicaciones' },
    { valor: cifras.tareasAbiertas, label: 'Tareas abiertas' }
  ].forEach(function (item) {
    const fila = crear('div', 'cifra');
    fila.appendChild(crear('span', 'cifra__valor', String(item.valor)));
    fila.appendChild(crear('span', 'cifra__label', item.label));
    caja.appendChild(fila);
  });
}

function pintarAgenda(eventos, idContenedor, textoVacio) {
  const lista = document.getElementById(idContenedor);
  lista.textContent = '';
  if (!eventos.length) {
    lista.appendChild(crear('li', 'agenda__vacia', textoVacio || 'Nada para mostrar por ahora.'));
    return;
  }
  eventos.forEach(function (evento) {
    const item = document.createElement('li');
    item.appendChild(crear('span', 'agenda__fecha', fechaLarga(evento.fecha)));
    item.appendChild(crear('span', 'agenda__titulo', evento.nombre));
    const partes = [evento.tipo];
    if (typeof evento.cantidadTareas === 'number') {
      partes.push(evento.cantidadTareas + (evento.cantidadTareas === 1 ? ' tarea' : ' tareas'));
    }
    item.appendChild(crear('span', 'agenda__meta', partes.join(' · ')));
    lista.appendChild(item);
  });
}

function pintarLeyenda(items) {
  const lista = document.getElementById('leyenda');
  lista.textContent = '';
  lista.hidden = items.length === 0;
  items.forEach(function (item) {
    const fila = document.createElement('li');
    const muestra = crear('i', 'leyenda__marca ' + item.clase);
    muestra.setAttribute('aria-hidden', 'true');
    fila.appendChild(muestra);
    fila.appendChild(document.createTextNode(item.etiqueta));
    lista.appendChild(fila);
  });
}

function dosDigitos(numero) {
  return numero < 10 ? '0' + numero : String(numero);
}

function claveMes(anio, mes) {
  return anio + '-' + dosDigitos(mes);
}

function partesMes(clave) {
  return { anio: Number(clave.slice(0, 4)), mes: Number(clave.slice(5, 7)) };
}

function nombreMes(clave) {
  const partes = partesMes(clave);
  return MESES[partes.mes - 1] + ' ' + partes.anio;
}

function desplazarMes(clave, pasos) {
  const partes = partesMes(clave);
  const total = partes.anio * 12 + (partes.mes - 1) + pasos;
  const mes = ((total % 12) + 12) % 12;
  return claveMes(Math.floor(total / 12), mes + 1);
}

function mesDentroDeRango(clave) {
  return clave >= claveMes(ANIO_MIN, 1) && clave <= claveMes(ANIO_MAX, 12);
}

function eventosDelMes(clave) {
  const marcas = UI.marcas;
  return UI.reuniones
    .filter(function (reunion) {
      return String(reunion.fecha).slice(0, 7) === clave;
    })
    .sort(function (a, b) {
      return String(a.fecha).localeCompare(String(b.fecha));
    })
    .map(function (reunion) {
      return {
        id: reunion.id,
        fecha: String(reunion.fecha),
        nombre: reunion.nombre,
        tipo: reunion.tipo,
        cantidadTareas: (reunion.tareas || []).length,
        marca: marcas[reunion.tipo] || { clase: 'cal--reunion', etiqueta: reunion.tipo }
      };
    });
}

function pintarCalendario() {
  const cuerpo = document.getElementById('cal-cuerpo');
  const titulo = document.getElementById('cal-titulo');
  const clave = UI.mesVisible;
  const partes = partesMes(clave);
  const porDia = {};
  const hoy = new Date();
  let fila = null;

  cuerpo.textContent = '';
  cuerpo.removeAttribute('aria-busy');
  titulo.textContent = nombreMes(clave);

  const eventos = eventosDelMes(clave);
  eventos.forEach(function (evento) {
    if (!porDia[evento.fecha]) { porDia[evento.fecha] = []; }
    porDia[evento.fecha].push(evento);
  });

  const desplazamiento = (new Date(partes.anio, partes.mes - 1, 1).getDay() + 6) % 7;
  const diasDelMes = new Date(partes.anio, partes.mes, 0).getDate();
  const celdas = Math.ceil((desplazamiento + diasDelMes) / 7) * 7;

  for (let i = 0; i < celdas; i++) {
    if (i % 7 === 0) {
      if (fila) { cuerpo.appendChild(fila); }
      fila = document.createElement('tr');
    }
    const dia = i - desplazamiento + 1;
    const celda = document.createElement('td');

    if (dia < 1 || dia > diasDelMes) {
      celda.className = 'cal__vacia';
    } else {
      celda.appendChild(crear('span', 'cal__num', String(dia)));
      const claveDia = clave + '-' + dosDigitos(dia);
      const delDia = porDia[claveDia] || [];
      delDia.forEach(function (evento) {
        const marca = crear('span', 'cal__marca ' + evento.marca.clase);
        marca.setAttribute('aria-hidden', 'true');
        celda.appendChild(marca);
      });
      if (delDia.length) {
        celda.setAttribute('title', delDia.map(function (evento) { return evento.nombre; }).join(' · '));
        celda.appendChild(soloLectores(delDia.length === 1 ? '1 reunión' : delDia.length + ' reuniones'));
      }
      if (hoy.getFullYear() === partes.anio && hoy.getMonth() + 1 === partes.mes && hoy.getDate() === dia) {
        celda.className = 'cal__hoy';
      }
    }
    fila.appendChild(celda);
  }
  if (fila) { cuerpo.appendChild(fila); }

  pintarAgenda(eventos, 'agenda', 'No hay reuniones programadas para este mes');
  pintarLeyenda(eventos.map(function (evento) {
    return { clase: evento.marca.clase, etiqueta: evento.marca.etiqueta };
  }).filter(function (marca, indice, todas) {
    return todas.findIndex(function (otra) { return otra.etiqueta === marca.etiqueta; }) === indice;
  }));

  const siguiente = desplazarMes(clave, 1);
  document.getElementById('proximas-titulo').textContent =
    'Próximas reuniones · ' + nombreMes(siguiente);
  pintarAgenda(eventosDelMes(siguiente), 'agenda-proximas', 'No hay reuniones para el mes siguiente');

  document.getElementById('cal-mes').value = String(partes.mes);
  document.getElementById('cal-anio').value = String(partes.anio);
  document.getElementById('cal-prev').disabled = !mesDentroDeRango(desplazarMes(clave, -1));
  document.getElementById('cal-next').disabled = !mesDentroDeRango(siguiente);
}

function pintarControlesCalendario() {
  const selectorMes = document.getElementById('cal-mes');
  const selectorAnio = document.getElementById('cal-anio');

  selectorMes.textContent = '';
  MESES.forEach(function (nombre, indice) {
    const opcion = crear('option', null, nombre);
    opcion.value = String(indice + 1);
    selectorMes.appendChild(opcion);
  });

  selectorAnio.textContent = '';
  for (let anio = ANIO_MIN; anio <= ANIO_MAX; anio++) {
    const opcion = crear('option', null, String(anio));
    opcion.value = String(anio);
    selectorAnio.appendChild(opcion);
  }
}

function moverMes(pasos) {
  const destino = desplazarMes(UI.mesVisible, pasos);
  if (!mesDentroDeRango(destino)) { return; }
  UI.mesVisible = destino;
  pintarCalendario();
}

function iniciarCalendario() {
  pintarControlesCalendario();

  document.getElementById('cal-prev').addEventListener('click', function () { moverMes(-1); });
  document.getElementById('cal-next').addEventListener('click', function () { moverMes(1); });

  document.getElementById('cal-mes').addEventListener('change', function (evento) {
    const partes = partesMes(UI.mesVisible);
    UI.mesVisible = claveMes(partes.anio, Number(evento.target.value));
    pintarCalendario();
  });

  document.getElementById('cal-anio').addEventListener('change', function (evento) {
    const partes = partesMes(UI.mesVisible);
    UI.mesVisible = claveMes(Number(evento.target.value), partes.mes);
    pintarCalendario();
  });

  const hoy = new Date();
  UI.mesVisible = claveMes(hoy.getFullYear(), hoy.getMonth() + 1);

  UI.servicio.obtenerRegistros('reuniones').then(function (filas) {
    UI.reuniones = filas || [];
    pintarCalendario();
  }).catch(function (error) {
    detalleTecnico(error);
    UI.reuniones = [];
    pintarAgenda([], 'agenda', 'No pudimos cargar las reuniones de este mes.');
    pintarAgenda([], 'agenda-proximas', 'No pudimos cargar las reuniones del mes siguiente.');
    errorEnTabla(MENSAJES.general, function () { iniciarCalendario(); });
  });
}

function pintarMisProyectos(datos) {
  const panel = document.getElementById('mis-proyectos-panel');
  const grupos = datos.grupos.filter(function (grupo) { return grupo.items.length > 0; });
  panel.textContent = '';

  if (!grupos.length) {
    pintarError(panel, 'Todavía no tenés tareas ni entregas asignadas.');
    return;
  }

  grupos.forEach(function (grupo) {
    const caja = crear('div', 'grupo');
    const titulo = crear('h3', 'panel-titulo');
    titulo.appendChild(document.createTextNode(grupo.titulo));
    titulo.appendChild(crear('span', null, String(grupo.items.length)));
    caja.appendChild(titulo);

    const lista = document.createElement('ul');
    lista.className = 'misproyectos__lista';
    grupo.items.forEach(function (item) {
      const fila = document.createElement('li');
      fila.appendChild(crear('span', null, item.titulo));
      fila.appendChild(crear('span', null, item.meta));
      lista.appendChild(fila);
    });
    caja.appendChild(lista);
    panel.appendChild(caja);
  });

  const nombreUsuario = document.querySelector('[data-usuario]');
  if (nombreUsuario) {
    nombreUsuario.textContent = datos.usuario.nombre
      + (datos.usuario.rol ? ' · ' + datos.usuario.rol : '');
  }
}

function pintarListaObjetos(valor) {
  const lista = crear('ul', 'detalle__lista');
  valor.forEach(function (item) {
    const fila = document.createElement('li');
    const bloque = crear('dl', 'detalle__objeto');
    Object.keys(item).forEach(function (clave) {
      const par = document.createElement('div');
      par.appendChild(crear('dt', null, clave));
      par.appendChild(crear('dd', null, item[clave]));
      bloque.appendChild(par);
    });
    fila.appendChild(bloque);
    lista.appendChild(fila);
  });
  return lista;
}

function pintarCampo(valor) {
  if (valorVacio(valor)) {
    return crear('span', 'detalle__vacio', '—');
  }
  if (typeof valor === 'boolean') {
    return document.createTextNode(valor ? 'Sí' : 'No');
  }
  if (Array.isArray(valor)) {
    if (valor.every(function (item) { return typeof item === 'string'; })) {
      const lista = crear('ul', 'detalle__lista');
      valor.forEach(function (item) { lista.appendChild(crear('li', null, item)); });
      return lista;
    }
    if (valor.every(function (item) { return item && typeof item === 'object' && !Array.isArray(item); })) {
      return pintarListaObjetos(valor);
    }
    const lista = crear('ul', 'detalle__lista');
    valor.forEach(function (item) { lista.appendChild(crear('li', null, String(item))); });
    return lista;
  }
  if (typeof valor === 'object') {
    const lista = crear('dl', 'detalle__objeto');
    Object.keys(valor).forEach(function (clave) {
      const fila = document.createElement('div');
      fila.appendChild(crear('dt', null, clave));
      fila.appendChild(crear('dd', null, valor[clave]));
      lista.appendChild(fila);
    });
    return lista;
  }
  return document.createTextNode(String(valor));
}

function abrirDetalle(clave, id) {
  const cache = UI.cacheDetalle[clave + '/' + id];
  const dialogo = document.getElementById('detalle');
  if (cache) {
    mostrarDetalle(dialogo, cache);
    return;
  }
  UI.servicio.obtenerDetalle(clave, id).then(function (detalle) {
    UI.cacheDetalle[clave + '/' + id] = detalle;
    mostrarDetalle(dialogo, detalle);
  }).catch(function (error) {
    detalleTecnico(error);
    document.getElementById('detalle-entidad').textContent = 'Sin conexión con Notion';
    document.getElementById('detalle-titulo').textContent = 'No pudimos abrir esta tarjeta';
    pintarError(document.getElementById('detalle-cuerpo'), MENSAJES.conexion);
    dialogo.showModal();
  });
}

function mostrarDetalle(dialogo, detalle) {
  document.getElementById('detalle-entidad').textContent = detalle.entidad;
  document.getElementById('detalle-titulo').textContent = detalle.titulo;

  const cuerpo = document.getElementById('detalle-cuerpo');
  cuerpo.textContent = '';
  const lista = crear('dl', 'detalle__campos');
  detalle.campos.forEach(function (campo) {
    if (campo.etiqueta === detalle.campoTitulo) { return; }
    const bloque = crear('div', 'detalle__campo');
    bloque.appendChild(crear('dt', null, campo.etiqueta));
    const valor = crear('dd');
    valor.appendChild(pintarCampo(campo.valor));
    bloque.appendChild(valor);
    lista.appendChild(bloque);
  });
  cuerpo.appendChild(lista);
  dialogo.showModal();
}

function crearIcono(clave) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'vista__icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.4');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.innerHTML = ICONOS[clave] || ICONOS.tareas;
  return svg;
}

function pintarVistas() {
  const contenedor = document.getElementById('filtro-entidad');
  contenedor.textContent = '';

  UI.entidades.forEach(function (entidad) {
    const boton = crear('button', 'vista');
    boton.type = 'button';
    boton.setAttribute('aria-pressed', 'false');
    boton.setAttribute('data-clave', entidad.clave);
    boton.appendChild(crearIcono(entidad.clave));

    const texto = crear('span', 'vista__texto');
    texto.appendChild(crear('span', 'vista__nombre', entidad.etiqueta));
    texto.appendChild(crear('span', 'vista__pista', PISTAS[entidad.clave] || 'Base de datos'));
    boton.appendChild(texto);

    boton.addEventListener('click', function () {
      if (UI.entidadActual && UI.entidadActual.clave === entidad.clave) { return; }
      marcarVista(entidad.clave);
      document.getElementById('buscar-registro').value = '';
      cargarEntidad(entidad.clave);
    });
    contenedor.appendChild(boton);
  });
}

function marcarVista(clave) {
  const botones = document.querySelectorAll('.vista');
  Array.prototype.forEach.call(botones, function (boton) {
    boton.setAttribute('aria-pressed', boton.getAttribute('data-clave') === clave ? 'true' : 'false');
  });
}

function pintarTarjetas(registros, entidad, consulta) {
  const contenedor = document.getElementById('explorador-tarjetas');
  const conteo = document.getElementById('explorador-conteo');
  contenedor.textContent = '';

  if (!registros.length) {
    conteo.textContent = 'Sin resultados';
    contenedor.appendChild(crear(
      'p',
      'vacio',
      consulta
        ? 'Ninguna tarjeta de ' + entidad.etiqueta + ' coincide con «' + consulta + '».'
        : 'Todavía no hay nada cargado en ' + entidad.etiqueta + '.'
    ));
    return;
  }

  conteo.textContent = 'Mostrando ' + registros.length + ' de ' + UI.registrosActuales.length
    + ' tarjetas de ' + entidad.etiqueta;

  registros.forEach(function (registro) {
    const boton = crear('button', 'tarjeta');
    boton.type = 'button';
    boton.setAttribute('aria-haspopup', 'dialog');
    boton.appendChild(crear('span', 'tarjeta__id', registro.id));
    boton.appendChild(crear('span', 'tarjeta__titulo', registro[entidad.titulo] || 'Sin título'));

    const datos = crear('div', 'tarjeta__datos');
    entidad.campos.filter(function (campo) {
      return campo.resumen && campo.clave !== entidad.titulo && !valorVacio(registro[campo.clave]);
    }).forEach(function (campo) {
      const valor = registro[campo.clave];
      if (Array.isArray(valor)) { return; }
      const pieza = crear('span', 'tarjeta__dato');
      pieza.appendChild(crear('b', null, campo.etiqueta + ': '));
      const clase = campo.etiqueta === 'Estado' ? CLASES_ESTADO[valor] : null;
      if (clase) {
        const badge = crear('span', 'estado ' + clase, valor);
        pieza.appendChild(badge);
      } else {
        pieza.appendChild(document.createTextNode(String(valor)));
      }
      datos.appendChild(pieza);
    });
    if (datos.children.length) { boton.appendChild(datos); }
    boton.appendChild(crear('span', 'tarjeta__pie', 'Ver detalle'));

    boton.addEventListener('click', function () { abrirDetalle(entidad.clave, registro.id); });
    contenedor.appendChild(boton);
  });
}

function valorBuscador() {
  const campo = document.getElementById('buscar-registro');
  return sinAcentos(String(campo && campo.value ? campo.value : '').trim());
}

function textoBuscable(valor) {
  if (valor === null || valor === undefined) { return ''; }
  if (typeof valor === 'boolean') { return valor ? 'si' : 'no'; }
  if (Array.isArray(valor)) {
    return valor.map(textoBuscable).join(' ');
  }
  if (typeof valor === 'object') {
    return Object.keys(valor).map(function (clave) {
      return clave + ' ' + textoBuscable(valor[clave]);
    }).join(' ');
  }
  return String(valor);
}

function coincideConsulta(registro, consulta) {
  if (!consulta) { return true; }
  return sinAcentos(textoBuscable(registro)).indexOf(consulta) > -1;
}

function aplicarFiltro() {
  const consulta = valorBuscador();
  const entidad = UI.entidadActual;
  if (!entidad) { return; }
  const filtrados = UI.registrosActuales.filter(function (registro) {
    return coincideConsulta(registro, consulta);
  });
  pintarTarjetas(filtrados, entidad, consulta);
}

function cargarEntidad(clave) {
  const entidad = UI.entidades.filter(function (item) { return item.clave === clave; })[0];
  const contenedor = document.getElementById('explorador-tarjetas');
  const conteo = document.getElementById('explorador-conteo');

  if (!entidad) { return; }
  UI.entidadActual = entidad;
  contenedor.textContent = '';
  conteo.textContent = 'Buscando ' + entidad.etiqueta + ' en Notion…';

  UI.servicio.obtenerRegistros(clave).then(function (registros) {
    UI.registrosActuales = registros || [];
    aplicarFiltro();
  }).catch(function (error) {
    detalleTecnico(error);
    conteo.textContent = 'No se pudo cargar';
    pintarError(contenedor, 'No pudimos cargar ' + entidad.etiqueta + '.', function () {
      cargarEntidad(clave);
    });
  });
}

function iniciarExplorador() {
  const contenedor = document.getElementById('filtro-entidad');
  const buscar = document.getElementById('buscar-registro');
  if (!contenedor || !buscar) { return; }

  UI.entidades = UI.servicio.listarEntidades();
  pintarVistas();

  buscar.addEventListener('input', aplicarFiltro);

  document.getElementById('explorador-form').addEventListener('submit', function (evento) {
    evento.preventDefault();
    aplicarFiltro();
  });

  if (!UI.entidades.length) {
    document.getElementById('explorador-conteo').textContent = 'No se pudo cargar';
    pintarError(
      document.getElementById('explorador-tarjetas'),
      MENSAJES.general,
      function () { iniciarExplorador(); }
    );
    return;
  }

  marcarVista(UI.entidades[0].clave);
  cargarEntidad(UI.entidades[0].clave);
}

function iniciarDetalle() {
  const dialogo = document.getElementById('detalle');
  if (!dialogo) { return; }
  dialogo.addEventListener('click', function (evento) {
    if (evento.target === dialogo) { dialogo.close(); }
  });
}

function iniciarMenu() {
  const nav = document.querySelector('.site-nav');
  const boton = document.querySelector('.nav__toggle');
  const enlaces = Array.prototype.slice.call(document.querySelectorAll('.nav__list a[href^="#"]'));

  function fijar(abierto) {
    nav.setAttribute('data-open', abierto ? 'true' : 'false');
    boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  }

  boton.addEventListener('click', function () {
    fijar(nav.getAttribute('data-open') !== 'true');
  });

  enlaces.forEach(function (enlace) {
    enlace.addEventListener('click', function () { fijar(false); });
  });

  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && nav.getAttribute('data-open') === 'true') {
      fijar(false);
      boton.focus();
    }
  });

  const secciones = enlaces
    .map(function (enlace) { return document.getElementById(enlace.getAttribute('href').slice(1)); })
    .filter(Boolean);

  let pendiente = false;

  function marcarActivo() {
    const linea = window.scrollY + 140;
    let actual = secciones[0];
    for (let i = 0; i < secciones.length; i++) {
      if (secciones[i].offsetTop <= linea) { actual = secciones[i]; }
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      actual = secciones[secciones.length - 1];
    }
    enlaces.forEach(function (enlace) {
      const activo = enlace.getAttribute('href') === '#' + actual.id;
      enlace.classList.toggle('is-active', activo);
      if (activo) { enlace.setAttribute('aria-current', 'true'); }
      else { enlace.removeAttribute('aria-current'); }
    });
    pendiente = false;
  }

  function alDesplazar() {
    if (pendiente) { return; }
    pendiente = true;
    window.requestAnimationFrame(marcarActivo);
  }

  window.addEventListener('scroll', alDesplazar, { passive: true });
  window.addEventListener('resize', alDesplazar);
  marcarActivo();
}

function iniciarResumen() {
  const destinos = [
    { id: 'cifras', pintar: pintarCifras },
    { id: 'mis-proyectos-panel', pintar: pintarMisProyectos }
  ];

  function cargar() {
    UI.servicio.obtenerResumen().then(function (resumen) {
      destinos.forEach(function (destino) {
        const clave = destino.id === 'cifras' ? 'cifras' : 'misProyectos';
        destino.pintar(resumen[clave]);
        document.getElementById(destino.id).setAttribute('aria-busy', 'false');
      });
    }).catch(function (error) {
      detalleTecnico(error);
      destinos.forEach(function (destino) {
        document.getElementById(destino.id).setAttribute('aria-busy', 'false');
      });
      pintarError(document.getElementById('cifras'), MENSAJES.general, cargar);
      pintarError(document.getElementById('mis-proyectos-panel'), MENSAJES.general, cargar);
    });
  }

  cargar();
}

function iniciarOnboarding() {
  const panel = document.getElementById('onboarding');
  const boton = document.getElementById('onboarding-cerrar');
  if (!panel || !boton) { return; }

  let visto = null;
  try {
    visto = window.localStorage.getItem(LLAVE_BIENVENIDA);
  } catch (error) {
    visto = null;
  }
  if (visto === '1') { return; }

  panel.hidden = false;

  boton.addEventListener('click', function () {
    panel.hidden = true;
    try {
      window.localStorage.setItem(LLAVE_BIENVENIDA, '1');
    } catch (error) {
      return;
    }
  });
}

function iniciar() {
  if (!UI.servicio) {
    pintarError(document.getElementById('cifras'), 'No se encontró notionService.js.');
    return;
  }
  document.querySelector('[data-anio]').textContent = new Date().getFullYear();
  UI.marcas = typeof UI.servicio.marcas === 'function' ? UI.servicio.marcas() : {};
  iniciarTema();
  iniciarOnboarding();
  iniciarMenu();
  iniciarDetalle();
  iniciarExplorador();
  iniciarCalendario();
  iniciarResumen();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciar);
} else {
  iniciar();
}
