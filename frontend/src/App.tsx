import { useState } from "react";
import { CoursesPage } from "./pages/CoursesPage";
import { ConfigurationPage } from "./pages/ConfigurationPage";
import { ResultsPage } from "./pages/ResultsPage";
import type {
  GenerateScheduleResponse,
  EvaluatedSchedule,
} from "./types/schedule";
import styles from "./App.module.css";

type PageName = "courses" | "configuration" | "results" | "detail";

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("courses");
  const [scheduleResult, setScheduleResult] =
    useState<GenerateScheduleResponse | null>(null);
  const [selectedSchedule, setSelectedSchedule] =
    useState<EvaluatedSchedule | null>(null);

  function handleScheduleGenerated(result: GenerateScheduleResponse) {
    setScheduleResult(result);
    setCurrentPage("results");
  }

  function handleViewDetail(schedule: EvaluatedSchedule) {
    setSelectedSchedule(schedule);
    setCurrentPage("detail");
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
        <ResultsPage result={scheduleResult} onViewDetail={handleViewDetail} />
      )}

      {currentPage === "detail" && selectedSchedule && (
        <p>
          Aquí irá la Pantalla 4 de detalle (siguiente paso). Materias:{" "}
          {selectedSchedule.courses.join(", ")}
        </p>
      )}
    </div>
  );
}

export default App;