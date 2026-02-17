import LessonPlanDisplay from "../components/LessonPlanDisplay";
import { useState } from "react";

export default function LessonPlanPage() {
  const [grade, setGrade] = useState('5');
  const [time, setTime] = useState<number>(25);
  const [challenges, setChallenges] = useState('ELL, Behavior');

  return (
    <div className="LessonPlanPage">
      <h1>Instructional Decision Engine</h1>
      <div className="teacher-inputs">
        <label>
          Grade:
          <input 
            type="text" 
            value={grade} 
            onChange={(e) => setGrade(e.target.value)} 
          />
        </label>

        <label>
          Time (minutes):
          <input 
            type="number" 
            value={time} 
            onChange={(e) => setTime(Number(e.target.value))} 
          />
        </label>

        <label>
          Challenges:
          <input 
            type="text" 
            value={challenges} 
            onChange={(e) => setChallenges(e.target.value)} 
          />
        </label>
      </div>

      <LessonPlanDisplay 
        grade={grade} 
        time={time} 
        challenges={challenges} 
      />
      <LessonPlanDisplay grade={grade} time={time} challenges={challenges} />
    </div>
  );

}
