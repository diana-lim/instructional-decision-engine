import express from 'express';
import { LessonPlan, LessonPhase } from './types/lessonPlan';
import { generateLessonPlan } from './engine/generateLessonPlan';
import cors from "cors";


const app = express();
const PORT = 3000;

app.use(cors());

// Endpoints
app.get('/', (req, res) => {
    res.send('Instructional Decision Engine API is running 💙');
  });

app.get('/generateLessonPlan', (req, res) => {
    const grade = (req.query.grade as string) || '5';
    const time = Number(req.query.time) || 45;
    const challenges =
        (req.query.challenges as string)?.split(',') || [];

    const lesson = generateLessonPlan(grade, time, challenges);

    res.json(lesson);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
