# Contexto del Proyecto: Portfolio CIDTIEE
Estamos construyendo un portfolio institucional básico en formato digital para el centro de investigación CIDTIEE. El objetivo principal es visualizar proyectos, servicios, alumnos y actividades que actualmente están desorganizados en un Notion.

# Reglas de Arquitectura Frontend (Obligatorias)
- NO instales NINGUNA dependencia externa (ni npm, ni node_modules).
- NO utilices frameworks modernos (ni React, Vue, Angular, etc.).
- El desarrollo debe ser estrictamente Vanilla: HTML, CSS y JavaScript puro.
- Para consumir datos, asume que se hará mediante peticiones HTTP (Fetch API) a un backend futuro.

# Estructura de Entidades a Modelar
El sistema debe estar preparado para mostrar estas entidades principales en el futuro:
1. **Tareas:** Nombre, Descripción, Tipo, Estado, Información, Prioridad. Agrupables por Tipo/Estado/Prioridad.
2. **Alumnos:** Tipo (grado/investigación), Comentarios, Entregas, Fecha, Nombre, Estado, Docente a cargo.
3. **Docentes (Proyectos):** Nombre, Rol, Cátedra/Departamento, Cargo, Proyectos asignados, Estado (Activo/Finalizando/Detenido), Contacto, Comentarios.
4. **Reuniones:** Nombre, Fecha, Tipo, Temario, Tareas. Con historial (anteriores/próximas).
5. **Publicaciones:** Nombre, Tipo (Revista/Congreso), Fecha, Tareas, Descripción.
6. **Finanzas:** Nombre, CUIT, CBU, Fecha, Factura (tipo), Descripción, Archivos adjuntos.
7. **Becas:** Nombre, Apertura, Cierre, Web, Descripción, Condiciones.

# Estructura del Sitio (Maquetado Inicial)
Para la propuesta visual inicial (mockup), el diseño debe incluir secciones que abarquen estas áreas:
- Observatorio (Investigaciones)
- Transferencia (Extensión)
- Capacitaciones
- Servicios / Oscilaciones
- Medios de Difusión (Instagram)
- Funcionalidades extra: Calendario y "Mis proyectos".

Por favor, mantené el diseño sobrio e institucional.

# Estructura de Directorios Vigente
- El código fuente oficial se encuentra organizado de la siguiente manera:
  - `index.html` (en la raíz)
  - `src/css/styles.css`
  - `src/js/mock.js`
  - `src/js/notionService.js`
  - `src/js/ui.js`
- Ignora cualquier archivo antiguo o suelto que haya quedado en otras carpetas.