
# Queue Cure

Queue Cure is a live clinic queue management system for small and medium outpatient setups.

![Preview](https://github.com/user-attachments/assets/e14da8ba-5e76-47d4-874d-220731dbc4a5)

### [Live Demo](https://queuecure.tanujsharma.me)

## Problem

Small clinics still manage queues manually.

- Patients repeatedly ask reception about their turn.
- Waiting room displays are often not live.
- Doctors and receptionists lack real-time visibility.
- Patients cannot estimate waiting time.

## Solution

Queue Cure digitizes the entire outpatient queue.

- Receptionists issue tokens instantly.
- Waiting room displays update automatically.
- Patients track their token in real time.
- Wait time is calculated using actual historical data.

## Impact

- Reduced receptionist interruptions.
- Better patient experience.
- Transparent queue visibility.
- No manual refresh required.

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

## Architecture Design
```
                   ┌─────────────────┐
                   │ Receptionist UI │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Express API     │
                   │ Queue Service   │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ MongoDB         │
                   └────────┬────────┘
                            │
                    queueUpdated Event
                            │
                            ▼
                   ┌─────────────────┐
                   │ Socket.IO Server│
                   └──────┬─────┬────┘
                          │     │
             ┌────────────┘     └────────────┐
             ▼                               ▼
    ┌────────────────┐             ┌────────────────┐
    │ Waiting Screen │             │ Patient Screen │
    └────────────────┘             └────────────────┘
```

## Socket Diagram

```
               Receptionist
                     │
                     │ Add Patient
                     ▼
               Backend API
                     │
                     │ Save Token
                     ▼
                  MongoDB
                     │
                     │ Success
                     ▼
               Queue Service
                     │
                     │ emit("queueUpdated")
                     ▼
               Socket.IO Server
                     │
               ┌─────┴─────────────┐
               ▼                   ▼
         Waiting Room      Patient Tracker
            Display           Screen

                  Refetch Queries
                  Update UI
```

## Tech Stack

- Frontend: React, TypeScript, Vite, TanStack Query, Socket.IO Client, Tailwind CSS v4, shadcn/ui
- Backend: Node.js, Express, TypeScript, MongoDB (Mongoose), Socket.IO
- Auth: JWT via HTTP-only cookie


## Wait Time Logic

Estimated wait is data-driven:

1. Fetch recent tokens.
2. Keep the latest called tokens (up to 5).
3. Compute average wait per token from calledAt - issuedAt.
4. Multiply by patient position in waiting list.

This avoids fixed hardcoded wait estimates.


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
- `GET /health`

### User
- `POST /api/users/signup`
- `POST /api/users/login`
- `POST /api/users/logout`
- `GET /api/users/me`

### Queue
- `GET /api/queues`
- `POST /api/queues`
- `GET /api/queues/:queueId/call-next`
- `GET /api/queues/:queueId/end-current`

### Token
- `GET /api/tokens`
- `GET /api/tokens/:token`
- `POST /api/tokens`
- `PUT /api/tokens/:token`
- `DELETE /api/tokens/:token`

### Stats
- `GET /api/stats`