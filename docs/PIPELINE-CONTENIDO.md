# Pipeline de contenido

## Fuentes

1. **Estructura objetivo:** `contexto_cidtiee/Copia de Orden archivos.pdf`.
2. **Contenido actual:** export de Notion en `contexto_cidtiee/` (CSV y Markdown).
3. **Sitio público anterior:** textos institucionales, historia, integrantes, servicios y producción.
4. **Curación editorial:** `data/editorial/content.mjs`, escrita y revisada por el equipo.

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
        │
        ▼
scripts/build-content.mjs
        ├── validación con Zod (@cidtiee/shared)
        ├── conteos y distribuciones
        └── advertencias editoriales
        │
        ├── data/curated/content.json       (fuente del backend)
        └── data/reports/content-report.json
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

1. Importa `data/editorial/content.mjs`.
2. Valida el objeto completo con `ContentSchema`.
3. Falla con un mensaje claro si hay campos inválidos.
4. Genera `data/curated/content.json`.
5. Genera `data/reports/content-report.json` con conteos, distribuciones y advertencias no bloqueantes.

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

### Reglas editoriales

- Español es-AR, tono institucional y sobrio.
- No publicar datos personales de estudiantes, CUIT/CBU, credenciales, montos, facturas ni información de reuniones internas.
- No inventar fechas, DOI, códigos de proyecto ni resultados.
- Si un dato no está confirmado, dejarlo como opcional o fuera del contenido público.

## Orden del sitio

La estructura sigue el PDF de referencia:

1. **Institucional:** historia, misión, visión, objetivos, valores, autoridades, integrantes y contacto.
2. **Observatorio:** líneas de investigación, proyectos y publicaciones.
3. **Transferencia:** casos, producción tecnológica y proceso de trabajo.
4. **Servicios:** capacidades técnicas y modalidades.
5. **Formación:** trayectorias, seminarios y becas.
6. **Calendario:** agenda de actividades.
7. **Medios:** novedades, recursos y redes.
8. **Buscador:** acceso transversal a todo el contenido.

## Privacidad

- `contexto_cidtiee/` está en `.gitignore`.
- `data/generated/` está en `.gitignore`.
- El backend solo lee `data/curated/content.json`.
- El frontend nunca recibe el export ni el token de Notion.
