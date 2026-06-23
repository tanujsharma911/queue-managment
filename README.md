
# Queue Cure

Queue Cure is a live clinic queue management system for small and medium outpatient setups.

It gives:
- receptionists a fast control panel to add patients and call the next token,
- a large-screen waiting room display that updates live,
- and a patient-facing token tracker with real-time position and estimated wait.

One-sentence demo moment:
When the receptionist clicks Call Next, the waiting room TV and the patient phone view update instantly without refresh, showing the new token in room.

## Product Goals and Outcomes

1. Can a receptionist add a patient and assign a token in under 10 seconds?
   - Yes. The receptionist flow is designed as a short form (name + queue + add).
2. Does the patient-facing screen update live without page refresh?
   - Yes. Socket events push queue updates to connected clients.
3. Is estimated wait time computed from real data and not hardcoded?
   - Yes. Wait time is calculated from recent real token history (called timestamps), then multiplied by the patient queue position.

## Screens

1. Receptionist view
   - Add patient to queue.
   - Call next token in each room.
   - End current token.
   - Filter and sort live queue table.
   - View live operational stats.

2. Waiting room display
   - Shows each room and currently active token.
   - Auto-refreshes based on live events.

3. Patient token view
   - Search by token.
   - Shows queue name, token in room, position in queue, and estimated wait.
   - Live status badge updates.

## Tech Stack

- Frontend: React, TypeScript, Vite, TanStack Query, Socket.IO Client, Tailwind CSS v4, shadcn/ui
- Backend: Node.js, Express, TypeScript, MongoDB (Mongoose), Socket.IO
- Auth: JWT via HTTP-only cookie

## Real-Time Design

1. Backend queue operations emit queueUpdated events.
2. Socket.IO server forwards updates to connected clients.
3. Frontend screens listen for queueUpdated and refresh relevant query data.

This keeps receptionist, waiting room display, and patient view in sync.

## Wait Time Logic

Estimated wait is data-driven:

1. Fetch recent tokens from today and yesterday.
2. Keep the latest called tokens (up to 5).
3. Compute average wait per token from calledAt - issuedAt.
4. Multiply by patient position in waiting list.

This avoids fixed hardcoded wait estimates.

## Monorepo Structure

```text
queue_cure/
  client/   # React frontend
  server/   # Express + MongoDB + Socket.IO backend
```

## Local Setup

### Prerequisites

- Node.js 20+
- pnpm
- MongoDB running locally or a MongoDB URI

### 1) Clone and install

```bash
git clone <your-repo-url>
cd queue_cure

cd server && pnpm install
cd ../client && pnpm install
```

### 2) Configure environment variables

Server env file at server/.env:

```env
PORT=3000
CLIENT_URL=http://localhost:5173
DB_URL=mongodb://127.0.0.1:27017
ACCESS_TOKEN_SECRET=your-secret
ACCESS_TOKEN_EXPIRY=1h
```

Client env file at client/.env:

```env
VITE_HTTP_URL=http://localhost:3000
```

### 3) Optional mock data seed

```bash
cd server
pnpm run seed
```

### 4) Run backend and frontend

Terminal 1:

```bash
cd server
pnpm run dev
```

Terminal 2:

```bash
cd client
pnpm run dev
```

## App Routes

- / : Home
- /login : Receptionist login
- /receptionist : Receptionist dashboard
- /queues : Public waiting room display
- /client : Patient token tracker

## API Endpoints

### Health
- GET /health

### User
- POST /api/users/signup
- POST /api/users/login
- POST /api/users/logout
- GET /api/users/me

### Queue
- GET /api/queues
- POST /api/queues
- GET /api/queues/:queueId/call-next
- GET /api/queues/:queueId/end-current

### Token
- GET /api/tokens
- GET /api/tokens/:token
- POST /api/tokens
- PUT /api/tokens/:token
- DELETE /api/tokens/:token

### Stats
- GET /api/stats

## UI and Theme

- Includes light, dark, and system theme modes.
- Theme is persisted in local storage.

## Demo Checklist

1. Login as receptionist and add a patient token.
2. Open waiting room display in a second tab.
3. Open patient token view in a third tab and track the same token.
4. Click Call Next on receptionist dashboard.
5. Verify live update on both waiting room and patient token view.