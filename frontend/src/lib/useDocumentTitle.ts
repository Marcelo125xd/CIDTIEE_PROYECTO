import { useEffect } from "react";

const BASE_TITLE = "CIDTIEE · UTN Facultad Regional Córdoba";

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · CIDTIEE` : BASE_TITLE;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
}
