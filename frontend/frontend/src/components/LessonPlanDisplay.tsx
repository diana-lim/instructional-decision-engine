import { useEffect, useState } from 'react';
import { fetchLessonPlan } from '../api/lessonPlan';
import type { LessonPlan, LessonPlanDisplayProps } from '../types/lesson';
import { buildMailtoLessonPlan, formatLessonPlanAsText } from '../utils/lessonPlanExport';
import '../App.css';

function copyTextFallback(text: string): boolean {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try {
    return document.execCommand('copy');
  } finally {
    document.body.removeChild(ta);
  }
}

export default function LessonPlanDisplay({ grade, curriculumUnit, time, challenges }: LessonPlanDisplayProps) {
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
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

  useEffect(() => {
    if (copyStatus === 'idle') return;
    const t = window.setTimeout(() => setCopyStatus('idle'), 2500);
    return () => window.clearTimeout(t);
  }, [copyStatus]);

  const handleCopy = async () => {
    if (!lessonPlan) return;
    const text = formatLessonPlanAsText(lessonPlan);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (!copyTextFallback(text)) {
        throw new Error('Clipboard unavailable');
      }
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  if (error) return <div>Failed to load lesson: {error}</div>;

  if (isLoading && !lessonPlan) return <div>Loading lesson...</div>;
  if (!lessonPlan?.lessonPlan?.length) return <div>No lesson phases found</div>;

  const mailtoHref = buildMailtoLessonPlan(lessonPlan);

  return (
    <div className="lesson-plan-display">
      <div className="lesson-export-toolbar no-print">
        <button type="button" className="export-btn export-btn-primary" onClick={handlePrintPdf}>
          Download as PDF
        </button>
        <button type="button" className="export-btn" onClick={handleCopy}>
          {copyStatus === 'copied' ? 'Copied!' : copyStatus === 'failed' ? 'Copy failed — try again' : 'Copy to clipboard'}
        </button>
        <a className="export-btn export-link" href={mailtoHref}>
          Email to self
        </a>
        <p className="export-hint">
          PDF uses your browser&apos;s print dialog — choose <strong>Save as PDF</strong> as the destination.
        </p>
      </div>

      <div className="lesson-print-area">
        <h2>Grade: {lessonPlan.gradeLevel}</h2>
        <div className="lesson-plan-meta-line">
          Unit: {lessonPlan.curriculumUnit} | Time: {lessonPlan.timeMinutes} min
        </div>
        {lessonPlan.lessonPlan.map((phase) => (
          <div key={phase.phaseId} className="lesson-phase-card">
            <h3>
              {phase.title} ({phase.durationMinutes} min)
            </h3>
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
    </div>
  );
}
