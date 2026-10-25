import { Router } from "express";
import { asyncHandler, notFound } from "../lib/http.js";
import {
  parseArchiveQuery,
  parseBecaQuery,
  parseProjectQuery,
  parsePublicationQuery,
  parseSearchQuery,
  parseSeminarQuery,
} from "../lib/query.js";
import type { ContentProvider } from "../providers/types.js";

export function createApiRouter(provider: ContentProvider): Router {
  const router = Router();

  router.get(
    "/health",
    asyncHandler(async (_req, res) => {
      res.json({
        status: "ok",
        provider: provider.name,
        timestamp: new Date().toISOString(),
      });
    }),
  );

  router.get(
    "/meta",
    asyncHandler(async (_req, res) => {
      res.json(await provider.getMeta());
    }),
  );

  router.get(
    "/content",
    asyncHandler(async (_req, res) => {
      res.setHeader("Cache-Control", "public, max-age=120");
      res.json(await provider.getContent());
    }),
  );

  router.get(
    "/home",
    asyncHandler(async (_req, res) => {
      res.setHeader("Cache-Control", "public, max-age=60");
      res.json(await provider.getHome());
    }),
  );

  router.get(
    "/projects",
    asyncHandler(async (req, res) => {
      res.json(await provider.listProjects(parseProjectQuery(req.query)));
    }),
  );

  router.get(
    "/projects/:slug",
    asyncHandler(async (req, res) => {
      const project = await provider.getProject(req.params.slug ?? "");
      if (!project) notFound("Proyecto no encontrado");
      res.json(project);
    }),
  );

  router.get(
    "/publications",
    asyncHandler(async (req, res) => {
      res.json(await provider.listPublications(parsePublicationQuery(req.query)));
    }),
  );

  router.get(
    "/seminars",
    asyncHandler(async (req, res) => {
      res.json(await provider.listSeminars(parseSeminarQuery(req.query)));
    }),
  );

  router.get(
    "/becas",
    asyncHandler(async (req, res) => {
      res.json(await provider.listBecas(parseBecaQuery(req.query)));
    }),
  );

  router.get(
    "/people",
    asyncHandler(async (_req, res) => {
      res.json(await provider.listPeople());
    }),
  );

  router.get(
    "/news",
    asyncHandler(async (_req, res) => {
      res.json(await provider.listNews());
    }),
  );

  router.get(
    "/resources",
    asyncHandler(async (_req, res) => {
      res.json(await provider.listResources());
    }),
  );

  router.get(
    "/calendar",
    asyncHandler(async (_req, res) => {
      res.json(await provider.getCalendar());
    }),
  );

  router.get(
    "/archive",
    asyncHandler(async (_req, res) => {
      res.setHeader("Cache-Control", "public, max-age=120");
      res.json(await provider.getArchive());
    }),
  );

  router.get(
    "/archive/items",
    asyncHandler(async (req, res) => {
      res.json(await provider.listArchiveItems(parseArchiveQuery(req.query)));
    }),
  );

  router.get(
    "/archive/items/:slug",
    asyncHandler(async (req, res) => {
      const item = await provider.getArchiveItem(req.params.slug ?? "");
      if (!item) notFound("Registro del archivo no encontrado");
      res.json(item);
    }),
  );

  router.get(
    "/search",
    asyncHandler(async (req, res) => {
      res.json(await provider.search(parseSearchQuery(req.query)));
    }),
  );

  return router;
}
