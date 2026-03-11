import { LessonPlan, LessonPhase } from '../types/lessonPlan';

/**
 * Phase structure rules (Step 2 spec):
 * - Always 4 phases: Warm-Up, Mini Lesson, Guided Practice, Independent Practice.
 * - Time split: Warm-Up 15%, Mini Lesson 25%, Guided Practice 35%, Independent Practice 25%.
 * - Differentiation: placeholder per challenge; one friction point and one formative check per phase (below).
 */
const PHASE_SPECS: { title: string; percent: number; description: string; frictionPoint: string; formativeCheck: string }[] = [
  { title: 'Warm-Up', percent: 15, description: 'Quick review or hook to engage students.', frictionPoint: 'Some students may be slow to transition or off-task.', formativeCheck: 'Ask one quick recall or participation question to the whole class.' },
  { title: 'Mini Lesson', percent: 25, description: 'Model the core concept or skill.', frictionPoint: 'Pacing may be too fast for some; others may disengage if too slow.', formativeCheck: 'Pause to ask a check-for-understanding question (e.g., thumbs up/down or turn-and-talk).' },
  { title: 'Guided Practice', percent: 35, description: 'Students practice with support.', frictionPoint: 'Students may rush ahead or wait for help; materials may run short.', formativeCheck: 'Circulate and note 2–3 students to debrief or use as exemplars.' },
  { title: 'Independent Practice', percent: 25, description: 'Students apply skills on their own.', frictionPoint: 'Students may get stuck or need redirection to stay on task.', formativeCheck: 'Collect a quick exit slip or spot-check 2–3 responses before transition.' },
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
      frictionPoints: [spec.frictionPoint],
      formativeChecks: [spec.formativeCheck],
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
