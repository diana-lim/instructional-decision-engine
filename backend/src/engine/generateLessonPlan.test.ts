import assert from 'assert';
import { buildPhases } from './generateLessonPlan';
import { bandMicroCheckExamples } from './ruleCatalog';

function sum(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

function assertPhaseBasics(phases: ReturnType<typeof buildPhases>, timeMinutes: number) {
  assert.strictEqual(phases.length, 4, 'Expected exactly 4 phases');
  const totalDuration = sum(phases.map((p) => p.durationMinutes));
  assert.strictEqual(totalDuration, timeMinutes, 'Expected phase durations to sum to total timeMinutes');

  // Basic presence checks for fields rendered by the UI
  for (const phase of phases) {
    assert.ok(phase.phaseId, 'phaseId is required');
    assert.ok(phase.title, 'title is required');
    assert.ok(phase.description, 'description is required');
    assert.ok(Array.isArray(phase.frictionPoints) && phase.frictionPoints.length === 1, 'frictionPoints should be a single-item array');
    assert.ok(Array.isArray(phase.formativeChecks) && phase.formativeChecks.length === 1, 'formativeChecks should be a single-item array');
  }
}

function run() {
  // 1) Core structure + time split + differentiation population
  {
    const timeMinutes = 25;
    const gradeLevel = '5';
    const curriculumUnit = 'Fractions 101';
    const classroomChallenges = ['ELL', 'Behavior'];
    const phases = buildPhases(timeMinutes, classroomChallenges, gradeLevel, curriculumUnit);

    assertPhaseBasics(phases, timeMinutes);

    const titles = phases.map((p) => p.title);
    assert.deepStrictEqual(titles, ['Warm-Up', 'Mini Lesson', 'Guided Practice', 'Independent Practice']);

    // Differentiation should exist and include both challenges, normalized by trimming.
    const warmUp = phases[0];
    assert.ok(warmUp.differentiation, 'Expected differentiation to be present when challenges are provided');
    assert.ok(warmUp.differentiation && warmUp.differentiation['ELL'], 'Expected ELL differentiation entry');
    assert.ok(warmUp.differentiation && warmUp.differentiation['Behavior'], 'Expected Behavior differentiation entry');
    assert.ok(
      warmUp.differentiation && warmUp.differentiation['ELL'].includes('sentence stems'),
      'Expected challenge-specific ELL guidance for Warm-Up'
    );
  }

  // 2) No differentiation object when no challenges are provided
  {
    const phases = buildPhases(30, [], '5', 'Unit X');
    for (const phase of phases) {
      assert.strictEqual((phase as any).differentiation, undefined, 'Expected differentiation to be omitted when classroomChallenges is empty');
    }
  }

  // 3) Grade-band awareness for formative checks (rotating variants; must stay band-appropriate)
  {
    const assertBandFormative = (bandLabel: string, grade: string, band: 'elementary' | 'middle' | 'high') => {
      const mini = buildPhases(20, [], grade, 'Unit X')[1];
      const text = mini.formativeChecks?.[0] ?? '';
      const options = bandMicroCheckExamples(band);
      assert.ok(
        options.some((opt) => text.includes(opt)),
        `Expected ${bandLabel} Mini Lesson formative to embed one band example (${band})`
      );
    };

    assertBandFormative('elementary', '5', 'elementary');
    assertBandFormative('middle', '7', 'middle');
    assertBandFormative('high', '10', 'high');
  }

  // 5) Canonical inference + expanded challenge rules (attendance)
  {
    const phases = buildPhases(30, ['Attendance'], '5', 'Unit X');
    const warmUp = phases[0];
    assert.ok(warmUp.differentiation?.['Attendance']?.toLowerCase().includes('re-entry'), 'Expected attendance-specific Warm-Up guidance');
  }

  // 4) Time-pressure behavior (compressed vs extended)
  {
    const compressed = buildPhases(20, ['ELL'], '5', 'Fractions')[0];
    assert.ok(
      compressed.description.includes('Keep transitions tight'),
      'Expected compressed-time description guidance'
    );
    assert.ok(
      compressed.formativeChecks?.[0]?.includes('30-60 seconds'),
      'Expected compressed-time formative check guidance'
    );

    const extended = buildPhases(60, ['ELL'], '5', 'Fractions')[0];
    assert.ok(
      extended.description.includes('deeper example or extension'),
      'Expected extended-time description guidance'
    );
    assert.ok(
      extended.formativeChecks?.[0]?.includes('brief extension prompt'),
      'Expected extended-time formative check guidance'
    );
  }

  console.log('✅ generateLessonPlan.buildPhases tests passed');
}

run();

