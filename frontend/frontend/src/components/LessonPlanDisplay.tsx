import { useEffect, useState } from 'react';
import { fetchLessonPlan } from '../api/lessonPlan';

interface LessonPhase {
  phaseId: string;
  title: string;
  durationMinutes: number;
  description: string;
}

interface LessonPlan {
  lessonId: string;
  gradeLevel: string;
  curriculumUnit: string;
  timeMinutes: number;
  classroomChallenges: string[];
  lessonPlan: LessonPhase[];
}

export default function LessonPlanDisplay() {
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);

  useEffect(() => {
    fetchLessonPlan('?grade=5&time=25&challenges=ELL,Behavior')
      .then(setLessonPlan)
      .catch(console.error);
  }, []);

  if (!lessonPlan) return <div>Loading lesson...</div>;

  return (
    <div>
      <h2>Lesson Plan</h2>
      <p>
        Grade: {lessonPlan.gradeLevel} | Time: {lessonPlan.timeMinutes} minutes
      </p>

      {lessonPlan.lessonPlan.map((phase) => (
        <div key={phase.phaseId} style={{ marginBottom: '1rem' }}>
          <h3>
            {phase.title} ({phase.durationMinutes} min)
          </h3>
          <p>{phase.description}</p>
        </div>
      ))}
    </div>
  );
}
