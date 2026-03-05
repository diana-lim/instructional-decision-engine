// Re-export API types from backend (single source of truth)
export type { LessonPhase, LessonPlan } from "@backend/src/types/lessonPlan";

/** Props for the lesson plan display component (form/query params). */
export interface LessonPlanDisplayProps {
  grade: string;
  curriculumUnit: string;
  time: number;
  challenges: string;
}