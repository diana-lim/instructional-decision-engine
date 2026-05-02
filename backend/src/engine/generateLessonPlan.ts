import { LessonPlan, LessonPhase } from '../types/lessonPlan';
import {
  type CanonicalChallenge,
  type GradeBand,
  type PhaseTitle,
  bandMicroCheckExamples,
  frictionChallengeClause,
  getDifferentiationLine,
  pickVariant,
  resolveCanonicalChallenge,
} from './ruleCatalog';

/**
 * Phase structure rules:
 * - Always 4 phases: Warm-Up, Mini Lesson, Guided Practice, Independent Practice.
 * - Time split: Warm-Up 15%, Mini Lesson 25%, Guided Practice 35%, Independent Practice 25%.
 * - Differentiation: per classroom challenge; friction + formative guidance per phase.
 * - Grade/unit awareness via templates and band-specific check examples.
 */

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

function getPaceProfile(timeMinutes: number): 'compressed' | 'standard' | 'extended' {
  if (timeMinutes <= 25) return 'compressed';
  if (timeMinutes >= 50) return 'extended';
  return 'standard';
}

const PHASE_SPECS: {
  title: PhaseTitle;
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
    formativeCheckTemplate: 'Pause to ask a check-for-understanding question (e.g., {uCheck}).',
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

const CANONICAL_SET = new Set([
  'ell',
  'behavior',
  'readinggaps',
  'attendance',
  'limitedmaterials',
  'motivation',
  'sped',
]);

function canonicalChallengeList(classroomChallenges: string[]): CanonicalChallenge[] {
  const out: CanonicalChallenge[] = [];
  for (const c of classroomChallenges) {
    const r = resolveCanonicalChallenge(c.trim());
    if (CANONICAL_SET.has(r)) {
      out.push(r as CanonicalChallenge);
    }
  }
  return out;
}

/** Differentiation text keyed by teacher-visible challenge label. */
function differentiationForChallenge(trimmedLabel: string, phaseTitle: PhaseTitle): string {
  const resolved = resolveCanonicalChallenge(trimmedLabel);
  return getDifferentiationLine(resolved, phaseTitle);
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
  const canonicalList = canonicalChallengeList(classroomChallenges);

  const uCheckOptions = bandMicroCheckExamples(band);

  for (let i = 0; i < PHASE_SPECS.length; i++) {
    const spec = PHASE_SPECS[i]!;
    const isLast = i === PHASE_SPECS.length - 1;
    const durationMinutes = isLast ? remainingMinutes : Math.round(timeMinutes * (spec.percent / 100));

    const differentiation: Record<string, string> = {};
    for (const challenge of classroomChallenges) {
      const trimmed = challenge.trim();
      if (trimmed) differentiation[trimmed] = differentiationForChallenge(trimmed, spec.title);
    }

    const uCheck = pickVariant(
      [gradeLevel, unit, String(i), 'ucheck'],
      uCheckOptions
    );

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

    let frictionBase = fill(spec.frictionPointTemplate, {
      unit,
      phaseFocus: spec.title === 'Warm-Up' ? 'the start of the lesson' : spec.title.toLowerCase(),
    });
    frictionBase += paceFrictionTail;

    const frictionExtra =
      canonicalList.length > 0
        ? frictionChallengeClause(canonicalList, spec.title, [gradeLevel, unit, String(i)])
        : '';

    const frictionPoints = [frictionBase + frictionExtra];

    phases.push({
      phaseId: String(i + 1),
      title: spec.title,
      durationMinutes: Math.max(0, durationMinutes),
      description: `${fill(spec.descriptionTemplate, { unit })}${paceDescriptionTail}`,
      ...(Object.keys(differentiation).length > 0 && { differentiation }),
      frictionPoints,
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
