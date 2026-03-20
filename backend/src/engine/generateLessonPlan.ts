import { LessonPlan, LessonPhase } from '../types/lessonPlan';

/**
 * Phase structure rules (Step 2 spec):
 * - Always 4 phases: Warm-Up, Mini Lesson, Guided Practice, Independent Practice.
 * - Time split: Warm-Up 15%, Mini Lesson 25%, Guided Practice 35%, Independent Practice 25%.
 * - Differentiation: placeholder per challenge; one friction point and one formative check per phase.
 * - Grade/unit awareness: templates use `gradeLevel` and `curriculumUnit` (Step 2 -> Step B).
 */
type GradeBand = 'elementary' | 'middle' | 'high' | 'unknown';
type PaceProfile = 'compressed' | 'standard' | 'extended';

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

function getPaceProfile(timeMinutes: number): PaceProfile {
  if (timeMinutes <= 25) return 'compressed';
  if (timeMinutes >= 50) return 'extended';
  return 'standard';
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
  const normalized = challenge.trim().toLowerCase().replace(/[\s-]/g, '');
  const byChallenge: Record<string, Record<string, string>> = {
    ell: {
      'Warm-Up': 'Use visuals and sentence stems so students can respond quickly.',
      'Mini Lesson': 'Pre-teach key vocabulary and model one example with think-aloud language.',
      'Guided Practice': 'Offer language frames and partner talk before written responses.',
      'Independent Practice': 'Allow word banks or sentence starters for independent responses.',
    },
    behavior: {
      'Warm-Up': 'Set a short timer and name one clear expectation before starting.',
      'Mini Lesson': 'Chunk directions into 1-2 steps and check for attention before each step.',
      'Guided Practice': 'Use proximity and quick positive feedback while students practice.',
      'Independent Practice': 'Provide a visible checklist and quick check-ins for on-task behavior.',
    },
    readinggaps: {
      'Warm-Up': 'Read prompt text aloud and highlight 2-3 key words.',
      'Mini Lesson': 'Model annotation or decoding of one sample question.',
      'Guided Practice': 'Provide chunked text and guided prompts for each chunk.',
      'Independent Practice': 'Allow a reduced reading load with scaffolded directions.',
    },
  };

  const phaseSuggestions = byChallenge[normalized];
  if (phaseSuggestions?.[phaseTitle]) return phaseSuggestions[phaseTitle];

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
  const pace = getPaceProfile(timeMinutes);
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

    const paceDescriptionTail =
      pace === 'compressed'
        ? ' Keep transitions tight and prioritize the essential objective.'
        : pace === 'extended'
          ? ' Include one deeper example or extension before moving on.'
          : '';

    const paceFrictionTail =
      pace === 'compressed'
        ? ' Time pressure may reduce opportunities for individual support.'
        : pace === 'extended'
          ? ' Longer blocks can reduce urgency and drift off pace without clear checkpoints.'
          : '';

    const paceFormativeTail =
      pace === 'compressed'
        ? ' Keep this to 30-60 seconds.'
        : pace === 'extended'
          ? ' Follow with one brief extension prompt for students who are ready.'
          : '';

    phases.push({
      phaseId: String(i + 1),
      title: spec.title,
      durationMinutes: Math.max(0, durationMinutes),
      description: `${fill(spec.descriptionTemplate, { unit })}${paceDescriptionTail}`,
      ...(Object.keys(differentiation).length > 0 && { differentiation }),
      frictionPoints: [
        fill(spec.frictionPointTemplate, {
          unit,
          phaseFocus: spec.title === 'Warm-Up' ? 'the start of the lesson' : spec.title.toLowerCase(),
        }) + paceFrictionTail,
      ],
      formativeChecks: [
        fill(spec.formativeCheckTemplate, {
          unit,
          uCheck,
          phaseFocus: spec.title.toLowerCase(),
        }) + paceFormativeTail,
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
