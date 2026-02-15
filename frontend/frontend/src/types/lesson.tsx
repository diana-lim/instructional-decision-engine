export interface LessonPhase {
  phaseId: string;                // Unique identifier for the phase
  title: string;                  // Phase title
  durationMinutes: number;        // Suggested duration
  description: string;            // Instructions or guidance
  differentiation?: Record<string, string>; // Keyed by classroom challenge (e.g., "ELL", "Behavior")
  frictionPoints?: string[];      // Anticipated issues
  formativeChecks?: string[];     // Quick assessment suggestions
}

export interface LessonPlan {
  lessonId: string;               // Unique identifier for the lesson
  gradeLevel: string;             // Teacher input
  curriculumUnit: string;         // Teacher input
  timeMinutes: number;            // Teacher input
  classroomChallenges: string[];  // Teacher input (e.g., ["ELL", "Behavior"])
  lessonPlan: LessonPhase[];      // Array of lesson phases
}
