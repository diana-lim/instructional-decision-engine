import { useEffect, useState } from 'react';
import { fetchLessonPlan } from '../api/lessonPlan';
import type { LessonPhase, LessonPlan, LessonPlanDisplayProps } from '../types/lesson';


export default function LessonPlanDisplay({grade, time, challenges} : LessonPlanDisplayProps) {
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);

  useEffect(() => {
    fetchLessonPlan(`?grade=${grade}&time=${time}&challenges=${challenges}`)
      .then(setLessonPlan)
      .catch(console.error);
  }, [grade, time, challenges]);

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
