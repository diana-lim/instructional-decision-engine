import express from 'express';
import { LessonPlan, LessonPhase } from './types/lessonPlan';
import cors from "cors";


const app = express();
const PORT = 3000;

app.use(cors());

// Dummy lesson plan
const sampleLessonPlan: LessonPlan = {
    lessonId: 'lesson-001',
    gradeLevel: '5',
    curriculumUnit: 'Fractions',
    timeMinutes: 45,
    classroomChallenges: ['ELL', 'Behavior'],
    lessonPlan: [
      {
        phaseId: 'phase-1',
        title: 'Introduction / Hook',
        durationMinutes: 5,
        description: 'Quick story or visual to engage students',
        differentiation: {
          ELL: 'Use visuals and gestures',
          Behavior: 'Call on students in predictable order',
        },
        frictionPoints: [
          'Some students may be distracted',
          'ELL students may need extra clarification'
        ],
        formativeChecks: ['Ask 1-2 quick comprehension questions']
      },
      {
        phaseId: 'phase-2',
        title: 'Direct Instruction / Modeling',
        durationMinutes: 15,
        description: 'Model problem-solving with fractions',
        differentiation: {
          ELL: 'Use simple language, provide sentence starters',
          Behavior: 'Keep students on task with clear expectations'
        },
        frictionPoints: ['Students may struggle with abstract reasoning'],
        formativeChecks: ['Check for correct problem setup']
      },
      {
        phaseId: 'phase-3',
        title: 'Guided Practice',
        durationMinutes: 15,
        description: 'Students practice with teacher support',
        differentiation: {
          ELL: 'Pair with bilingual peer or scaffold worksheet',
          Behavior: 'Short work intervals with movement breaks'
        },
        frictionPoints: ['Students might rush or get frustrated'],
        formativeChecks: ['Observe student work and provide hints']
      },
      {
        phaseId: 'phase-4',
        title: 'Independent / Closure',
        durationMinutes: 10,
        description: 'Independent practice and wrap-up discussion',
        differentiation: {
          ELL: 'Provide sentence frames for reflection',
          Behavior: 'Give clear expectations for independent work'
        },
        frictionPoints: ['Some students may need additional support'],
        formativeChecks: ['Collect exit tickets or quick questions']
      }
    ]
  };  

// Endpoint
app.get('/', (req, res) => {
    res.send('Instructional Decision Engine API is running 💙');
  });

app.get('/generateLessonPlan', (req, res) => {
  res.json(sampleLessonPlan);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
