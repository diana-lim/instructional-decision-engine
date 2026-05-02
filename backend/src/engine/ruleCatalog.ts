/**
 * Central catalog for constraint normalization, differentiation, and template variety.
 * Outputs remain deterministic for the same inputs (stable hash picking).
 */

export type GradeBand = 'elementary' | 'middle' | 'high' | 'unknown';

const PHASE_TITLES = ['Warm-Up', 'Mini Lesson', 'Guided Practice', 'Independent Practice'] as const;
export type PhaseTitle = (typeof PHASE_TITLES)[number];

/** Maps normalized keys (no spaces/punctuation) to canonical rule keys. */
export const CHALLENGE_SYNONYMS: Record<string, string> = {
  ell: 'ell',
  esl: 'ell',
  englishlanguagelearners: 'ell',
  multilinguallearners: 'ell',
  ml: 'ell',
  behavior: 'behavior',
  behaviour: 'behavior',
  classroommanagement: 'behavior',
  readinggaps: 'readinggaps',
  readinggap: 'readinggaps',
  literacy: 'readinggaps',
  attendance: 'attendance',
  absenteeism: 'attendance',
  limitedmaterials: 'limitedmaterials',
  limitedresources: 'limitedmaterials',
  materials: 'limitedmaterials',
  motivation: 'motivation',
  engagement: 'motivation',
  sped: 'sped',
  iep: 'sped',
  specialeducation: 'sped',
  fiveofour: 'sped',
};

export type CanonicalChallenge =
  | 'ell'
  | 'behavior'
  | 'readinggaps'
  | 'attendance'
  | 'limitedmaterials'
  | 'motivation'
  | 'sped';

/** Per-phase differentiation lines keyed by canonical challenge id. */
export const CANONICAL_DIFFERENTIATION: Record<
  CanonicalChallenge,
  Record<PhaseTitle, string>
> = {
  ell: {
    'Warm-Up': 'Use visuals and sentence stems so students can respond quickly.',
    'Mini Lesson': 'Pre-teach key vocabulary and model one example with think-aloud language.',
    'Guided Practice': 'Offer language frames and partner talk before written responses.',
    'Independent Practice': 'Allow word banks or sentence starters for independent responses.',
  },
  behavior: {
    'Warm-Up': 'Set a short timer and name one clear expectation before starting.',
    'Mini Lesson': 'Chunk directions into 1–2 steps and check for attention before each step.',
    'Guided Practice': 'Use proximity and quick positive feedback while students practice.',
    'Independent Practice': 'Provide a visible checklist and quick check-ins for on-task behavior.',
  },
  readinggaps: {
    'Warm-Up': 'Read prompt text aloud and highlight 2–3 key words.',
    'Mini Lesson': 'Model annotation or decoding of one sample question.',
    'Guided Practice': 'Provide chunked text and guided prompts for each chunk.',
    'Independent Practice': 'Allow a reduced reading load with scaffolded directions.',
  },
  attendance: {
    'Warm-Up':
      'Offer a 30-second “re-entry” prompt so late arrivals can join without restarting the whole opener.',
    'Mini Lesson': 'Keep must-know steps on the board so students who missed yesterday can self-orient.',
    'Guided Practice': 'Assign mixed pairs so peers can brief someone who was absent in one sentence.',
    'Independent Practice': 'Provide a printed or posted task outline so absent students can begin independently.',
  },
  limitedmaterials: {
    'Warm-Up': 'Run one whole-class demo; use choral response instead of one manipulative per student.',
    'Mini Lesson': 'Use a single worked example at the front before releasing to scarce materials.',
    'Guided Practice': 'Rotate materials in short stations or use half-class splits to share sets.',
    'Independent Practice': 'Offer a non-material alternative (sketch, explain aloud) for the same skill.',
  },
  motivation: {
    'Warm-Up': 'Open with a low-stakes success tied to the unit—confidence before complexity.',
    'Mini Lesson': 'Name the “why this matters” in one sentence to anchor effort.',
    'Guided Practice': 'Let students choose one of two parallel tasks at the same rigor.',
    'Independent Practice': 'End with a visible progress checkpoint so effort feels rewarded.',
  },
  sped: {
    'Warm-Up': 'Pre-announce any transitions and show the agenda visually.',
    'Mini Lesson': 'Break the objective into a must-do and a stretch; model the must-do first.',
    'Guided Practice': 'Use a consistent graphic organizer or protocol across examples.',
    'Independent Practice': 'Offer alternate output modes (oral, labeled diagram, sentence frames).',
  },
};

export function normalizeChallengeKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/[\s_-]/g, '');
}

/**
 * Map free-text teacher labels to a canonical rule key, or return normalized token for generic fallback.
 */
export function resolveCanonicalChallenge(raw: string): CanonicalChallenge | string {
  const normalized = normalizeChallengeKey(raw);
  const viaSynonym = CHALLENGE_SYNONYMS[normalized];
  if (viaSynonym) return viaSynonym as CanonicalChallenge;

  const lower = raw.toLowerCase();
  if (/^(ell|esl|esol|ml|\bml\b|language\s*learner)/i.test(lower) || /\bell\b/i.test(lower)) return 'ell';
  if (/behavior|behaviour|discipline|disruption|attention/i.test(lower)) return 'behavior';
  if (/read|literacy|decode|fluenc|comprehens/i.test(lower)) return 'readinggaps';
  if (/attend|absent|tardy|late\s*arrival/i.test(lower)) return 'attendance';
  if (/material|manipulative|supply|tech|device|wifi|one\s*to\s*one/i.test(lower)) return 'limitedmaterials';
  if (/motivat|engagement|apathetic|disengag/i.test(lower)) return 'motivation';
  if (/iep|504|\bsped\b|special\s*ed/i.test(lower)) return 'sped';

  return normalized;
}

export function getDifferentiationLine(canonical: CanonicalChallenge | string, phaseTitle: PhaseTitle): string {
  if (canonical in CANONICAL_DIFFERENTIATION) {
    return CANONICAL_DIFFERENTIATION[canonical as CanonicalChallenge][phaseTitle];
  }
  return `Provide support for this classroom constraint during ${phaseTitle} (scaffolds, pacing, grouping, or materials as needed).`;
}

/** Stable 32-bit hash for deterministic “variety” without randomness. */
export function stableHash(parts: string[]): number {
  const s = parts.join('|');
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickVariant(parts: string[], options: readonly string[]): string {
  if (options.length === 0) return '';
  const idx = stableHash(parts) % options.length;
  return options[idx]!;
}

/** Grade-band “micro-check” examples for Mini Lesson / checks — rotated for variety. */
export function bandMicroCheckExamples(band: GradeBand): readonly string[] {
  switch (band) {
    case 'elementary':
      return [
        'thumbs up/down or turn-and-talk',
        'a quick pair discussion using one prompt on the board',
        'show thinking on a mini-whiteboard or scrap paper',
      ];
    case 'middle':
      return [
        'a quick written response + share',
        'one multiple-choice check displayed + exit ticket',
        'a brief peer coaching prompt (“what would you add?”)',
      ];
    case 'high':
      return [
        'a 1-sentence justification or quick reasoning check',
        'a short written claim–evidence line',
        'a “explain your steps” oral check at the desk',
      ];
    default:
      return ['a quick check-for-understanding question'];
  }
}

/** Optional second clause for friction when pace is standard (compressed/extended handled elsewhere). */
export function frictionChallengeClause(
  canonicalIds: CanonicalChallenge[],
  phaseTitle: PhaseTitle,
  seedParts: string[]
): string {
  if (canonicalIds.length === 0) return '';
  const primary = canonicalIds[0]!;
  const clauses: Partial<Record<CanonicalChallenge, Record<PhaseTitle, readonly string[]>>> = {
    ell: {
      'Warm-Up': [
        ' Language demands may slow entry—keep prompts visible.',
        ' Background vocabulary may need quick preview.',
      ],
      'Mini Lesson': [
        ' Dense oral instruction may lose multilingual learners—anchor with written cues.',
        ' Key academic words may need repeat exposure in context.',
      ],
      'Guided Practice': [
        ' Peer talk helps, but monitor for silent opting-out.',
        ' Sentence frames help—ensure everyone has access on paper.',
      ],
      'Independent Practice': [
        ' Independent writing may spike cognitive load—offer stems.',
        ' Reading-heavy prompts may exhaust stamina—shorten the task.',
      ],
    },
    behavior: {
      'Warm-Up': [' Short unstructured time can spike noise—frame one norm.', ' Transitions are high-risk—preview the next step.'],
      'Mini Lesson': [' Long lecture stretches tax attention—chunk and signal.', ' Side conversations cluster—plan seating or partners intentionally.'],
      'Guided Practice': [' Side-talk may rise—use roles or timed silent work bursts.', ' Help-seeking lines may clog—use a help signal.'],
      'Independent Practice': [' Work refusal may appear—offer a smaller success task first.', ' Off-task drift rises—use visible timers and rubric reminders.'],
    },
    readinggaps: {
      'Warm-Up': [' Printed prompts may intimidate—read aloud.', ' Dense text at entry can shut students down—preview vocabulary.'],
      'Mini Lesson': [' Modeling once may not transfer—co-create an annotation.', ' Students may decode but not comprehend—probe meaning.'],
      'Guided Practice': [' Chunk size matters—short bursts with checks.', ' Partner reading helps—swap roles frequently.'],
      'Independent Practice': [' Independent reading load may exceed stamina—reduce length.', ' Directions may be misread—offer audio or shortened prompt.'],
    },
    attendance: {
      'Warm-Up': [' Missing prior lessons may widen gaps—don’t assume shared memory.', ' Late arrivals need a hook-in without rewinding five minutes.'],
      'Mini Lesson': [' Students may lack prerequisite examples—post a reference model.', ' Partial attendance cycles hurt continuity—repeat the objective aloud.'],
      'Guided Practice': [' Absences mean uneven skill—pair strategically.', ' Group work may strand someone uninformed—assign a “catch-up buddy.”'],
      'Independent Practice': [' Homework assumptions fail—give in-class launch steps.', ' Silent workers may be lost—circulate early.'],
    },
    limitedmaterials: {
      'Warm-Up': [' Sharing manipulatives slows pacing—keep tasks bite-sized.', ' Demo-heavy starts beat everyone touching gear at once.'],
      'Mini Lesson': [' Queuing for materials wastes minutes—stage supplies.', ' Tech limits mean alternate representations—draw vs. digital.'],
      'Guided Practice': [' Half-class rotations reduce crowding—signal transitions tightly.', ' Partner sets split scarcity—watch equity of turns.'],
      'Independent Practice': [' Unequal access breeds frustration—offer parallel tasks.', ' Material shortage may tempt rushing—extend time or simplify output.'],
    },
    motivation: {
      'Warm-Up': [' Low confidence shows as hesitation—normalize mistakes.', ' Compare-and-despair kills starts—highlight one accessible entry.'],
      'Mini Lesson': [' Abstract goals feel pointless—tie to a concrete outcome.', ' Speed variance breeds shame—celebrate partial progress.'],
      'Guided Practice': [' Choice can restore agency—keep rigor equivalent.', ' Peer comparison spikes anxiety—focus on growth language.'],
      'Independent Practice': [' Shut-down looks like “done fast”—probe understanding.', ' Exit expectations unclear—show an exemplar snippet.'],
    },
    sped: {
      'Warm-Up': [' Unexpected routines spike anxiety—preview cadence.', ' Sensory load varies—offer a quiet preview of materials.'],
      'Mini Lesson': [' Must-do vs. stretch must be explicit—avoid hidden demands.', ' Processing time varies—pause after questions.'],
      'Guided Practice': [' Over-helping builds dependence—fade prompts gradually.', ' Parallel tasks beat public spotlight—offer discreet options.'],
      'Independent Practice': [' Fatigue accumulates—shorten output mode when needed.', ' Executive-function friction spikes—chunk steps on a checklist.'],
    },
  };

  const pool = clauses[primary]?.[phaseTitle];
  if (!pool?.length) return '';
  return pickVariant([...seedParts, primary, phaseTitle, 'friction-extra'], pool);
}
