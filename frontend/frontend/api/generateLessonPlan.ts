import { generateLessonPlan } from '../../../backend/src/engine/generateLessonPlan';

function setCorsHeaders(res: any) {
  // Allow your main product to call this planner from a different origin.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const grade = (req.query.grade as string | undefined) ?? '5';
  const curriculumUnit = (req.query.curriculumUnit as string | undefined) ?? 'Sample Unit';
  const time = Number(req.query.time as string | undefined) || 45;
  const challengesParam = req.query.challenges as string | undefined;
  const challenges = challengesParam ? challengesParam.split(',') : [];

  const lesson = generateLessonPlan(grade, curriculumUnit, time, challenges);
  res.status(200).json(lesson);
}

