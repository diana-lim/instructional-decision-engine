import LessonPlanDisplay from "../components/LessonPlanDisplay";
import { useState } from "react";
import '../App.css';


export default function LessonPlanPage() {
  const [grade, setGrade] = useState('5');
  const [time, setTime] = useState<number>(25);
  const [challenges, setChallenges] = useState('ELL, Behavior');
  const [submittedParams, setSubmittedParams] = useState({
    grade: '5',
    time: 25,
    challenges: 'ELL,Behavior'
  });

  const handleGenerate = () => {
    setSubmittedParams({ grade, time, challenges });
  };
  
  

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
          <label>Time (minutes)</label>
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
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

        <button className="generate-btn" onClick={handleGenerate}>
          Generate Lesson
        </button>
      </div>

      <LessonPlanDisplay
        grade={submittedParams.grade}
        time={submittedParams.time}
        challenges={submittedParams.challenges}
      />

    </div>
  );

}
