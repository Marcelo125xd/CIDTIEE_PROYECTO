import { appConfig } from "./config.js";
import { createApp } from "./app.js";
import { createContentProvider } from "./providers/index.js";

const provider = createContentProvider(appConfig);
const app = createApp(provider, appConfig);

const server = app.listen(appConfig.port, appConfig.host, () => {
  console.log(`CIDTIEE API escuchando en http://${appConfig.host}:${appConfig.port}`);
  console.log(`Proveedor de contenido: ${provider.name}`);
  if (appConfig.provider === "notion" && !appConfig.notion.token) {
    console.warn(
      "⚠ CONTENT_PROVIDER=notion pero NOTION_TOKEN está vacío. Configurá backend/.env.",
    );
  }
});

function shutdown(signal: string) {
  console.log(`\n${signal} recibido; cerrando servidor...`);
  server.close(() => process.exit(0));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
