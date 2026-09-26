# Interview Journal (Intervyuh)

A personal interview tracking and reflection tool for students. Log every interview in a couple of minutes, reflect on what went well and what didn't, and let recurring weaknesses surface automatically over time.

This is a personal learning journal, not a job board, resume builder, or social platform.

## Core loop

Prepare → Interview → Reflect → Learn → Improve → Repeat

## Features

- Email/password authentication with JWT-protected routes
- Log an interview (company, role, date, round, result, rating) with a focused reflection section
- Dashboard with key stats, recent interviews, and a rotating quick insight
- Search, filter (result/round), and sort your interview history
- Insights page: performance trend chart, average scores, and recurring-weakness detection using plain keyword matching (no external AI)
- "Learn From Your Previous Interviews" reminder pulled from your own past reflections
- Before-the-interview checklist
- CSV export of your full interview history
- Light/dark mode, mobile-responsive layout with a bottom nav on small screens
- Seed script preloading 5 real interview records for a demo user

## Tech stack

- **Frontend:** React, Vite, Tailwind CSS v4, React Router, Recharts, Lucide icons
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Auth:** bcrypt password hashing, JWT

## Project structure

```text
interview-journal/
├── client/               React app (Vite)
│   └── src/
│       ├── components/   Reusable UI (Button, Card, Field, InterviewForm, ...)
│       ├── pages/         Route-level pages
│       ├── layouts/       AppLayout (top nav) and AuthLayout
│       ├── context/        Auth and theme context
│       ├── hooks/          Data-fetching hooks
│       ├── services/       API client wrappers
│       └── utils/          Constants, formatting, CSV export
├── server/                Express API
│   ├── controllers/
│   ├── models/            User, Interview (Mongoose schemas)
│   ├── routes/
│   ├── middleware/         auth (JWT), error handling
│   ├── services/            insightsService (keyword-based weakness detection)
│   ├── scripts/seed.js      Demo data seed script
│   └── utils/
├── .env.example
└── README.md
```

## Local setup

### 1. Database

You need a MongoDB instance — either a local install or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster. Copy the connection string.

### 2. Backend

```bash
cd server
npm install
cp ../.env.example .env
```

Edit `server/.env` and set at least `MONGODB_URI` and `JWT_SECRET`.

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

Seed demo data (creates a demo user + 5 real interview records, safe to re-run):

```bash
npm run seed
```

Demo login after seeding:

- Email: `demo@intervyuh.app`
- Password: `demo1234`

### 3. Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The app runs on `http://localhost:5173` and expects the API at `http://localhost:5000/api` (configurable via `VITE_API_URL`).

## Environment variables

**Root `.env.example` (copy into `server/.env`):**

| Variable | Description |
| --- | --- |
| `PORT` | API port (default 5000) |
| `NODE_ENV` | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs — use a long random string |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Frontend origin, used for CORS |

**`client/.env.example`:**

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Base URL of the API, e.g. `http://localhost:5000/api` |

## API overview

All interview and insights routes require `Authorization: Bearer <token>`.

```text
POST   /api/auth/register       Create an account
POST   /api/auth/login          Log in, returns a JWT
GET    /api/auth/me             Current user

GET    /api/interviews          List interviews (supports ?search=&result=&round=&sort=)
POST   /api/interviews          Create an interview
GET    /api/interviews/:id      Get one interview
PUT    /api/interviews/:id      Update an interview
DELETE /api/interviews/:id      Delete an interview

GET    /api/insights            Performance trend, averages, recurring weaknesses, improvement focus
```

Every interview is scoped to the authenticated user — there is no way to read or modify another user's data.

## What's implemented

- Full auth flow (register/login/me) with hashed passwords and JWT
- Interview CRUD, scoped per user, with server-side validation
- Search, filter, and sort on the interviews list
- Insights: line chart of rating over time, overall vs. recent-5 averages, keyword-based recurring weakness detection, and a single actionable "improvement focus"
- Pre-interview checklist (local to the browser) and a "previous mistakes" reminder sourced from past reflections
- CSV export of all interviews
- Dark mode with persisted preference
- Loading skeletons, empty states, and error states across all main pages
- Security basics: helmet, CORS restricted to the client origin, rate limiting on auth endpoints, input validation, no plaintext passwords

## Known limitations

- "Forgot password" is a placeholder UI flow — no email is actually sent. Wire up a transactional email provider (e.g. Resend, SendGrid) in `server/controllers/authController.js` and add a token-based reset endpoint to make it functional.
- Recurring-weakness detection is plain keyword matching by design (V1 explicitly excludes AI). It works best once you've logged a handful of interviews with a few sentences of reflection each.
- No pagination on the interviews list; fine for personal use, but would need adding if the list grows very large.

## Deployment

- **Backend:** deploy `server/` to any Node host (Render, Railway, Fly.io). Set the environment variables above, including a production `MONGODB_URI` (Atlas) and a strong `JWT_SECRET`.
- **Frontend:** deploy `client/` to a static host (Vercel, Netlify). Set `VITE_API_URL` to your deployed API's `/api` URL, and set the API's `CLIENT_URL` to your deployed frontend's origin so CORS allows it.

## Future ideas (not in V1)

AI-powered interview analysis, AI-generated prep questions, voice mock interviews, a real question bank, and personalized prep plans are intentionally out of scope for V1 but the architecture (a dedicated `insightsService`, a clean REST API) leaves room to add them later.
