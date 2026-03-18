import type { LessonPlan } from '../types/lesson';

const BASE_URL = import.meta.env.VITE_BACKEND_URL as string | undefined;

export async function fetchLessonPlan(query: string): Promise<LessonPlan> {
  if (!BASE_URL) {
    throw new Error('VITE_BACKEND_URL is not set (frontend .env).');
  }

  const res = await fetch(`${BASE_URL}/generateLessonPlan${query}`);
  if (!res.ok) {
    const bodyText = await res.text().catch(() => '');
    const detail = bodyText ? `: ${bodyText}` : '';
    throw new Error(`Failed to fetch lesson plan (${res.status} ${res.statusText})${detail}`);
  }

  return (await res.json()) as LessonPlan;
}

