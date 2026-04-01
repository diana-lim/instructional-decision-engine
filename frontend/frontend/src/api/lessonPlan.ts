import type { LessonPlan } from '../types/lesson';

const BASE_URL = import.meta.env.VITE_BACKEND_URL as string | undefined;

export async function fetchLessonPlan(query: string): Promise<LessonPlan> {
  // Local/dev supports a separately-running Express backend.
  // Vercel can host the API in the same deployment under `/api/*`.
  const normalizedBaseUrl = BASE_URL?.trim().replace(/\/+$/, '');
  const url = normalizedBaseUrl
    ? `${normalizedBaseUrl}/generateLessonPlan${query}`
    : `/api/generateLessonPlan${query}`;

  const res = await fetch(url);
  if (!res.ok) {
    const bodyText = await res.text().catch(() => '');
    const detail = bodyText ? `: ${bodyText}` : '';
    throw new Error(`Failed to fetch lesson plan (${res.status} ${res.statusText})${detail}`);
  }

  return (await res.json()) as LessonPlan;
}

