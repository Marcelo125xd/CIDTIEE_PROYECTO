# Conexión con Notion

La integración está preparada pero **desactivada por defecto**. El portal funciona con el contenido curado local. Para conectar Notion se necesitan dos cosas: el token de la integración y compartir cada base de datos con esa integración.

## 1. Crear la conexión interna y obtener el token

> **Requisito:** ser owner del workspace. Notion renombró las “integraciones” a “conexiones”: en la interfaz pueden aparecer como **Connections** o **Conexiones**.

1. Entrar a <https://www.notion.so/developers> con la cuenta del workspace del CIDTIEE.
2. En la barra lateral, ir a **Build → Internal connections** (o **Construir → Conexiones internas**).
3. Elegir **Create a new connection** / **Crear una conexión**.
4. Completar:
   - **Nombre:** `Portal CIDTIEE`.
   - **Workspace:** el workspace del CIDTIEE.
   - **Logo:** opcional.
5. Crear la conexión.
6. Abrir la pestaña **Configuration** / **Configuración**.
7. En **Capabilities** / **Capacidades**, dejar habilitado **solo Read content** / **Leer contenido**. El portal es de solo lectura: no habilitar *Update content* ni *Insert content*.
8. Copiar el **API token** / **Internal connection API token**. Empieza con `ntn_` (las conexiones más viejas usan `secret_`).
9. Guardarlo en un gestor de contraseñas. No pegarlo en el chat, en capturas, en issues ni en el repositorio.

> Si el token se filtró, usar **Refresh** en la misma pestaña para revocarlo y generar uno nuevo.

> **Alternativa:** en <https://www.notion.so/developers/tokens> se puede crear un **personal access token** con capacidad **Notion API**. Usa los permisos de tu usuario, así que no hace falta agregar la conexión a cada base. Para un portal institucional conviene una conexión interna, porque no depende de una persona.

## 2. Compartir las bases con la conexión

El token por sí solo no da acceso. Hay que compartir cada base con la conexión.

1. Abrir la base en Notion **como página completa**, no una vista vinculada.
2. En el menú `•••` de arriba a la derecha, elegir **Connections → + Add connection** (o **Más → Connections → Add connections**).
3. Buscar `Portal CIDTIEE` y seleccionarla.
4. Confirmar que la conexión puede acceder a la página y a sus páginas hijas.
5. Repetir con cada base que se quiera publicar.

> También se puede otorgar acceso desde la pestaña **Content access** / **Acceso al contenido** de la conexión, en el portal de desarrolladores.

Bases previstas:

| Clave en el portal | Base en Notion |
| --- | --- |
| `projects` | Proyectos |
| `publications` | Publicaciones |
| `seminars` | Seminarios |
| `becas` | Becas y convocatorias |
| `people` | Personas / recursos humanos |
| `news` | Novedades |
| `resources` | Recursos |

> Si alguna base no existe o todavía no se quiere publicar, no se comparte. El portal sigue usando el contenido local para esa colección.
>
> No compartir bases de estudiantes, finanzas, reuniones, tareas internas ni ninguna con CUIT/CBU o credenciales.

### Ramas públicas y Archivo

El espacio de Notion del centro es una página plana: las secciones tienen títulos, enlaces y archivos, pero no una jerarquía de subpáginas. El portal no modifica esa estructura. La jerarquía del **Archivo** se define en `data/editorial/archive.mjs` y se genera en el build local.

Ramas públicas previstas:

- Publicaciones
- Seminarios
- Proyectos-PID
- Internacionalización
- Calendario de Congresos

Compartir **solo** esas ramas con la conexión, no la página principal del centro. La página principal mezcla contenido público con material organizativo e interno.

No compartir, entre otras: Proyectos-Tareas, Reuniones, Datos para Facturas/Finanzas, SCyT, Plan maestro, Recursos del centro, Administración/Memorias, Estudiantes/Investigadores/RRHH, Ideas/Recordatorio, Inversiones y Base de datos de seminario.

El proveedor de Notion consulta data sources configurados; no recorre páginas hijas de forma recursiva. El catálogo del Archivo se cura a partir del export y de las fuentes públicas, y se revisa antes de publicarse.

Los archivos alojados en Notion tienen URL temporales. Para publicarlos de forma estable hay que descargarlos y guardarlos en `data/archivo/`, y declarar el asset con `source: "local"` y una ruta `/documentos/archivo/...`. Ver [ARCHIVO.md](ARCHIVO.md).

## 3. Obtener los data source IDs

La versión de API configurada es `2026-03-11`, que trabaja con **data sources**. El ID de la base que aparece en la URL **no sirve** para consultar: hay que copiar el ID de la fuente de datos.

### Desde la app de Notion

1. Abrir la base como página completa.
2. En `•••` arriba a la derecha, elegir **Manage data sources** / **Gestionar fuentes de datos**.
3. En la fuente de datos, abrir `•••` → **Copy data source ID** / **Copiar ID de la fuente de datos**.
4. Anotar el UUID junto al nombre de la base.
5. Repetir con cada base.

> No confundir: el ID de la URL es el de la base (o el de la vista, si está después de `?v=`). El **data source ID** es un UUID distinto y se copia desde **Manage data sources**.

### Verificación opcional por API

Con el token cargado en una variable de entorno:

```powershell
$env:NOTION_TOKEN = "ntn_..."
$headers = @{
  Authorization  = "Bearer $env:NOTION_TOKEN"
  "Notion-Version" = "2026-03-11"
}
$body = @{
  filter    = @{ property = "object"; value = "data_source" }
  page_size = 100
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method Post -Uri "https://api.notion.com/v1/search" `
  -Headers $headers -ContentType "application/json" -Body $body |
  Select-Object -ExpandProperty results |
  ForEach-Object { "{0} -> {1}" -f $_.title[0].plain_text, $_.id }
```

Esto lista solo las bases que ya fueron compartidas con la conexión. Si una base no aparece, revisar el paso 2.

Luego configurar `backend/.env`:

```env
CONTENT_PROVIDER=notion
NOTION_TOKEN=ntn_...
NOTION_VERSION=2026-03-11
NOTION_DATA_SOURCES={"projects":"ID","publications":"ID","seminars":"ID","becas":"ID","people":"ID","news":"ID","resources":"ID"}
NOTION_CACHE_TTL=300
```

Se puede empezar con una sola base y dejar las demás afuera del mapa:

```env
NOTION_DATA_SOURCES={"projects":"ID"}
```

Las colecciones no configuradas siguen usando el contenido local.

## 4. Cómo funciona el proveedor

`backend/src/providers/notion.ts`:

1. Toma el contenido curado local como base.
2. Consulta cada data source configurado.
3. Mapea las páginas con funciones genéricas (`mapProject`, `mapPublication`, etc.).
4. Si una base no está configurada o falla, conserva la colección local y registra una advertencia.
5. Valida el resultado con `ContentSchema`.
6. Guarda en caché el contenido durante `NOTION_CACHE_TTL` segundos.

Esto permite activar Notion de forma incremental: se puede empezar por una sola base y el resto sigue funcionando con el contenido local.

## 5. Mapeo de campos

El mapeo actual es genérico y tolerante: busca propiedades por nombre y usa valores por defecto. Antes de publicar con Notion hay que revisar:

- Nombres exactos de las propiedades en cada base.
- Tipos de propiedad (título, texto, select, multi-select, fecha, URL, email, relación).
- Estados en inglés (`Done`, `In progress`, `Not started`) y sus equivalentes en español.
- Campos obligatorios del esquema Zod: título, slug, resumen, tipo, estado, año, etc.
- Slugs estables para las URLs de proyectos.

Si una página no cumple el esquema, el proveedor falla con el detalle del campo inválido. Conviene probar primero en desarrollo con `CONTENT_PROVIDER=notion`.

## 6. Límites y caché

- Paginación de 100 registros por consulta.
- Límite aproximado de 3 solicitudes por segundo.
- Caché en memoria para evitar consultar Notion en cada request.
- Si se necesita invalidación inmediata, reiniciar el backend o reducir `NOTION_CACHE_TTL`.

## 7. Prueba

El archivo tiene que estar en `backend/.env`; no alcanza con crearlo en la raíz del repositorio. Después de cambiarlo, reiniciar el backend.

```bash
npm run build:shared
npm run build -w @cidtiee/backend
npm start
```

También se puede probar en desarrollo con:

```bash
npm run dev
```

Verificar en el navegador o con `Invoke-RestMethod`:

```text
http://localhost:3001/api/health   → "provider": "notion"
http://localhost:3001/api/meta     → "provider": "notion"
http://localhost:3001/api/content  → contenido mapeado
```

Si `provider` sigue siendo `local-json`, revisar que `CONTENT_PROVIDER=notion` esté en `backend/.env` y que el backend se haya reiniciado.

Si algo falla, revisar los logs del backend: las advertencias indican qué base usó el fallback local.

## 8. Errores frecuentes

| Error | Causa probable | Solución |
| --- | --- | --- |
| `401 unauthorized` | Token mal copiado, revocado o de otro workspace. | Copiar de nuevo el token desde **Configuration** o generarlo con **Refresh**. |
| `404 object_not_found` | La base no está compartida con la conexión, o se usó el ID de la base en lugar del data source ID. | Revisar los pasos 2 y 3. |
| `403 restricted_resource` | La conexión no tiene **Read content**. | Habilitar **Read content** en **Configuration**. |
| La búsqueda por API no devuelve una base | La base no fue compartida con la conexión. | Agregar la conexión desde `••• → Connections`. |
| El portal sigue mostrando el contenido local | `CONTENT_PROVIDER` no es `notion`, el `.env` está en otra ruta o el backend no se reinició. | Revisar `backend/.env` y reiniciar. |
| Error de validación de Zod | Los nombres o tipos de propiedades no coinciden con el mapeo. | Revisar `backend/src/providers/notion.ts` y ajustar el mapeo a la base real. |
| `validation_error` al consultar | El data source ID tiene un formato inválido o se copió el ID de la vista. | Copiar el ID desde **Manage data sources**. |

## 9. Seguridad

- El token vive solo en el backend.
- El navegador nunca lo recibe.
- No incluir el token en capturas, issues, commits ni reportes.
- Si el token se filtró, revocarlo en Notion y generar uno nuevo.
- Las bases deben compartirse solo con la integración, no con enlaces públicos.

## 10. Pendientes al conectar

- Confirmar los IDs de data sources.
- Ajustar los mapeos a las propiedades reales.
- Definir qué bases son públicas y cuáles quedan fuera.
- Revisar que no se importen datos de estudiantes, finanzas o reuniones internas.
- Validar slugs y enlaces antes de publicar.
- Descargar los archivos públicos y registrarlos en `data/archivo/`.
- Comparar el catálogo del Archivo con las ramas públicas y resolver los candidatos de revisión.
