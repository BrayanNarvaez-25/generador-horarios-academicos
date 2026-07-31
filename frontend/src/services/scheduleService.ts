import { apiFetch } from "./api";
import type {
  ScheduleConfiguration,
  GenerateScheduleResponse,
} from "../types/schedule";

export function generateSchedule(
  configuration: ScheduleConfiguration
): Promise<GenerateScheduleResponse> {
  return apiFetch<GenerateScheduleResponse>("/schedules/generate", {
    method: "POST",
    body: JSON.stringify(configuration),
  });
}