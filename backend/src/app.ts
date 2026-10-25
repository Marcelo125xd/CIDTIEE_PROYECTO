import compression from "compression";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { AppConfig } from "./config.js";
import { HttpError } from "./lib/http.js";
import type { ContentProvider } from "./providers/types.js";
import { createApiRouter } from "./routes/index.js";

export function createApp(provider: ContentProvider, config: AppConfig) {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "img-src 'self' data: https:",
        "style-src 'self' 'unsafe-inline'",
        "script-src 'self'",
        "connect-src 'self' https:",
        "font-src 'self' data:",
        "frame-src 'self'",
        "object-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; "),
    );
    next();
  });

  app.use(
    cors({
      origin: config.corsOrigin,
      methods: ["GET", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
      maxAge: 86400,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: "100kb" }));

  app.use("/api", createApiRouter(provider));

  const archiveFiles = resolve(config.repoRoot, "data/archivo");
  const archiveDocumentPattern =
    /\.(pdf|png|jpe?g|webp|gif|docx?|xlsx?|pptx?|txt|csv)$/i;
  const archiveNotFound = (_req: Request, res: Response) => {
    res.status(404).json({ error: { status: 404, message: "Documento no encontrado" } });
  };

  app.use(
    "/documentos/archivo",
    (req, res, next) => {
      // Solo se publican documentos e imágenes. Cualquier otro formato
      // (HTML, SVG, scripts) se rechaza para no servir contenido ejecutable
      // desde el mismo origen.
      if (!archiveDocumentPattern.test(req.path)) {
        archiveNotFound(req, res);
        return;
      }
      next();
    },
    express.static(archiveFiles, {
      index: false,
      dotfiles: "deny",
      maxAge: "1h",
      setHeaders: (res, path) => {
        // Los PDF e imágenes locales se previsualizan dentro del portal.
        // El CSP global usa frame-ancestors 'none'; para estos archivos se
        // permite el mismo origen.
        res.setHeader("X-Frame-Options", "SAMEORIGIN");
        res.setHeader("Content-Security-Policy", "frame-ancestors 'self'");
        if (/\.pdf$/i.test(path)) {
          res.setHeader("Content-Disposition", "inline");
        }
      },
    }),
  );
  app.use("/documentos", archiveNotFound);

  const frontendDist = resolve(config.repoRoot, "frontend/dist");
  if (existsSync(frontendDist)) {
    app.use(
      express.static(frontendDist, {
        maxAge: "1h",
        setHeaders: (res, path) => {
          if (path.endsWith("index.html")) {
            res.setHeader("Cache-Control", "no-cache");
          }
        },
      }),
    );

    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api/")) {
        next();
        return;
      }
      res.sendFile(resolve(frontendDist, "index.html"));
    });
  } else {
    app.get("/", (_req, res) => {
      res.json({
        name: "CIDTIEE API",
        message:
          "API pública del CIDTIEE. El frontend no está compilado; ejecutá `npm run build` o usá el servidor de Vite en desarrollo.",
        endpoints: [
          "/api/health",
          "/api/content",
          "/api/home",
          "/api/projects",
          "/api/publications",
          "/api/seminars",
          "/api/becas",
          "/api/people",
          "/api/news",
          "/api/resources",
          "/api/calendar",
          "/api/archive",
          "/api/archive/items",
          "/api/search?q=energía",
        ],
      });
    });
  }

  app.use((req, res) => {
    if (req.path.startsWith("/api/")) {
      res.status(404).json({ error: { status: 404, message: "Endpoint no encontrado" } });
      return;
    }
    res.status(404).json({ error: { status: 404, message: "Recurso no encontrado" } });
  });

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const status = error instanceof HttpError ? error.status : 500;
    const message =
      error instanceof HttpError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Error interno del servidor";

    if (status >= 500) {
      console.error("[api]", error);
    }

    res.status(status).json({
      error: {
        status,
        message:
          status >= 500 && process.env.NODE_ENV === "production"
            ? "Error interno del servidor"
            : message,
      },
    });
  });

  return app;
}
