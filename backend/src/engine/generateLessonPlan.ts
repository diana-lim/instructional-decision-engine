import { LessonPlan, LessonPhase } from '../types/lessonPlan';

/**
 * Phase structure rules (Step 2 spec):
 * - Always 4 phases: Warm-Up, Mini Lesson, Guided Practice, Independent Practice.
 * - Time split: Warm-Up 15%, Mini Lesson 25%, Guided Practice 35%, Independent Practice 25%.
 * - Differentiation: placeholder per challenge; one friction point and one formative check per phase.
 * - Grade/unit awareness: templates use `gradeLevel` and `curriculumUnit` (Step 2 -> Step B).
 */
type GradeBand = 'elementary' | 'middle' | 'high' | 'unknown';

function getGradeBand(gradeLevel: string): GradeBand {
  const n = Number.parseInt(gradeLevel, 10);
  if (Number.isNaN(n)) return 'unknown';
  if (n <= 5) return 'elementary';
  if (n <= 8) return 'middle';
  return 'high';
}

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`);
}

const PHASE_SPECS: {
  title: string;
  percent: number;
  descriptionTemplate: string;
  frictionPointTemplate: string;
  formativeCheckTemplate: string;
}[] = [
  {
    title: 'Warm-Up',
    percent: 15,
    descriptionTemplate: 'Quick review or hook to engage students in {unit}.',
    frictionPointTemplate: 'Some students may be slow to transition or off-task during {phaseFocus}.',
    formativeCheckTemplate:
      'Ask one quick recall or participation question connected to {unit} (aim for short answers).',
  },
  {
    title: 'Mini Lesson',
    percent: 25,
    descriptionTemplate: 'Model the core concept or skill in {unit}.',
    frictionPointTemplate:
      'Pacing may be too fast for some; others may disengage if too slow while {phaseFocus}.',
    formativeCheckTemplate:
      'Pause to ask a check-for-understanding question (e.g., {uCheck}).',
  },
  {
    title: 'Guided Practice',
    percent: 35,
    descriptionTemplate: 'Students practice with support on {unit}.',
    frictionPointTemplate: 'Students may rush ahead or wait for help; materials or examples for {unit} may run short.',
    formativeCheckTemplate:
      'Circulate and note 2–3 students to debrief or use as exemplars for {unit}.',
  },
  {
    title: 'Independent Practice',
    percent: 25,
    descriptionTemplate: 'Students apply skills on their own using {unit}.',
    frictionPointTemplate: 'Students may get stuck or need redirection to stay on task during the {phaseFocus}.',
    formativeCheckTemplate:
      'Collect a quick exit slip or spot-check 2–3 responses connected to {unit} before transition.',
  },
];

function getDifferentiationSuggestion(challenge: string, phaseTitle: string): string {
  return `Provide support for ${challenge.trim()} during ${phaseTitle} (e.g., scaffolds, pacing, or materials as needed).`;
}

export function buildPhases(
  timeMinutes: number,
  classroomChallenges: string[],
  gradeLevel: string,
  curriculumUnit: string
): LessonPhase[] {
  const phases: LessonPhase[] = [];
  let remainingMinutes = timeMinutes;
  const band = getGradeBand(gradeLevel);
  const unit = curriculumUnit?.trim() ? curriculumUnit.trim() : 'this lesson';

  // Small grade-band tweaks to keep formative checks from feeling totally generic.
  const uCheck =
    band === 'elementary'
      ? 'thumbs up/down or turn-and-talk'
      : band === 'middle'
        ? 'a quick written response + share'
        : band === 'high'
          ? 'a 1-sentence justification or quick reasoning check'
          : 'a quick check-for-understanding question';

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
      description: fill(spec.descriptionTemplate, { unit }),
      ...(Object.keys(differentiation).length > 0 && { differentiation }),
      frictionPoints: [
        fill(spec.frictionPointTemplate, {
          unit,
          phaseFocus: spec.title === 'Warm-Up' ? 'the start of the lesson' : spec.title.toLowerCase(),
        }),
      ],
      formativeChecks: [
        fill(spec.formativeCheckTemplate, {
          unit,
          uCheck,
          phaseFocus: spec.title.toLowerCase(),
        }),
      ],
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
    lessonPlan: buildPhases(timeMinutes, classroomChallenges, gradeLevel, curriculumUnit),
  };
}
