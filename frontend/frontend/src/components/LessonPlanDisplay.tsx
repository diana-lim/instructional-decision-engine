import { useEffect, useState } from 'react';
import { fetchLessonPlan } from '../api/lessonPlan';
import type { LessonPlan, LessonPlanDisplayProps } from '../types/lesson';
import '../App.css';


export default function LessonPlanDisplay({ grade, curriculumUnit, time, challenges }: LessonPlanDisplayProps) {
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    // Fetch the generated lesson from the backend.
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({ grade, curriculumUnit, time: String(time), challenges });
    fetchLessonPlan(`?${params.toString()}`)
      .then(setLessonPlan)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to generate lesson.';
        setError(message);
        setLessonPlan(null);
      })
      .finally(() => setIsLoading(false));
  }, [grade, curriculumUnit, time, challenges]);

  if (error) return <div>Failed to load lesson: {error}</div>;

  if (isLoading && !lessonPlan) return <div>Loading lesson...</div>;
  if (!lessonPlan?.lessonPlan?.length) return <div>No lesson phases found</div>;



  return (
    <div>
        <h2>Grade: {lessonPlan?.gradeLevel ?? grade}</h2>
        <div>Unit: {lessonPlan?.curriculumUnit ?? curriculumUnit} | Time: {lessonPlan?.timeMinutes ?? time}</div>
      {lessonPlan.lessonPlan.map((phase) => (
        <div key={phase.phaseId} className="lesson-phase-card">
            <h3>{phase.title} ({phase.durationMinutes} min)</h3>
            <p>{phase.description}</p>

            {phase.differentiation && (
            <div className="phase-section">
                <strong>Differentiation:</strong>
                <ul>
                {Object.entries(phase.differentiation).map(([challenge, suggestion]) => (
                    <li key={challenge} className={challenge.replace(/\s+/g, '')}>
                    <strong>{challenge}:</strong> {suggestion}
                    </li>
                ))}
                </ul>
            </div>
            )}

            {phase.frictionPoints && (
            <div className="phase-section">
                <strong>Friction Points:</strong>
                <ul>
                {phase.frictionPoints.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
                </ul>
            </div>
            )}

            {phase.formativeChecks && (
            <div className="phase-section">
                <strong>Formative Checks:</strong>
                <ul>
                {phase.formativeChecks.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
                </ul>
            </div>
            )}
        </div>
        ))}

    </div>
  );
}
