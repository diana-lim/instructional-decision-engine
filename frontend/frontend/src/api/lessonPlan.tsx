import type { LessonPlan } from "../types/lesson";

export async function fetchLessonPlan(): Promise<LessonPlan> {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generateLessonPlan`);
    if (!response.ok) {
    throw new Error("Failed to fetch lesson plan");
  }
  return response.json();
}
