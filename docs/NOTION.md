# Conexión con Notion

La integración está preparada pero **desactivada por defecto**. El portal funciona con el contenido curado local. Para conectar Notion se necesitan dos cosas: el token de la integración y compartir cada base de datos con esa integración.

## 1. Crear la integración

1. Entrar a <https://www.notion.so/my-integrations>.
2. Crear una integración interna para el workspace del CIDTIEE.
3. Copiar el **Internal Integration Secret**.
4. Guardarlo en `backend/.env`:

```env
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> El token no se commitea. `backend/.env` está en `.gitignore`; usar `backend/.env.example` como plantilla.

## 2. Compartir las bases

El token por sí solo no da acceso. En Notion, abrir cada base de datos o página y usar **Compartir → Invitar → integración del CIDTIEE**.

Bases previstas:

- Proyectos
- Publicaciones
- Seminarios
- Becas y convocatorias
- Personas / recursos humanos
- Novedades
- Recursos

## 3. Obtener los data source IDs

La versión de API configurada es `2026-03-11`, que trabaja con **data sources**. El ID no es el mismo que el ID de la página o base visible en la URL.

Opciones:

- Consultar la documentación de Notion sobre data sources.
- Usar la API de búsqueda con el token para listar las bases compartidas.
- Copiar el ID que devuelve la API al consultar cada base.

Luego configurar el mapa en `backend/.env`:

```env
CONTENT_PROVIDER=notion
NOTION_DATA_SOURCES={"projects":"ID","publications":"ID","seminars":"ID","becas":"ID","people":"ID","news":"ID","resources":"ID"}
```

También se puede ajustar:

```env
NOTION_VERSION=2026-03-11
NOTION_CACHE_TTL=300
```

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

```bash
# 1. Configurar backend/.env
# 2. Compilar y levantar
npm run build:shared
npm run build -w @cidtiee/backend
npm start
```

Verificar:

```text
GET /api/health   → provider: "notion"
GET /api/meta     → provider: "notion"
GET /api/content  → contenido mapeado
```

Si algo falla, revisar los logs del backend: las advertencias indican qué base usó el fallback local.

## 8. Seguridad

- El token vive solo en el backend.
- El navegador nunca lo recibe.
- No incluir el token en capturas, issues, commits ni reportes.
- Si el token se filtró, revocarlo en Notion y generar uno nuevo.
- Las bases deben compartirse solo con la integración, no con enlaces públicos.

## 9. Pendientes al conectar

- Confirmar los IDs de data sources.
- Ajustar los mapeos a las propiedades reales.
- Definir qué bases son públicas y cuáles quedan fuera.
- Revisar que no se importen datos de estudiantes, finanzas o reuniones internas.
- Validar slugs y enlaces antes de publicar.
