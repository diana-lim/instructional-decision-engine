import type { LessonPlan } from '../types/lesson';

/** Plain-text export for clipboard and email body. */
export function formatLessonPlanAsText(plan: LessonPlan): string {
  const lines: string[] = [];
  lines.push('LESSON PLAN');
  lines.push('===========');
  lines.push(`Grade: ${plan.gradeLevel}`);
  lines.push(`Unit: ${plan.curriculumUnit}`);
  lines.push(`Total time: ${plan.timeMinutes} minutes`);
  lines.push(`Classroom challenges: ${plan.classroomChallenges.join(', ') || '(none)'}`);
  lines.push('');

  for (const phase of plan.lessonPlan) {
    lines.push(`${phase.title} (${phase.durationMinutes} min)`);
    lines.push('-'.repeat(40));
    lines.push(phase.description);
    lines.push('');

    if (phase.differentiation && Object.keys(phase.differentiation).length > 0) {
      lines.push('Differentiation:');
      for (const [key, value] of Object.entries(phase.differentiation)) {
        lines.push(`  • ${key}: ${value}`);
      }
      lines.push('');
    }

    if (phase.frictionPoints?.length) {
      lines.push('Friction points:');
      for (const fp of phase.frictionPoints) {
        lines.push(`  • ${fp}`);
      }
      lines.push('');
    }

    if (phase.formativeChecks?.length) {
      lines.push('Formative checks:');
      for (const fc of phase.formativeChecks) {
        lines.push(`  • ${fc}`);
      }
      lines.push('');
    }

    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

/**
 * mailto: link for "email to self". Body may be truncated — URL length limits vary by client.
 */
export function buildMailtoLessonPlan(plan: LessonPlan, maxBodyChars = 1800): string {
  const full = formatLessonPlanAsText(plan);
  const body =
    full.length > maxBodyChars
      ? `${full.slice(0, maxBodyChars)}\n\n[... lesson truncated for email link length limits; use Copy to clipboard for the full plan ...]`
      : full;
  const subject = `Lesson plan: ${plan.curriculumUnit}`;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
