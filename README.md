# Mini Project Setup

This repo contains a minimal frontend and backend setup for simple email/password authentication.

## Frontend (`frontend/login`)

- Static HTML/CSS/JS login + signup view.
- Uses `fetch` to call the backend endpoints:
  - `POST http://localhost:4000/api/auth/signup`
  - `POST http://localhost:4000/api/auth/login`

To open it locally, simply double-click `frontend/login/index.html` or serve it with any static server.

## Backend (`backend`)

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

Create a `.env` file inside `backend` with:

```
PORT=4000
MONGO_URI=mongodb+srv://soumyaupadhyay212_db_user:L9VZHOUVh7yctX3E@cluster0.vxpqfjb.mongodb.net/?appName=Cluster0
```

### 3. Run the API

```bash
npm run dev
# or npm start
```

The server exposes:

- `POST /api/auth/signup` – create a user (name, email, password)
- `POST /api/auth/login` – login with email/password

Passwords are hashed with `bcrypt` before being stored in MongoDB Atlas.

### Connecting Frontend & Backend

Ensure the backend is running on `http://localhost:4000` for local development, then interact with the frontend form; it will hit the required endpoints automatically.

For production deployments (for example, when hosting the frontend on Vercel and your backend on Render), set the following environment variables in your hosting provider so the built frontend points to your deployed backend:

```
VITE_API_URL=https://ai-powered-interview-preparation.onrender.com
VITE_API_BASE=https://ai-powered-interview-preparation.onrender.com/api/auth
```

Note: the static login HTML reads `window.__env.VITE_API_BASE` at runtime — if you serve the login HTML directly (not via a Vite build), ensure `window.__env.VITE_API_BASE` is set at runtime as well.


