# Arquitectura

## Visión general

El portal es una aplicación **read-only** compuesta por tres piezas:

1. **Frontend React** (`frontend/`): renderiza el sitio público y consume la API.
2. **Backend Express** (`backend/`): expone endpoints de solo lectura y sirve el build del frontend.
3. **Contenido curado** (`data/curated/content.json`): fuente de verdad del sitio, generada desde `data/editorial/content.mjs` y `data/editorial/archive.mjs`, y validada con Zod.
4. **Archivos públicos** (`data/archivo/`): documentos locales del Archivo, servidos como estáticos en `/documentos/archivo/...`.

No hay base de datos, autenticación, sesiones, roles ni operaciones de escritura. La integración con Notion es una fuente de contenido opcional, no una capa de usuarios.

## Flujo de una petición

```text
Navegador
   │
   ├── GET /                     → frontend/dist/index.html (SPA)
   ├── GET /archivo/...          → fallback SPA
   ├── GET /documentos/archivo/… → archivo local (PDF, imagen, etc.)
   └── GET /api/content          → Express → ContentProvider → content.json
```

En desarrollo, Vite (`:5173`) sirve el frontend y redirige `/api` y `/documentos` al backend (`:3001`). En producción, Express sirve ambos desde el mismo origen.

## Backend

### Capa de proveedores

`backend/src/providers/types.ts` define la interfaz `ContentProvider`. Hay dos implementaciones:

- **`LocalJsonProvider`** (activa): lee `data/curated/content.json`, aplica filtros, orden, paginación, búsqueda y arma la home. También expone el Archivo y sus fichas.
- **`NotionProvider`** (preparada): parte del contenido local como base, consulta los data sources configurados, mapea páginas y reemplaza las colecciones. Si una base falla o no está configurada, conserva el contenido local y registra una advertencia.

La fábrica `createContentProvider` elige el proveedor según `CONTENT_PROVIDER`.

### Archivo

El Archivo se construye en el build de contenido, no en tiempo de petición:

- `data/editorial/archive.mjs` define secciones, subsecciones, reglas, overrides y catálogo.
- `scripts/build-content.mjs` deriva fichas de publicaciones, seminarios, proyectos y becas, clasifica el catálogo y valida todo con `ArchiveSchema`.
- El resultado se guarda dentro de `ContentSchema.archive` en `data/curated/content.json`.

El proveedor local implementa `getArchive`, `listArchiveItems` y `getArchiveItem`. Los listados filtran por sección, subsección, tipo, año, destacados y texto, y ordenan por fecha, año o título.

### Endpoints

Los endpoints están en `backend/src/routes/index.ts` y usan `asyncHandler` para propagar errores. Los parámetros se validan y normalizan en `backend/src/lib/query.ts`.

- Listados paginados: proyectos, publicaciones y seminarios.
- Listados completos: becas, personas, novedades, recursos y calendario.
- Detalle de proyecto por slug.
- Archivo: portada, listado filtrable y detalle por slug.
- Búsqueda global con puntuación y filtro por tipo (incluye `archivo`).
- `health` y `meta` para diagnóstico.

El buscador global suma solo los registros del catálogo del Archivo (`origin !== "portal"`). Los registros derivados ya están representados por su colección de origen y no se duplican.

### Seguridad

`backend/src/app.ts` aplica:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy` restrictiva
- CSP con `default-src 'self'` y `frame-src 'self'` / `object-src 'self'`
- CORS limitado a los orígenes configurados
- Compresión y límite de body
- Manejo uniforme de errores 404/500

### Archivos locales

`/documentos/archivo` sirve únicamente el contenido de `data/archivo/` con `index: false` y `dotfiles: "deny"`. Un documento inexistente devuelve un 404 JSON, no el HTML de la SPA.

Los PDF e imágenes del Archivo se sirven con `X-Frame-Options: SAMEORIGIN` y `Content-Security-Policy: frame-ancestors 'self'` para permitir la vista previa dentro del portal. El resto de las respuestas mantiene `frame-ancestors 'none'`. Solo se permiten PDF, imágenes y documentos de oficina; HTML, SVG y scripts se rechazan.

El token de Notion nunca se envía al cliente.

## Frontend

### Carga global del contenido

`ContentProvider` (`frontend/src/content-context.tsx`) hace un único `GET /api/content` al iniciar. Mientras carga muestra un estado de carga; si falla, muestra un error con reintento. Las páginas usan `useRequiredContent()` porque solo se renderizan cuando el contenido está disponible.

### Ruteo

`frontend/src/App.tsx` define las rutas con React Router. Las rutas canónicas siguen la estructura del PDF:

- Institucional
- Observatorio → proyectos y publicaciones
- Archivo → secciones, subsecciones y fichas
- Transferencia
- Servicios
- Formación → seminarios y becas
- Calendario
- Medios
- Buscador

El Archivo usa rutas propias (`/archivo/:section/:subsection/:slug`) para no colisionar con los listados existentes. Se mantienen redirecciones para enlaces antiguos.

### Componentes

- `Layout`: header, navegación responsive, tema claro/oscuro y footer.
- `PageHeader`, `Section`, `ContactBand`: estructura institucional.
- `Cards`: tarjetas y listados de todas las entidades.
- `Archive`: tarjetas de sección, fichas, barra lateral y previsualización de archivos.
- `Calendar`: calendario mensual con agenda lateral.
- `FilterBar`, `Pagination`, `States`: patrones de listados.
- `Badge`: estados normalizados de proyectos, publicaciones, seminarios y becas.

### Estilos

`frontend/src/styles.css` porta y amplía el sistema visual del sitio original:

- Variables CSS para paleta, tipografía, bordes y foco.
- Tema oscuro con `[data-theme="dark"]`.
- Grillas de líneas finas y tarjetas sin radios.
- Tipografía serif para títulos y sans-serif para texto.
- Breakpoints en 1040, 900, 760 y 560 px.
- Estilos de impresión y `prefers-reduced-motion`.

## Paquete compartido

`packages/shared` contiene:

- Esquemas Zod de todas las entidades.
- Tipos inferidos.
- Etiquetas de estados y tipos para la interfaz.
- Esquemas y etiquetas del Archivo (`ArchiveSchema`, `ArchiveItemSchema`, `ArchiveAssetSchema`).
- Utilidades de normalización, búsqueda y paginación.
- Tipos de consulta y respuesta (`ArchiveQuery`, `SearchType` con `archivo`).

El backend y el frontend comparten estos contratos, lo que evita divergencias entre la API y la UI.

## Decisiones de alcance

- **Solo lectura:** no se implementan usuarios, login, sesiones, roles ni base de datos.
- **Sin “Mis proyectos”:** esa vista requería autenticación; se reemplazó por proyectos y tareas públicas.
- **Contenido curado:** el export de Notion es la materia prima, pero la publicación pasa por una curación editorial explícita.
- **Sin datos sensibles:** el export crudo y el material de revisión no se publican.
- **Archivo propio:** la jerarquía de secciones y subsecciones vive en el portal, no en Notion. Notion solo aporta títulos, enlaces y archivos.
- **Identidad visual conservada:** se mantiene el diseño monocromático y sobrio del sitio original.
- **Sitio Vanilla preservado:** `legacy-frontend/` queda como referencia histórica y no participa del build.

## Despliegue

1. `npm ci`
2. `npm run content`
3. `npm run build`
4. `npm start`

Variables mínimas: `PORT`, `CONTENT_PROVIDER=local-json`. Para Notion, ver [NOTION.md](NOTION.md).

Los archivos públicos del Archivo deben existir en `data/archivo/` en el servidor. Si se despliega en un contenedor o servicio efímero, ese directorio debe montarse como volumen persistente o incluirse en la imagen.

El backend puede desplegarse en cualquier servicio que ejecute Node 22+ y permita servir estáticos. Si el frontend se despliega por separado, definir `VITE_API_URL` en el build y ajustar `CORS_ORIGIN`.
