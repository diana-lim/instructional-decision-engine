import LessonPlanDisplay from "../components/LessonPlanDisplay";
import { useState } from "react";

export default function LessonPlanPage() {
  const [grade, setGrade] = useState('5');
  const [time, setTime] = useState<number>(25);
  const [challenges, setChalenges] = useState('ELL, Behavior');

  return (
    <div className="LessonPlanPage">
      <h1>Instructional Decision Engine</h1>
      <LessonPlanDisplay grade={grade} time={time} challenges={challenges} />
    </div>
  );

}
