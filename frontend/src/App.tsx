import { Navigate, Route, Routes } from "react-router-dom";
import { useContent } from "./content-context";
import { Layout } from "./components/Layout";
import { ErrorState, PageLoading } from "./components/States";
import { Home } from "./pages/Home";
import { Institucional } from "./pages/Institucional";
import { Observatorio } from "./pages/Observatorio";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Publications } from "./pages/Publications";
import { Transferencia } from "./pages/Transferencia";
import { Servicios } from "./pages/Servicios";
import { Formacion } from "./pages/Formacion";
import { Seminarios } from "./pages/Seminarios";
import { Becas } from "./pages/Becas";
import { Calendario } from "./pages/Calendario";
import { Medios } from "./pages/Medios";
import { Buscar } from "./pages/Buscar";
import { ArchiveHome } from "./pages/ArchiveHome";
import { ArchiveSectionPage } from "./pages/ArchiveSectionPage";
import { ArchiveSubsectionPage } from "./pages/ArchiveSubsectionPage";
import { ArchiveDetailPage } from "./pages/ArchiveDetailPage";
import { NotFound } from "./pages/NotFound";

export function App() {
  const { content, loading, error, reload } = useContent();

  if (loading) {
    return <PageLoading />;
  }

  if (error || !content) {
    return (
      <Layout>
        <div className="container page-state">
          <ErrorState
            message={error ?? "El contenido del portal no está disponible."}
            onRetry={reload}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/institucional" element={<Institucional />} />
        <Route path="/observatorio" element={<Observatorio />} />
        <Route path="/observatorio/proyectos" element={<Projects />} />
        <Route path="/observatorio/proyectos/:slug" element={<ProjectDetail />} />
        <Route path="/observatorio/publicaciones" element={<Publications />} />
        <Route path="/transferencia" element={<Transferencia />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/formacion" element={<Formacion />} />
        <Route path="/seminarios" element={<Seminarios />} />
        <Route path="/becas" element={<Becas />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/medios" element={<Medios />} />
        <Route path="/buscar" element={<Buscar />} />
        <Route path="/archivo" element={<ArchiveHome />} />
        <Route path="/archivo/:section" element={<ArchiveSectionPage />} />
        <Route path="/archivo/:section/:subsection" element={<ArchiveSubsectionPage />} />
        <Route
          path="/archivo/:section/:subsection/:slug"
          element={<ArchiveDetailPage />}
        />

        <Route path="/publicaciones" element={<Navigate to="/observatorio/publicaciones" replace />} />
        <Route path="/proyectos" element={<Navigate to="/observatorio/proyectos" replace />} />
        <Route path="/capacitaciones" element={<Navigate to="/formacion" replace />} />
        <Route path="/agenda" element={<Navigate to="/calendario" replace />} />
        <Route path="/inicio" element={<Navigate to="/" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
