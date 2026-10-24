import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const serverEntry = resolve(root, "backend/dist/index.js");

if (!existsSync(serverEntry)) {
  console.error("✗ No se encontró backend/dist/index.js. Ejecutá `npm run build` primero.");
  process.exit(1);
}

function freePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close(() => resolvePort(port));
    });
  });
}

function wait(ms) {
  return new Promise((resolveWait) => setTimeout(resolveWait, ms));
}

const port = await freePort();
const base = `http://127.0.0.1:${port}`;
const output = [];

const child = spawn(process.execPath, [serverEntry], {
  cwd: root,
  env: {
    ...process.env,
    PORT: String(port),
    HOST: "127.0.0.1",
    CONTENT_PROVIDER: "local-json",
    NODE_ENV: "test",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

child.stdout.on("data", (chunk) => output.push(String(chunk)));
child.stderr.on("data", (chunk) => output.push(String(chunk)));

let failures = 0;

function check(name, condition, detail = "") {
  if (condition) {
    console.log(`✓ ${name}`);
  } else {
    failures += 1;
    console.error(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function getJson(path) {
  const response = await fetch(`${base}${path}`);
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return { response, body };
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${base}/api/health`);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      // El servidor todavía no está escuchando.
    }
    await wait(250);
  }

  if (!ready) {
    throw new Error(`El servidor no respondió.\n${output.join("")}`);
  }

  const health = await getJson("/api/health");
  check("GET /api/health", health.response.status === 200 && health.body?.status === "ok");

  const content = await getJson("/api/content");
  check(
    "GET /api/content",
    content.response.status === 200 &&
      Array.isArray(content.body?.projects) &&
      content.body.projects.length > 0 &&
      Array.isArray(content.body?.publications),
  );

  const home = await getJson("/api/home");
  check(
    "GET /api/home",
    home.response.status === 200 &&
      Array.isArray(home.body?.featuredProjects) &&
      Array.isArray(home.body?.upcomingEvents),
  );

  const projects = await getJson("/api/projects?pageSize=5");
  check(
    "GET /api/projects",
    projects.response.status === 200 &&
      Array.isArray(projects.body?.items) &&
      projects.body.items.length <= 5 &&
      projects.body.total > 0,
  );

  const slug = projects.body?.items?.[0]?.slug;
  if (slug) {
    const detail = await getJson(`/api/projects/${encodeURIComponent(slug)}`);
    check(
      "GET /api/projects/:slug",
      detail.response.status === 200 && detail.body?.slug === slug,
    );
  } else {
    check("GET /api/projects/:slug", false, "no se obtuvo un slug del listado");
  }

  const missingProject = await getJson("/api/projects/proyecto-inexistente");
  check("GET /api/projects/:slug inexistente → 404", missingProject.response.status === 404);

  const publications = await getJson("/api/publications?type=revista&pageSize=3");
  check(
    "GET /api/publications con filtro",
    publications.response.status === 200 &&
      Array.isArray(publications.body?.items) &&
      publications.body.items.every((item) => item.type === "revista"),
  );

  const seminars = await getJson("/api/seminars?year=2026");
  check(
    "GET /api/seminars con filtro de año",
    seminars.response.status === 200 &&
      Array.isArray(seminars.body?.items) &&
      seminars.body.items.every((item) => item.year === 2026),
  );

  const becas = await getJson("/api/becas");
  check("GET /api/becas", becas.response.status === 200 && Array.isArray(becas.body));

  const search = await getJson("/api/search?q=energia");
  check(
    "GET /api/search con resultados",
    search.response.status === 200 &&
      Array.isArray(search.body?.items) &&
      search.body.items.length > 0,
  );

  const emptySearch = await getJson("/api/search?q=zzzzsinresultados");
  check(
    "GET /api/search sin resultados",
    emptySearch.response.status === 200 && emptySearch.body?.total === 0,
  );

  const notFound = await getJson("/api/no-existe");
  check("Endpoint API inexistente → 404 JSON", notFound.response.status === 404);

  const spa = await fetch(`${base}/observatorio/proyectos`);
  const spaHtml = await spa.text();
  check(
    "Ruta SPA servida por el backend",
    spa.status === 200 && spaHtml.includes('id="root"'),
  );

  const security = await fetch(`${base}/api/content`);
  check(
    "Cabeceras de seguridad",
    security.headers.get("x-content-type-options") === "nosniff" &&
      Boolean(security.headers.get("content-security-policy")),
  );
} catch (error) {
  failures += 1;
  console.error(`✗ Error durante las pruebas: ${error instanceof Error ? error.message : error}`);
} finally {
  child.kill("SIGTERM");
  await wait(400);
  if (!child.killed) child.kill("SIGKILL");
}

console.log("");
if (failures > 0) {
  console.error(`Smoke test finalizado con ${failures} fallo(s).`);
  console.error(output.join(""));
  process.exit(1);
}

console.log("Smoke test finalizado correctamente.");
