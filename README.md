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
├── frontend/
│   └── frontend/    # React + TypeScript UI (Vite app lives here)
├── backend/         # Node.js API + TypeScript rule engine
├── README.md
└── LICENSE
```

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js + TypeScript
- Rule Engine: TypeScript, config-driven, deterministic
- Future: Python module for batch processing and ML-based adaptations

## Getting Started

**Prerequisites:** Node.js and npm (LTS recommended).

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/instructional-decision-engine.git
cd instructional-decision-engine
```

### 2. Backend (API + rule engine)

```bash
cd backend
npm install
npm run dev
```

Runs at **http://localhost:3000** by default. Health check: `GET /`.

**Run engine tests:**

```bash
cd backend
npm test
```

### 3. Frontend (Vite + React)

In a **second terminal**, from the repo root:

```bash
cd frontend/frontend
npm install
```

**Environment:** the UI needs a **`frontend/frontend/.env`** file so Vite can read `VITE_BACKEND_URL` (no trailing slash). After `npm install`, copy the committed template:

```bash
# inside frontend/frontend
cp .env.example .env
```

Edit `.env` if your API is not at `http://localhost:3000`. Alternatively you can create `.env` manually with the same variable names as `.env.example`.

Start the dev server:

```bash
npm run dev
```

Vite usually serves the app at **http://localhost:5173**. Open that URL, fill in the form, and click **Generate Lesson** (the backend must be running).

> **Note:** `.env` is for your machine and may contain secrets—don’t commit it. **`.env.example`** is safe to commit (placeholder values only).

## Future Plans

- Add lesson reflection loop for adaptive planning
- Introduce multiple task types (skill, conceptual reasoning, performance)
- Expand rule engine to incorporate standards and curriculum-specific logic
- Enable persistent storage and multi-class support
- Explore Python module integration for batch planning and ML suggestions

## License

MIT License


