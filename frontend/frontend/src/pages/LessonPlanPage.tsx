import LessonPlanDisplay from "../components/LessonPlanDisplay";
import { useState } from "react";
import '../App.css';
import type { LessonPlanDisplayProps } from "../types/lesson";

const CHALLENGE_OPTIONS = ["ELL", "Behavior", "Reading Gaps"] as const;

export default function LessonPlanPage() {
  const [grade, setGrade] = useState('');
  const [curriculumUnit, setCurriculumUnit] = useState('');
  const [time, setTime] = useState<number | ''>('');
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [challengeSelectValue, setChallengeSelectValue] = useState('');
  const [additionalChallenges, setAdditionalChallenges] = useState('');
  const [submittedParams, setSubmittedParams] = useState<LessonPlanDisplayProps | null>(null);

  const handleRemoveChallenge = (challengeToRemove: string) => {
    setSelectedChallenges((prev) => prev.filter((challenge) => challenge !== challengeToRemove));
  };

  const handleGenerate = () => {
    const customChallenges = additionalChallenges
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    const combinedChallenges = Array.from(new Set([...selectedChallenges, ...customChallenges]));

    if (!grade.trim() || !curriculumUnit.trim() || time === '' || time <= 0 || combinedChallenges.length === 0) return;

    setSubmittedParams({
      grade: grade.trim(),
      curriculumUnit: curriculumUnit.trim(),
      time,
      challenges: combinedChallenges.join(','),
    });
  };

  const canGenerate =
    !!grade.trim() &&
    !!curriculumUnit.trim() &&
    time !== '' &&
    time > 0 &&
    (selectedChallenges.length > 0 || !!additionalChallenges.trim());
  
  

  return (
    <div className="LessonPlanPage">
      <h1>Generate a complete lesson plan in seconds</h1>
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
          <label>Classroom Challenges (select one or more)</label>
          <select
            value={challengeSelectValue}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                setSelectedChallenges((prev) =>
                  prev.includes(value) ? prev : [...prev, value]
                );
              }
              setChallengeSelectValue('');
            }}
            className="challenge-select"
          >
            <option value="">Choose a challenge...</option>
            {CHALLENGE_OPTIONS.map((challenge) => (
              <option key={challenge} value={challenge}>
                {challenge}
              </option>
            ))}
          </select>
          <div className="selected-challenges">
            {selectedChallenges.map((challenge) => (
              <span key={challenge} className="challenge-pill">
                {challenge}
                <button
                  type="button"
                  className="challenge-remove-btn"
                  onClick={() => handleRemoveChallenge(challenge)}
                  aria-label={`Remove ${challenge}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label>Additional Challenges (optional, comma-separated)</label>
          <input
            type="text"
            value={additionalChallenges}
            onChange={(e) => setAdditionalChallenges(e.target.value)}
            placeholder="e.g., Attendance, Limited Materials"
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
