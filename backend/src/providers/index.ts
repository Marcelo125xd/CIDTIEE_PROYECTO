import type { AppConfig } from "../config.js";
import { LocalJsonProvider } from "./local-json.js";
import { NotionProvider } from "./notion.js";
import type { ContentProvider } from "./types.js";

export function createContentProvider(config: AppConfig): ContentProvider {
  if (config.provider === "notion") {
    return new NotionProvider(config);
  }

  return new LocalJsonProvider(config.contentPath);
}

export type { ContentProvider } from "./types.js";
