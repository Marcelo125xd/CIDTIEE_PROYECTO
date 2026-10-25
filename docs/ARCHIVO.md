# Archivo

El Archivo es una capa editorial del portal que reúne, ordena y describe material público del CIDTIEE. No modifica Notion ni publica el export crudo: toma las colecciones curadas del portal y un catálogo acotado de congresos, llamados, becas y enlaces, y los presenta con una estructura jerárquica propia.

La estructura de Notion es plana: las páginas tienen títulos y archivos, pero no una jerarquía de subpáginas. El portal agrega esa jerarquía en `data/editorial/archive.mjs` sin tocar el espacio de trabajo original.

## Alcance

- **Solo lectura.** No hay carga de archivos desde el navegador, usuarios, sesiones ni base de datos.
- **Capa adicional.** Las secciones existentes del portal se mantienen; el Archivo agrega una vista histórica y documental.
- **Contenido público.** No se publican reuniones, tareas internas, finanzas, CUIT/CBU, credenciales, datos de estudiantes ni enlaces a carpetas privadas.
- **Fichas descriptivas.** Cada registro explica qué es, cuándo se realizó o publicó y dónde consultarlo. Cuando existe un archivo o enlace, se muestra dentro de la ficha.
- **Estructura estable.** Las subsecciones vacías se conservan y muestran un estado vacío; se completan a medida que se incorpora material.

## Estructura

| Sección | Slug | Subsecciones |
| --- | --- | --- |
| Publicaciones | `publicaciones` | Revistas (`revistas`), Congresos (`congresos`), Capítulos y preprints (`otras`) |
| Seminarios | `seminarios` | Próximos (`proximos`), Anteriores (`anteriores`) |
| Proyectos-PID | `proyectos-pid` | Vigentes (`vigentes`), En evaluación (`en-evaluacion`), Terminados (`terminados`), Rechazados (`rechazados`) |
| Internacionalización | `internacionalizacion` | Becas (`becas`), Convocatorias (`convocatorias`) |
| Congresos y llamados | `congresos` | Congresos (`congresos`), Llamados (`llamados`) |
| Documentos y enlaces | `documentos` | Institucionales (`institucionales`), Repositorios (`repositorios`), Fuentes y observatorios (`fuentes`), Difusión (`difusion`) |

Las secciones y subsecciones se definen en `archiveSections` y se ordenan con el campo `order`. Cada una tiene título, descripción y, en las secciones, un `intro` de párrafos.

## Origen de los registros

El Archivo combina dos fuentes:

### 1. Registros derivados del portal

Se generan automáticamente desde las colecciones de `data/editorial/content.mjs`:

| Colección | Sección | Subsección |
| --- | --- | --- |
| `publications` | Publicaciones | Según `type`: `revista` y `revista-nacional` → `revistas`; `congreso` → `congresos`; `capitulo` y `preprint` → `otras` |
| `seminars` | Seminarios | `realizado` → `anteriores`; `proximo` y `en-organizacion` → `proximos` |
| `projects` | Proyectos-PID | `en-curso` → `vigentes`; `en-preparacion` y `en-evaluacion` → `en-evaluacion`; `finalizado` → `terminados` |
| `becas` | Internacionalización o Congresos y llamados | `kind: "beca"` → `internacionalizacion/becas`; `kind: "convocatoria"` → `congresos/llamados` |

Estos registros usan `origin: "portal"` y un `href` al detalle o listado correspondiente. No se duplican en el buscador global: la colección de origen ya los representa.

### 2. Catálogo editorial

`archiveCatalog` contiene registros que no provienen de las colecciones estructuradas: congresos, llamados, becas externas, repositorios, fuentes y enlaces institucionales. Cada entrada define su contenido y sus archivos o enlaces.

Los registros del catálogo usan `origin: "notion"`, `"externo"` o `"curado"` según su procedencia. Solo estos se suman al buscador global con el tipo `archivo`, para evitar duplicados.

## Clasificación

Los registros derivados se clasifican por reglas explícitas de tipo y estado. Los registros del catálogo se clasifican en este orden:

1. **Override explícito** (`archiveCatalogOverrides`): tiene prioridad absoluta. Se usa cuando una regla general daría un resultado incorrecto.
2. **Primera regla coincidente** (`archiveClassificationRules`): las reglas se evalúan en orden y la primera que coincide define sección y subsección.

Las reglas usan expresiones regulares sin distinción de mayúsculas y se aplican sobre un texto acotado: título, resumen, tipo, estado, referencia de origen y etiquetas. No se usan párrafos completos ni datos auxiliares, para evitar falsos positivos.

| Regla | Coincide con | Destino |
| --- | --- | --- |
| `beca-internacional` | beca, scholarship, DAAD, Carolina, ELAP | Internacionalización / Becas |
| `convocatoria-llamado` | convocatoria, llamado, premio, concurso | Congresos y llamados / Llamados |
| `congreso-evento` | congreso, simposio, jornada, conferencia, CFP | Congresos y llamados / Congresos |
| `repositorio-academico` | repositorio, ResearchGate, Zenodo | Documentos / Repositorios |
| `canal-difusion` | Instagram, LinkedIn, red social | Documentos / Difusión |
| `fuente-observatorio` | observatorio, informe, reporte, tarifa | Documentos / Fuentes y observatorios |
| `referencia-institucional` | sitio, página, portal, departamento, facultad, UTN, biblioteca | Documentos / Institucionales |

### Overrides actuales

Las tres becas externas del catálogo se archivan como convocatorias de organismos internacionales, no como becas gestionadas por el centro:

- `int-becas-carolina`
- `int-becas-daad`
- `int-becas-canada`

## Reporte de revisión

`npm run content` genera `data/reports/archive-report.json` con:

- Conteos por sección, subsección, tipo, origen y método de clasificación.
- Subsecciones vacías.
- Registros del catálogo que ninguna regla pudo clasificar (`review.unclassified`).
- Candidatos a revisión manual (`archiveReviewCandidates`), con motivo y sección sugerida.
- Advertencias de validación (secciones o subsecciones inexistentes, ids o slugs duplicados).

Los registros sin clasificar **no se publican**. Se listan en el reporte para que una persona decida su destino. Los candidatos a revisión tampoco se publican automáticamente: agrupan material ambiguo, borradores o listas sin fechas confirmadas.

## Archivos y enlaces

Cada registro puede tener una lista de `assets`. Un asset tiene:

| Campo | Descripción |
| --- | --- |
| `label` | Texto visible del enlace o archivo. |
| `kind` | `pdf`, `imagen`, `documento`, `planilla`, `presentacion`, `enlace`, `video` u `otro`. |
| `url` | Ruta interna (empieza con `/`) o URL `http(s)` externa. |
| `source` | `local`, `externo`, `portal` o `notion`. |
| `description` | Aclaración opcional sobre el contenido. |
| `format` / `size` | Formato y tamaño declarados, opcionales. |
| `preview` | `ninguna`, `pdf` o `imagen`. |
| `download` | Indica que el enlace se ofrece como descarga. |

### Enlaces externos

Se abren en una pestaña nueva y se revisan antes de publicarse. Las URL de archivos alojados en Notion expiran, por lo que no se usan como enlace estable: el archivo se descarga y se guarda localmente.

### Enlaces internos al portal

Los `href` de los registros derivados apuntan a las páginas públicas existentes (detalle de proyecto, listados con búsqueda, becas). Se muestran como “Ver en el portal”.

### Archivos locales

Los archivos públicos se guardan en `data/archivo/` y se sirven en `/documentos/archivo/...`. La ruta se arma con la misma jerarquía del Archivo:

```text
data/archivo/
├── publicaciones/
│   └── revistas/
│       └── <slug>/<archivo>.pdf
├── seminarios/
│   └── anteriores/
│       └── <slug>/<archivo>.pdf
└── documentos/
    └── institucionales/
        └── <slug>/<archivo>.pdf
```

Recomendaciones:

- Usar nombres en minúsculas, sin espacios ni acentos.
- Un directorio por registro, con el slug como nombre.
- Conservar el nombre original solo si es legible y estable.
- No subir archivos con datos personales, montos, credenciales ni material interno.

En la ficha, un asset local se declara así:

```js
{
  key: "programa",
  label: "Programa de la edición",
  kind: "pdf",
  url: "/documentos/archivo/seminarios/anteriores/<slug>/programa.pdf",
  source: "local",
  format: "PDF",
  preview: "pdf",
  download: true,
}
```

Los PDF e imágenes locales se previsualizan dentro de la ficha. El backend sirve estos archivos con `X-Frame-Options: SAMEORIGIN` y `Content-Security-Policy: frame-ancestors 'self'` para permitir la vista previa en el mismo origen. El resto del sitio mantiene `frame-ancestors 'none'`.

El servidor solo publica PDF, imágenes y documentos de oficina (DOC/DOCX, XLS/XLSX, PPT/PPTX, TXT, CSV). Rechaza HTML, SVG y scripts para no servir contenido ejecutable desde el mismo origen.

### Archivos alojados en Notion

Cuando se incorpore la integración, el flujo previsto es:

1. Detectar el archivo adjunto en la página pública.
2. Descargarlo con el token del servidor.
3. Guardarlo en `data/archivo/...` con un nombre estable.
4. Registrar el asset con `source: "local"` y la ruta interna.
5. Verificar que la vista previa y la descarga funcionen sin el token.

El token nunca se envía al navegador ni se usa para servir archivos.

## Cómo agregar o editar registros

### Registros derivados

1. Editar la colección correspondiente en `data/editorial/content.mjs`.
2. Ejecutar `npm run content`.
3. Revisar `data/reports/archive-report.json` y `data/reports/content-report.json`.

No se editan a mano en el JSON generado: el próximo build los reemplaza.

### Registros del catálogo

1. Agregar una entrada en `archiveCatalog` de `data/editorial/archive.mjs`.
2. Definir `key`, `title`, `summary`, `kind`, `year`, `tags`, `body`, `facts` y `assets`.
3. Si las reglas no clasifican bien el registro, agregar un override en `archiveCatalogOverrides`.
4. Ejecutar `npm run content`.
5. Verificar que el registro aparezca en la subsección esperada y que no haya quedado en `review.unclassified`.

### Archivos locales

1. Copiar el archivo a `data/archivo/<sección>/<subsección>/<slug>/`.
2. Declarar el asset con `url: "/documentos/archivo/..."`, `source: "local"` y `preview` si corresponde.
3. Ejecutar `npm run content`, `npm run build` y `npm run smoke`.
4. Abrir la ficha y comprobar la vista previa y la descarga.

## Rutas del portal

| Ruta | Vista |
| --- | --- |
| `/archivo` | Portada: resumen, secciones y registros destacados |
| `/archivo/:section` | Sección con sus subsecciones y últimos registros |
| `/archivo/:section/:subsection` | Listado filtrable y paginado |
| `/archivo/:section/:subsection/:slug` | Ficha completa con cuerpo, datos y archivos |

El buscador global acepta `type=archivo` y enlaza a la ficha correspondiente.

## API

```text
GET /api/archive
GET /api/archive/items?q=&section=&subsection=&kind=&year=&featured=&page=&pageSize=&sort=
GET /api/archive/items/:slug
```

`sort` acepta `recent` (por defecto), `oldest` y `title`. Los listados devuelven `{ items, total, page, pageSize, totalPages }`.

## Privacidad

No se incorporan al Archivo:

- Reuniones, tareas, recordatorios ni notas internas.
- Proyectos-Tareas, Plan maestro, SCyT, Recursos del centro, Administración, Memorias, Estudiantes, Investigadores, RRHH, Ideas, Inversiones y Base de datos de seminarios.
- CUIT, CBU, montos, facturas, credenciales, licencias ni datos personales de estudiantes.
- Enlaces a carpetas privadas de Notion o a archivos con permisos restringidos.

El export crudo (`contexto_cidtiee/`) está ignorado por git y no se sirve. La única fuente pública es `data/curated/content.json`, que incluye el Archivo ya validado.

## Limitaciones actuales

- No hay archivos locales cargados todavía: `data/archivo/` solo contiene `.gitkeep`. Las fichas actuales son descriptivas y enlazan a fuentes externas.
- La integración con Notion no está activa porque falta `NOTION_TOKEN` en `backend/.env` y las bases públicas no están compartidas con la conexión.
- Las secciones `proyectos-pid/en-evaluacion` y `proyectos-pid/rechazados` están vacías y se muestran como tales.
- Los enlaces externos pueden cambiar de dirección; conviene revisarlos periódicamente.

## Próximos pasos

1. Configurar `NOTION_TOKEN` y compartir solo las ramas públicas con la integración.
2. Relevar los archivos adjuntos y descargar los que deban publicarse.
3. Incorporar los PDF e imágenes a `data/archivo/` y declarar sus assets.
4. Revisar los candidatos de `archive-report.json` y decidir cuáles pasan al catálogo.
5. Ejecutar `npm run validate` y revisar las páginas del Archivo en navegador.
