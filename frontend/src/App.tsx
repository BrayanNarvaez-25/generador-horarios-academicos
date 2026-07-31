import { useState } from "react";
import { CoursesPage } from "./pages/CoursesPage";
import { ConfigurationPage } from "./pages/ConfigurationPage";
import type { GenerateScheduleResponse } from "./types/schedule";
import styles from "./App.module.css";

type PageName = "courses" | "configuration" | "results";

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("courses");
  const [scheduleResult, setScheduleResult] =
    useState<GenerateScheduleResponse | null>(null);

  function handleScheduleGenerated(result: GenerateScheduleResponse) {
    setScheduleResult(result);
    setCurrentPage("results");
  }

  return (
    <div>
      <h1>Generador Inteligente de Horarios Académicos</h1>

      <nav className={styles.nav}>
        <button onClick={() => setCurrentPage("courses")}>Materias</button>
        <button onClick={() => setCurrentPage("configuration")}>
          Configuración
        </button>
        <button
          onClick={() => setCurrentPage("results")}
          disabled={!scheduleResult}
        >
          Resultados
        </button>
      </nav>

      {currentPage === "courses" && <CoursesPage />}

      {currentPage === "configuration" && (
        <ConfigurationPage onScheduleGenerated={handleScheduleGenerated} />
      )}

      {currentPage === "results" && scheduleResult && (
        <p>
          Aquí irá la Pantalla 3 de resultados (siguiente paso). Por ahora,
          total de combinaciones: {scheduleResult.totalCombinations}
        </p>
      )}
    </div>
  );
}

export default App;