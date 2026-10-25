# Pipeline de contenido

## Fuentes

1. **Estructura objetivo:** `contexto_cidtiee/Copia de Orden archivos.pdf`.
2. **Contenido actual:** export de Notion en `contexto_cidtiee/` (CSV y Markdown).
3. **Sitio público anterior:** textos institucionales, historia, integrantes, servicios y producción.
4. **Curación editorial:** `data/editorial/content.mjs`, escrita y revisada por el equipo.
5. **Archivo:** `data/editorial/archive.mjs`, con la jerarquía propia del portal, reglas de clasificación y catálogo de enlaces.

El export de Notion no se publica directamente. Se usa para relevar, contrastar y ordenar la información; la fuente pública es el archivo editorial curado.

## Etapas

```text
contexto_cidtiee/ (export crudo, ignorado por git)
        │
        ▼
scripts/etl.mjs
        ├── inventario de archivos
        ├── parseo de CSV
        ├── clasificación de Markdown
        ├── descarte de filas basura
        ├── exclusión de páginas internas
        └── redacción de datos sensibles
        │
        ├── data/generated/extracted.json   (material de revisión, ignorado)
        └── data/reports/etl-report.json    (conteos y advertencias)

data/editorial/content.mjs
data/editorial/archive.mjs
        │
        ▼
scripts/build-content.mjs
        ├── validación con Zod (@cidtiee/shared)
        ├── derivación de fichas del Archivo
        ├── clasificación del catálogo
        ├── conteos y distribuciones
        └── advertencias editoriales
        │
        ├── data/curated/content.json       (fuente del backend)
        ├── data/reports/content-report.json
        └── data/reports/archive-report.json
```

## ETL

`npm run etl` recorre el export y genera un extracto saneado:

- **CSV:** detecta filas basura (`Card 2`, `Tarjeta 1`, `Sin título`, vacías) y las descarta. Los CSV de estudiantes, finanzas, tareas y reuniones se inventarían pero no se incluyen en el extracto.
- **Markdown:** clasifica páginas en `entity`, `narrative` o `internal`.
- **Páginas internas:** se excluyen por nombre o por contenido cuando detecta tareas, reuniones, finanzas, CBU/CUIT, credenciales, legajos o datos de estudiantes.
- **Datos sensibles:** CUIT, CBU, credenciales y correos personales se redactan. Los correos institucionales (`cidtiee@gmail.com`, `@frc.utn.edu.ar`) se conservan.
- **Reporte:** incluye inventario, conteos, categorías de CSV, hallazgos sensibles y advertencias.

> El extracto es material de revisión. No se sirve desde la API ni se publica en el sitio.

## Build de contenido

`npm run content` compila `@cidtiee/shared` y ejecuta `scripts/build-content.mjs`:

1. Importa `data/editorial/content.mjs` y `data/editorial/archive.mjs`.
2. Valida el objeto completo con `ContentSchema`.
3. Falla con un mensaje claro si hay campos inválidos.
4. Genera `data/curated/content.json`.
5. Genera `data/reports/content-report.json` con conteos, distribuciones y advertencias no bloqueantes.
6. Genera `data/reports/archive-report.json` con el detalle del Archivo.

### Archivo

El build del Archivo:

1. Ordena secciones y subsecciones por `order`.
2. Deriva una ficha por cada publicación, seminario, proyecto y beca.
3. Clasifica las entradas de `archiveCatalog` con overrides y reglas.
4. Ordena los registros por sección, subsección, año, fecha y título.
5. Detecta ids y slugs duplicados, y subsecciones vacías.
6. Valida el resultado con `ArchiveSchema` y lo incluye en `ContentSchema.archive`.

El reporte `archive-report.json` incluye conteos, subsecciones vacías, overrides usados, registros sin clasificar y candidatos a revisión manual. Los registros sin clasificar no se publican.

Para el detalle de la estructura, las reglas y el manejo de archivos, ver [ARCHIVO.md](ARCHIVO.md).

### Advertencias habituales

- Publicaciones sin DOI ni URL.
- Seminarios realizados sin fecha exacta.
- Entidades sin algún campo opcional.

Las advertencias no impiden publicar, pero ayudan a completar el contenido.

## Cómo editar contenido

1. Abrir `data/editorial/content.mjs`.
2. Editar la colección correspondiente (`projects`, `publications`, `seminars`, `becas`, `people`, `news`, `resources`, `calendar`, `services`, `cases`, `production`).
3. Respetar los campos requeridos por el esquema Zod.
4. Ejecutar `npm run content`.
5. Revisar `data/reports/content-report.json`.
6. Probar con `npm run dev` o `npm run build && npm run smoke`.

Para el Archivo:

1. Editar `data/editorial/archive.mjs` (secciones, catálogo, reglas u overrides).
2. Copiar los archivos públicos a `data/archivo/<sección>/<subsección>/<slug>/`.
3. Ejecutar `npm run content`.
4. Revisar `data/reports/archive-report.json`, en especial `review.unclassified` y `emptySubsections`.
5. Probar la ficha, la vista previa y la descarga.

### Reglas editoriales

- Español es-AR, tono institucional y sobrio.
- No publicar datos personales de estudiantes, CUIT/CBU, credenciales, montos, facturas ni información de reuniones internas.
- No inventar fechas, DOI, códigos de proyecto ni resultados.
- Si un dato no está confirmado, dejarlo como opcional o fuera del contenido público.
- En el Archivo, no publicar borradores, listas sin fechas confirmadas ni enlaces a carpetas privadas.

## Orden del sitio

La estructura sigue el PDF de referencia:

1. **Institucional:** historia, misión, visión, objetivos, valores, autoridades, integrantes y contacto.
2. **Observatorio:** líneas de investigación, proyectos y publicaciones.
3. **Archivo:** publicaciones, seminarios, proyectos, internacionalización, congresos y documentos en una jerarquía propia.
4. **Transferencia:** casos, producción tecnológica y proceso de trabajo.
5. **Servicios:** capacidades técnicas y modalidades.
6. **Formación:** trayectorias, seminarios y becas.
7. **Calendario:** agenda de actividades.
8. **Medios:** novedades, recursos y redes.
9. **Buscador:** acceso transversal a todo el contenido.

## Privacidad

- `contexto_cidtiee/` está en `.gitignore`.
- `data/generated/` está en `.gitignore`.
- El backend solo lee `data/curated/content.json` y sirve archivos desde `data/archivo/`.
- El frontend nunca recibe el export ni el token de Notion.
- El Archivo excluye reuniones, tareas, finanzas, credenciales y datos de estudiantes; los registros dudosos quedan en el reporte de revisión.
