import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Content } from "@cidtiee/shared";
import { api, ApiError } from "./api";

type ContentContextValue = {
  content: Content | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    api
      .content(controller.signal)
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(
          reason instanceof ApiError
            ? reason.message
            : "No se pudo cargar la información del CIDTIEE.",
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [attempt]);

  const value = useMemo(
    () => ({ content, loading, error, reload }),
    [content, loading, error, reload],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const value = useContext(ContentContext);
  if (!value) {
    throw new Error("useContent debe usarse dentro de ContentProvider");
  }
  return value;
}

export function useRequiredContent(): Content {
  const { content } = useContent();
  if (!content) {
    throw new Error("El contenido todavía no está disponible");
  }
  return content;
}
