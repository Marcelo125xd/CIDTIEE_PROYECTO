# Variables de entorno

## Backend

Archivo: `backend/.env` (no se commitea). Plantilla: `backend/.env.example`.

| Variable | Por defecto | Descripción |
| --- | --- | --- |
| `PORT` | `3001` | Puerto del servidor Express. |
| `HOST` | `0.0.0.0` | Interfaz de escucha. Usar `127.0.0.1` para desarrollo local estricto. |
| `CORS_ORIGIN` | `http://localhost:5173,http://127.0.0.1:5173` | Orígenes permitidos, separados por coma. |
| `CONTENT_PROVIDER` | `local-json` | `local-json` o `notion`. |
| `CONTENT_PATH` | `data/curated/content.json` | Ruta al JSON curado, relativa a la raíz del repo. |
| `NOTION_TOKEN` | vacío | Token de la integración de Notion. Solo backend. |
| `NOTION_VERSION` | `2026-03-11` | Versión de la API de Notion. |
| `NOTION_DATA_SOURCES` | `{}` | JSON con los IDs de data sources por colección. |
| `NOTION_CACHE_TTL` | `300` | Segundos de caché del contenido de Notion. |

### Ejemplo mínimo

```env
PORT=3001
HOST=127.0.0.1
CONTENT_PROVIDER=local-json
```

### Ejemplo con Notion

```env
PORT=3001
HOST=0.0.0.0
CORS_ORIGIN=https://cidtiee.example.edu.ar
CONTENT_PROVIDER=notion
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_VERSION=2026-03-11
NOTION_DATA_SOURCES={"projects":"...","publications":"...","seminars":"...","becas":"...","people":"...","news":"...","resources":"..."}
NOTION_CACHE_TTL=300
```

## Frontend

Archivo: `frontend/.env` o `.env.local` (no se commitea).

| Variable | Por defecto | Descripción |
| --- | --- | --- |
| `VITE_API_URL` | vacío | URL base de la API si el frontend se sirve desde otro origen. Si está vacío, usa el mismo origen y `/api`. |

Ejemplo para desarrollo con backend separado:

```env
VITE_API_URL=http://localhost:3001
```

En producción con Express sirviendo el build, no hace falta definirla.

## Seguridad

- No commitear `.env`, tokens ni credenciales.
- No exponer `NOTION_TOKEN` en variables `VITE_*`: todo lo que empieza con `VITE_` se incluye en el bundle del navegador.
- Rotar el token si se sospecha una filtración.
