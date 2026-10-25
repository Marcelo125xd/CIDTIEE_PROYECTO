# Portal público del CIDTIEE

Portal institucional del **Centro de Investigación, Desarrollo y Transferencia de Ingeniería en Energía Eléctrica (CIDTIEE)**, UTN Facultad Regional Córdoba.

El sitio presenta la actividad del centro —investigación, transferencia, servicios, formación, seminarios, becas, agenda y medios— a partir del contenido ordenado del export de Notion y de la estructura definida en `contexto_cidtiee/Copia de Orden archivos.pdf`. Incluye además un **Archivo** propio del portal que ordena la producción y los materiales públicos en una jerarquía de secciones y subsecciones que Notion no tiene.

> **Estado actual:** portal público de solo lectura. No hay usuarios, login, sesiones, roles ni base de datos. La integración con la API de Notion está preparada; el portal usa por defecto el contenido curado local y la activación requiere configurar el token y compartir las bases con la integración. Ver [Conexión con Notion](docs/NOTION.md).

## Stack

- **Frontend:** React 19, TypeScript, Vite, React Router.
- **Backend:** Node.js 22+, TypeScript, Express.
- **Contenido:** JSON validado con Zod.
- **Monorepo:** npm workspaces.

## Estructura

```text
.
├── frontend/              Aplicación React (portal público)
├── backend/               API REST de solo lectura + servidor de estáticos
├── packages/shared/       Esquemas Zod, tipos y utilidades compartidas
├── data/
│   ├── editorial/         Fuente editorial curada (content.mjs, archive.mjs)
│   ├── curated/           content.json generado y validado
│   ├── archivo/           Archivos públicos locales servidos en /documentos/archivo
│   ├── generated/         Extracto sanitizado del ETL (ignorado por git)
│   └── reports/           Reportes de ETL, contenido y archivo
├── scripts/               ETL, build de contenido y smoke test
├── docs/                  Arquitectura, pipeline y conexión con Notion
├── legacy-frontend/       Sitio Vanilla original, conservado como referencia
└── contexto_cidtiee/      Export crudo de Notion (ignorado por git)
```

## Requisitos

- Node.js 22 o superior.
- npm 10 o superior.

## Puesta en marcha

```bash
# 1. Instalar dependencias de todos los workspaces
npm install

# 2. Generar el contenido validado y el extracto del export
npm run content
npm run etl

# 3. Desarrollo: API en :3001 y Vite en :5173
npm run dev
```

Abrir <http://localhost:5173>. Vite redirige `/api` al backend.

### Build de producción

```bash
npm run build
npm start
```

El backend sirve la API y, si existe `frontend/dist`, también la aplicación compilada en <http://localhost:3001>. El build de contenido debe ejecutarse antes del build de la aplicación:

```bash
npm run content
npm run build
npm start
```

## Scripts

| Script | Descripción |
| --- | --- |
| `npm run dev` | Compila `shared` y levanta API + Vite en paralelo. |
| `npm run build` | Compila `shared`, backend y frontend. |
| `npm start` | Inicia el backend compilado. |
| `npm run content` | Valida `content.mjs` y `archive.mjs`, y genera `data/curated/content.json` y los reportes. |
| `npm run etl` | Inventaría y sanea el export de Notion; genera `data/generated/extracted.json` y el reporte. |
| `npm run smoke` | Prueba de humo de la API, el Archivo, la búsqueda, los 404, la SPA y las cabeceras. |
| `npm run validate` | ETL + contenido + build + smoke test. |

## Contenido

La fuente pública es **`data/editorial/content.mjs`**. Allí se editan textos, proyectos, publicaciones, seminarios, becas, personas, novedades, recursos y eventos. Luego:

```bash
npm run content
```

El script valida con Zod, escribe `data/curated/content.json` y deja advertencias en `data/reports/content-report.json`. El backend lee ese JSON mediante `LocalJsonProvider`.

El **Archivo** se define en **`data/editorial/archive.mjs`**: secciones, subsecciones, reglas de clasificación, overrides y catálogo de congresos, llamados, becas y enlaces. El mismo build deriva las fichas de publicaciones, seminarios, proyectos y becas, las clasifica y genera `data/reports/archive-report.json`. Los archivos públicos se guardan en `data/archivo/` y se sirven como `/documentos/archivo/...`.

El ETL de Notion **no publica el export**: clasifica páginas, descarta filas basura, excluye contenido operativo o con datos personales y redacta datos sensibles. El extracto resultante es material de revisión editorial; el sitio solo consume el contenido curado.

Ver [Pipeline de contenido](docs/PIPELINE-CONTENIDO.md) para el detalle.

## Rutas del sitio

| Ruta | Sección |
| --- | --- |
| `/` | Inicio |
| `/institucional` | Historia, misión, autoridades e integrantes |
| `/observatorio` | Líneas de investigación, proyectos y publicaciones |
| `/observatorio/proyectos` | Listado de proyectos con filtros |
| `/observatorio/proyectos/:slug` | Detalle de proyecto |
| `/observatorio/publicaciones` | Publicaciones con filtros |
| `/archivo` | Portada del Archivo |
| `/archivo/:section` | Sección del Archivo |
| `/archivo/:section/:subsection` | Listado filtrable de la subsección |
| `/archivo/:section/:subsection/:slug` | Ficha de archivo con documentos y enlaces |
| `/transferencia` | Casos y producción tecnológica |
| `/servicios` | Servicios técnicos |
| `/formacion` | Formación de recursos humanos |
| `/seminarios` | Ciclo de seminarios técnicos |
| `/becas` | Becas y convocatorias |
| `/calendario` | Agenda de actividades |
| `/medios` | Novedades, recursos y redes |
| `/buscar` | Buscador global |

Redirecciones compatibles: `/publicaciones`, `/proyectos`, `/capacitaciones`, `/agenda`, `/inicio`.

## API

Todos los endpoints son `GET` y de solo lectura:

```text
/api/health
/api/meta
/api/content
/api/home
/api/projects?q=&status=&type=&area=&year=&page=&pageSize=&sort=
/api/projects/:slug
/api/publications?q=&type=&year=&area=&page=&pageSize=&sort=
/api/seminars?q=&year=&status=&page=&pageSize=&sort=
/api/becas?q=&status=&kind=&year=
/api/people
/api/news
/api/resources
/api/calendar
/api/archive
/api/archive/items?q=&section=&subsection=&kind=&year=&featured=&page=&pageSize=&sort=
/api/archive/items/:slug
/api/search?q=&type=&page=&pageSize=
```

Las respuestas de listado usan `{ items, total, page, pageSize, totalPages }`.

## Privacidad y seguridad

- El export crudo (`contexto_cidtiee/`) está ignorado por git y **no se sirve**.
- El contenido público se cura manualmente; no se publican CUIT/CBU, credenciales, datos financieros ni datos personales de estudiantes.
- El ETL excluye páginas operativas, de reuniones, tareas, finanzas y estudiantes, y redacta datos sensibles en el material de revisión.
- El Archivo no incorpora reuniones, tareas, finanzas, credenciales ni datos de estudiantes; los registros dudosos quedan en un reporte de revisión y no se publican.
- Los archivos locales del Archivo se sirven solo desde `data/archivo/`; no se expone el export ni el resto del sistema de archivos.
- La API no tiene escritura, autenticación ni base de datos.
- El token de Notion, cuando se configure, vive solo en `backend/.env`; nunca se expone al navegador.
- El backend aplica cabeceras de seguridad, CORS restringido y CSP.

## Diseño

Se conserva la identidad visual del sitio original: paleta monocromática, tipografía serif institucional, grillas de líneas finas, modo claro/oscuro y foco en el contenido. El sitio Vanilla original queda en `legacy-frontend/` como referencia y no forma parte del build.

## Documentación

- [Arquitectura](docs/ARQUITECTURA.md)
- [Pipeline de contenido](docs/PIPELINE-CONTENIDO.md)
- [Archivo](docs/ARCHIVO.md)
- [Conexión con Notion](docs/NOTION.md)
- [Variables de entorno](docs/VARIABLES-ENTORNO.md)

## Licencia

[MIT](LICENSE)
