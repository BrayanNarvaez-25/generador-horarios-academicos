import { useCourses } from "../hooks/useCourses";
import { ScheduleConfigForm } from "../components/ScheduleConfigForm";
import { generateSchedule } from "../services/scheduleService";
import type { ScheduleConfiguration, GenerateScheduleResponse } from "../types/schedule";

interface ConfigurationPageProps {
  onScheduleGenerated: (result: GenerateScheduleResponse) => void;
}

export function ConfigurationPage({
  onScheduleGenerated,
}: ConfigurationPageProps) {
  const { courses, loading, error } = useCourses();

  async function handleGenerate(configuration: ScheduleConfiguration) {
    const result = await generateSchedule(configuration);
    onScheduleGenerated(result);
  }

  return (
    <div>
      <h2>Configurar el horario</h2>

      {loading && <p>Cargando materias disponibles...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <ScheduleConfigForm
          availableCourses={courses}
          onSubmit={handleGenerate}
        />
      )}
    </div>
  );
}