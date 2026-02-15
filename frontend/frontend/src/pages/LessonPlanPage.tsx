import { useEffect, useState } from "react";
import type { LessonPlan } from "../types/lesson";

export default function LessonPlanPage() {
    const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);

useEffect(() => {
  const fetchLessonPlan = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generateLessonPlan`);
    const data: LessonPlan = await response.json();
    console.log(data);
    setLessonPlan(data);
  };

  fetchLessonPlan();
}, []);

if (!lessonPlan) return <div>Loading...</div>;

  return (
    <div className="LessonPlanPage">
      <h1>{lessonPlan.curriculumUnit}</h1>
        <p>{lessonPlan.gradeLevel}</p>

        {lessonPlan.lessonPlan.map((phase) => (
        <div key={phase.phaseId}>
            <h3>{phase.title}</h3>
            <p>{phase.description}</p>
            <p>Duration: {phase.durationMinutes} minutes</p>
        </div>
        ))}
    </div>
  );
}
