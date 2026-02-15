import { LessonPlan } from '../types/lessonPlan';

export function generateLessonPlan(
  gradeLevel: string,
  timeMinutes: number,
  classroomChallenges: string[]
): LessonPlan {

  const isShortLesson = timeMinutes <= 30;

  return {
    lessonId: 'generated-001',
    gradeLevel,
    curriculumUnit: 'Sample Unit',
    timeMinutes,
    classroomChallenges,
    lessonPlan: [
      {
        phaseId: '1',
        title: 'Introduction / Hook',
        durationMinutes: 5,
        description: 'Engage students with a quick prompt or visual.',
      },
      {
        phaseId: '2',
        title: 'Direct Instruction',
        durationMinutes: isShortLesson ? 10 : 15,
        description: 'Model the core concept.',
      },
      {
        phaseId: '3',
        title: 'Guided Practice',
        durationMinutes: isShortLesson ? 8 : 15,
        description: 'Students practice with support.',
      },
      {
        phaseId: '4',
        title: 'Closure',
        durationMinutes: isShortLesson ? 7 : 10,
        description: 'Quick reflection and exit ticket.',
      },
    ],
  };
}
