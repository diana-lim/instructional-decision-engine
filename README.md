# instructional-decision-engine
A constraint-aware instructional planning engine that generates structured lesson approaches based on classroom conditions such as time, behavior, and language needs. Designed as a rule-driven, extensible system that reduces teacher cognitive load through deterministic lesson structuring.

## Project Overview
Teachers face constant cognitive and emotional load when planning lessons. This project provides a constraint-aware decision support system that helps educators structure lessons efficiently and adaptively.

**Key goals for the V1 portfolio version:**

- Generate structured lesson plans based on high-level inputs
- Incorporate classroom constraints like behavior, time, and language support
- Suggest differentiation tiers and anticipate friction points
- Build a foundation for future reflection and adaptation loops

<!-- V1 is focused on the planning engine. Reflection and iterative feedback layers are planned for future versions. -->

## Monorepo Structure
```
instructional-decision-engine/
│
├── frontend/        # React + TypeScript UI for lesson plan display
├── backend/         # Node.js API + TypeScript rule engine
├── README.md        # Project documentation
└── LICENSE          # MIT License
```
## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js + TypeScript
- Rule Engine: TypeScript, config-driven, deterministic
- Future: Python module for batch processing and ML-based adaptations

## Getting Started

1. Clone the repo:

- git clone https://github.com/<your-username>/instructional-decision-engine.git

2. Navigate into the frontend folder and install dependencies:

- cd frontend
- npm install

3. Navigate into the backend folder and install dependencies:

- cd ../backend
- npm install

4. Start frontend and backend separately (details to follow as V1 develops)

## Future Plans

- Add lesson reflection loop for adaptive planning
- Introduce multiple task types (skill, conceptual reasoning, performance)
- Expand rule engine to incorporate standards and curriculum-specific logic
- Enable persistent storage and multi-class support
- Explore Python module integration for batch planning and ML suggestions

## License

MIT License


