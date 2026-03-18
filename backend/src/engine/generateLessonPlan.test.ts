import assert from 'assert';
import { buildPhases } from './generateLessonPlan';

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
      warmUp.differentiation && warmUp.differentiation['ELL'].includes('Provide support for ELL during Warm-Up'),
      'Expected ELL differentiation text to reference the Warm-Up phase'
    );
  }

  // 2) No differentiation object when no challenges are provided
  {
    const phases = buildPhases(30, [], '5', 'Unit X');
    for (const phase of phases) {
      assert.strictEqual((phase as any).differentiation, undefined, 'Expected differentiation to be omitted when classroomChallenges is empty');
    }
  }

  // 3) Grade-band awareness for formative checks
  {
    const elementary = buildPhases(20, [], '5', 'Unit X')[1]; // Mini Lesson (index 1)
    assert.ok(
      elementary.formativeChecks?.[0]?.includes('thumbs up/down or turn-and-talk'),
      'Expected elementary formative check example'
    );

    const middle = buildPhases(20, [], '7', 'Unit X')[1];
    assert.ok(
      middle.formativeChecks?.[0]?.includes('a quick written response + share'),
      'Expected middle formative check example'
    );

    const high = buildPhases(20, [], '10', 'Unit X')[1];
    assert.ok(
      high.formativeChecks?.[0]?.includes('a 1-sentence justification or quick reasoning check'),
      'Expected high formative check example'
    );
  }

  console.log('✅ generateLessonPlan.buildPhases tests passed');
}

run();

