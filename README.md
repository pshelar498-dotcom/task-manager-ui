# Task Manager UI

React frontend for the **Task Manager API** (`C:\projects\task-manager-api`).

## Tech stack
React 19 · Vite · React Router · Axios · Tailwind CSS · lucide-react · react-hot-toast

## Run it
1. Start the API first (in `C:\projects\task-manager-api`): `npm run dev` → http://localhost:5000
2. Start the UI (in this folder): `npm run dev` → http://localhost:5173

The UI calls the API at `VITE_API_URL` (set in `.env`, default `http://localhost:5000/api`).
The API allows the UI's origin (`http://localhost:5173`) with CORS in `task-manager-api/src/app.js`.

## Pages
| URL | Page | Access |
|---|---|---|
| `/login` | Log in | Guests |
| `/register` | Create account | Guests |
| `/` | Dashboard: stats, search, sort, create/edit/delete tasks, quick status change | Logged in |
| `/profile` | Update profile, change password, delete account | Logged in |
| `/admin/users` | List and delete users | Admin only |

## Folder structure
```
src/
├── api/              HTTP calls to the backend (axios + token interceptor)
├── components/
│   ├── common/       Button, Input, Modal, ConfirmDialog, Avatar, Spinner...
│   ├── layout/       Navbar, Layout, AuthLayout
│   └── tasks/        TaskCard, TaskForm, TaskFilter, TaskStats
├── context/          AuthContext (logged-in user, login/logout)
├── pages/            One component per screen
├── routes/           ProtectedRoute, AdminRoute, GuestRoute
├── utils/            Date formatting, task status config
├── App.jsx           Routes
├── main.jsx          Entry point
└── index.css         Tailwind
```
