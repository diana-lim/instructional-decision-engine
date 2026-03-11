import { LessonPlan, LessonPhase } from '../types/lessonPlan';

/**
 * Phase structure rules (Step 2 spec):
 * - Always 4 phases: Warm-Up, Mini Lesson, Guided Practice, Independent Practice.
 * - Time split: Warm-Up 15%, Mini Lesson 25%, Guided Practice 35%, Independent Practice 25%.
 * - Differentiation: placeholder text per challenge; friction points and formative checks to be added later.
 */
const PHASE_SPECS: { title: string; percent: number; description: string }[] = [
  { title: 'Warm-Up', percent: 15, description: 'Quick review or hook to engage students.' },
  { title: 'Mini Lesson', percent: 25, description: 'Model the core concept or skill.' },
  { title: 'Guided Practice', percent: 35, description: 'Students practice with support.' },
  { title: 'Independent Practice', percent: 25, description: 'Students apply skills on their own.' },
];

function getDifferentiationSuggestion(challenge: string, phaseTitle: string): string {
  return `Provide support for ${challenge.trim()} during ${phaseTitle} (e.g., scaffolds, pacing, or materials as needed).`;
}

export function buildPhases(
  timeMinutes: number,
  classroomChallenges: string[],
  _gradeLevel: string
): LessonPhase[] {
  const phases: LessonPhase[] = [];
  let remainingMinutes = timeMinutes;

  for (let i = 0; i < PHASE_SPECS.length; i++) {
    const spec = PHASE_SPECS[i];
    const isLast = i === PHASE_SPECS.length - 1;
    const durationMinutes = isLast
      ? remainingMinutes
      : Math.round(timeMinutes * (spec.percent / 100));

    const differentiation: Record<string, string> = {};
    for (const challenge of classroomChallenges) {
      const trimmed = challenge.trim();
      if (trimmed) differentiation[trimmed] = getDifferentiationSuggestion(trimmed, spec.title);
    }

    phases.push({
      phaseId: String(i + 1),
      title: spec.title,
      durationMinutes: Math.max(0, durationMinutes),
      description: spec.description,
      ...(Object.keys(differentiation).length > 0 && { differentiation }),
    });

    remainingMinutes -= durationMinutes;
  }

  return phases;
}

export function generateLessonPlan(
  gradeLevel: string,
  curriculumUnit: string,
  timeMinutes: number,
  classroomChallenges: string[]
): LessonPlan {
  return {
    lessonId: 'generated-001',
    gradeLevel,
    curriculumUnit,
    timeMinutes,
    classroomChallenges,
    lessonPlan: buildPhases(timeMinutes, classroomChallenges, gradeLevel),
  };
}
