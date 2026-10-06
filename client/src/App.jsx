import { useState, useEffect } from "react";
import AdminPage from "./pages/AdminPage";
import ProjectorPage from "./pages/ProjectorPage";

export default function App() {
  const [page, setPage] = useState(window.location.hash || "#admin");

  useEffect(() => {
    const onChange = () => setPage(window.location.hash || "#admin");
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  if (page === "#projector") return <ProjectorPage />;

  return (
    <div>
      <nav className="nav">
        <strong>🏁 RaceDay Live: Admin</strong>
        <a href="#projector" target="_blank" rel="noreferrer">
          Open Projector View ↗
        </a>
      </nav>
      <AdminPage />
    </div>
  );
}