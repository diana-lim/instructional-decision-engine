import { useEffect, useRef, useState } from 'react';
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
  const [exportOpen, setExportOpen] = useState(false);
  const exportWrapRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!exportOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (exportWrapRef.current && !exportWrapRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExportOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [exportOpen]);

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
      <div className="lesson-export-bar no-print">
        <div className="lesson-export-wrap" ref={exportWrapRef}>
          <button
            type="button"
            className="lesson-export-trigger"
            aria-expanded={exportOpen}
            aria-haspopup="menu"
            onClick={() => setExportOpen((open) => !open)}
          >
            Export Lesson
          </button>
          {exportOpen && (
            <div className="lesson-export-dropdown" role="menu">
              <button
                type="button"
                role="menuitem"
                className="lesson-export-menu-item"
                onClick={() => {
                  setExportOpen(false);
                  handlePrintPdf();
                }}
              >
                Download as PDF
              </button>
              <button
                type="button"
                role="menuitem"
                className="lesson-export-menu-item"
                onClick={async () => {
                  await handleCopy();
                  setExportOpen(false);
                }}
              >
                {copyStatus === 'copied'
                  ? 'Copied!'
                  : copyStatus === 'failed'
                    ? 'Copy failed — try again'
                    : 'Copy to clipboard'}
              </button>
              <a
                role="menuitem"
                className="lesson-export-menu-item lesson-export-menu-link"
                href={mailtoHref}
                onClick={() => setExportOpen(false)}
              >
                Email to self
              </a>
              <p className="lesson-export-dropdown-hint">
                PDF: use print dialog → <strong>Save as PDF</strong>. Turn off <strong>Headers and footers</strong> to
                hide the browser URL and page numbers.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="lesson-print-area">
        <header className="lesson-plan-header">
          <h2 className="lesson-plan-main-title">{lessonPlan.curriculumUnit} Lesson</h2>
          <div className="lesson-plan-subtitle">
            <span>Grade: {lessonPlan.gradeLevel}</span>
            <span className="lesson-plan-subtitle-sep" aria-hidden="true">
              {' '}
              ·{' '}
            </span>
            <span>Unit: {lessonPlan.curriculumUnit}</span>
            <span className="lesson-plan-subtitle-sep" aria-hidden="true">
              {' '}
              ·{' '}
            </span>
            <span>Time: {lessonPlan.timeMinutes} min</span>
          </div>
        </header>
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

      <footer className="lesson-print-footer">
        <p className="lesson-print-footer-inner">
          Create, save, and edit lessons faster{' '}
          <span className="lesson-print-footer-sep" aria-hidden="true">
            ·{' '}
          </span>
          <a href="https://www.teacherslobby.com/" target="_blank" rel="noopener noreferrer">
            https://www.teacherslobby.com/
          </a>
        </p>
      </footer>
    </div>
  );
}
