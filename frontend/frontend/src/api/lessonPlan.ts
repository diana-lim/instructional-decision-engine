const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export function fetchLessonPlan(query: string) {
  return fetch(`${BASE_URL}/generateLessonPlan${query}`)
    .then((res) => res.json());
}

