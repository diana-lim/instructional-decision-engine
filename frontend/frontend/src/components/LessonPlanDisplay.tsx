import { useEffect, useState } from 'react';
import { fetchLessonPlan } from '../api/lessonPlan';
import type { LessonPhase, LessonPlan, LessonPlanDisplayProps } from '../types/lesson';
import '../App.css';


export default function LessonPlanDisplay({ grade, curriculumUnit, time, challenges }: LessonPlanDisplayProps) {
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [lessonPhases, setLessonPhases] = useState<LessonPhase[]>([]);


  useEffect(() => {
    const params = new URLSearchParams({ grade, curriculumUnit, time: String(time), challenges });
    fetchLessonPlan(`?${params.toString()}`)
      .then(setLessonPlan)
      .catch(console.error);
  }, [grade, curriculumUnit, time, challenges]);

  // Placeholder V1 fetch simulation
//   useEffect(() => {
//     // Here we'll call our fetchLessonPlan function later
//     // For now, we'll use dummy data
//     const dummyPhases: LessonPhase[] = [
//         {
//           phaseId: "phase-1",
//           title: "Warm-up",
//           durationMinutes: 5,
//           description: "Quick review of yesterday's material.",
//           differentiation: {
//             ELL: "Simplify language and provide visual aids",
//             Behavior: "Assign a peer buddy to support focus",
//             ReadingGaps: "Highlight key vocabulary and model reading aloud"
//           },
//           frictionPoints: [
//             "Some students may be off-task",
//             "Limited materials available"
//           ],
//           formativeChecks: ["Ask 1 comprehension question to the class"]
//         },
//         {
//           phaseId: "phase-2",
//           title: "Guided Practice",
//           durationMinutes: 10,
//           description: "Work through example problems together with teacher support.",
//           differentiation: {
//             ELL: "Pair ELL students with fluent peers",
//             Behavior: "Use clear, concise instructions and visual cues",
//             ReadingGaps: "Provide scaffolded hints and written examples"
//           },
//           frictionPoints: ["Students may rush ahead or wait for help"],
//           formativeChecks: ["Monitor progress and give targeted feedback"]
//         },
//         {
//           phaseId: "phase-3",
//           title: "Independent Practice",
//           durationMinutes: 15,
//           description: "Students work individually to apply skills.",
//           differentiation: {
//             ELL: "Provide sentence starters or visuals",
//             Behavior: "Use timer to help students manage time",
//             ReadingGaps: "Offer simplified practice problems"
//           },
//           frictionPoints: ["Students may get stuck or distracted"],
//           formativeChecks: ["Collect mini-assessments for review"]
//         }
//       ];      

//     setLessonPhases(dummyPhases);
//   }, [grade, time, challenges]);


  if (!lessonPlan) return <div>Loading lesson...</div>;
  if (!lessonPlan.lessonPlan.length) return <div>No lesson phases found</div>;



  return (
    <div>
        <h2>Grade: {lessonPlan.gradeLevel} </h2>
        <div>Unit: {lessonPlan.curriculumUnit} | Time: {lessonPlan.timeMinutes}</div>
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
