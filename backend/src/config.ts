import { config as loadEnv } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

loadEnv({ path: resolve(repoRoot, "backend/.env") });

export type ContentProviderName = "local-json" | "notion";

export type NotionDataSourceMap = Partial<
  Record<
    "projects" | "publications" | "seminars" | "becas" | "people" | "news" | "resources",
    string
  >
>;

export type AppConfig = {
  repoRoot: string;
  port: number;
  host: string;
  corsOrigin: string | string[];
  provider: ContentProviderName;
  contentPath: string;
  notion: {
    token?: string;
    version: string;
    dataSources: NotionDataSourceMap;
    cacheTtlSeconds: number;
  };
};

function parseDataSources(value: string | undefined): NotionDataSourceMap {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    const result: NotionDataSourceMap = {};
    for (const [key, id] of Object.entries(parsed)) {
      if (
        ["projects", "publications", "seminars", "becas", "people", "news", "resources"].includes(
          key,
        ) &&
        typeof id === "string" &&
        id.trim().length > 0
      ) {
        result[key as keyof NotionDataSourceMap] = id.trim();
      }
    }
    return result;
  } catch {
    return {};
  }
}

function parseCorsOrigin(value: string | undefined): string | string[] {
  if (!value) {
    return ["http://localhost:5173", "http://127.0.0.1:5173"];
  }

  const origins = value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length === 1 ? origins[0]! : origins;
}

function parseProvider(value: string | undefined): ContentProviderName {
  return value === "notion" ? "notion" : "local-json";
}

export const appConfig: AppConfig = {
  repoRoot,
  port: Number.parseInt(process.env.PORT ?? "3001", 10),
  host: process.env.HOST ?? "0.0.0.0",
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
  provider: parseProvider(process.env.CONTENT_PROVIDER),
  contentPath: process.env.CONTENT_PATH
    ? resolve(repoRoot, process.env.CONTENT_PATH)
    : resolve(repoRoot, "data/curated/content.json"),
  notion: {
    token: process.env.NOTION_TOKEN?.trim() || undefined,
    version: process.env.NOTION_VERSION?.trim() || "2026-03-11",
    dataSources: parseDataSources(process.env.NOTION_DATA_SOURCES),
    cacheTtlSeconds: Number.parseInt(process.env.NOTION_CACHE_TTL ?? "300", 10),
  },
};
