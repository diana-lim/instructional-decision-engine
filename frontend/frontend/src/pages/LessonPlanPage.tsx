import LessonPlanDisplay from "../components/LessonPlanDisplay";
import { useState } from "react";
import '../App.css';
import type { LessonPlanDisplayProps } from "../types/lesson";


export default function LessonPlanPage() {
  const [grade, setGrade] = useState('');
  const [curriculumUnit, setCurriculumUnit] = useState('');
  const [time, setTime] = useState<number | ''>('');
  const [challenges, setChallenges] = useState('');
  const [submittedParams, setSubmittedParams] = useState<LessonPlanDisplayProps | null>(null);

  const handleGenerate = () => {
    if (!grade.trim() || !curriculumUnit.trim() || time === '' || time <= 0 || !challenges.trim()) return;
    setSubmittedParams({
      grade: grade.trim(),
      curriculumUnit: curriculumUnit.trim(),
      time,
      challenges: challenges.trim(),
    });
  };

  const canGenerate =
    !!grade.trim() && !!curriculumUnit.trim() && time !== '' && time > 0 && !!challenges.trim();
  
  

  return (
    <div className="LessonPlanPage">
      <h1>Instructional Decision Engine</h1>
      <div className="input-card">
        <div className="input-group">
          <label>Grade Level</label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Curriculum Unit</label>
          <input
            type="text"
            value={curriculumUnit}
            onChange={(e) => setCurriculumUnit(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Time (minutes)</label>
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>

        <div className="input-group">
          <label>Classroom Challenges</label>
          <input
            type="text"
            value={challenges}
            onChange={(e) => setChallenges(e.target.value)}
          />
        </div>

        <button className="generate-btn" onClick={handleGenerate} disabled={!canGenerate}>
          Generate Lesson
        </button>
      </div>

      {submittedParams && (
        <LessonPlanDisplay
          grade={submittedParams.grade}
          curriculumUnit={submittedParams.curriculumUnit}
          time={submittedParams.time}
          challenges={submittedParams.challenges}
        />
      )}

    </div>
  );

}
