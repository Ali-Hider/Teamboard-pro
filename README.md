# TeamBoard Pro

A full-stack multi-tenant SaaS project management application built with Node.js, Express, MongoDB, and React.

Organizations can manage their team, projects, and tasks from a single workspace with role-based access control.

---

## Live Architecture
```
React Frontend (Vite)
        ↓
Axios (JWT interceptor)
        ↓
Express REST API
        ↓
Middleware (Auth + Role)
        ↓
Controllers (Business Logic)
        ↓
Mongoose ODM
        ↓
MongoDB Atlas
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS |
| State Management | Redux Toolkit |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT (JSON Web Token) |
| Password Security | bcrypt |
| Email | Resend |
| Validation | Joi |

---

## Features

### Authentication
- Company + admin user created on signup in one request
- JWT authentication with role, name, and companyId in payload
- Invite-based onboarding — admin invites users via email with a secure token link
- Protected routes on both frontend and backend

### Role Based Access Control

| Action | Admin | Manager | Member |
|--------|-------|---------|--------|
| View projects | ✅ | ✅ | ✅ |
| Create / Edit / Delete projects | ✅ | ✅ | ❌ |
| View tasks | ✅ | ✅ | ✅ |
| Create tasks | ✅ | ✅ | ❌ |
| Update any task status | ✅ | ✅ | ❌ |
| Update own task status | ✅ | ✅ | ✅ |
| Invite team members | ✅ | ❌ | ❌ |
| View team members | ✅ | ✅ | ✅ |

### Multi-Tenant Architecture
- Every database query filters by `companyId`
- Complete data isolation between companies

### Soft Delete Strategy
- Projects and tasks use `isDeleted: true` instead of permanent deletion
- Deleting a project cascades soft delete to all its tasks

### Pagination
- Projects and tasks support `?page=1&limit=10` query params
- Response includes `total`, `totalPages`, `page`

---

## Project Structure
```
teamboard-pro/
│
├── server/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── userController.js
│       │   ├── projectController.js
│       │   └── taskController.js
│       ├── middlewares/
│       │   ├── authMiddleware.js
│       │   ├── roleMiddleware.js
│       │   └── errorHandler.js
│       ├── models/
│       │   ├── Company.js
│       │   ├── User.js
│       │   ├── Project.js
│       │   └── Task.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── userRoutes.js
│       │   ├── projectRoutes.js
│       │   └── taskRoutes.js
│       └── utils/
│           └── sendEmail.js
│
└── client/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── api/
        │   ├── axiosInstance.js
        │   ├── auth.js
        │   ├── users.js
        │   ├── projects.js
        │   └── tasks.js
        ├── components/
        │   ├── Layout.jsx
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── Footer.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── RoleGuard.jsx
        │   └── Pagination.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   └── ToastContext.jsx
        ├── pages/
        │   ├── Landing.jsx
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── SetPassword.jsx
        │   ├── Dashboard.jsx
        │   ├── Projects.jsx
        │   ├── Tasks.jsx
        │   └── Team.jsx
        └── store/
            ├── store.js
            ├── projectsSlice.js
            └── tasksSlice.js
```

---

## API Endpoints

### Auth
```
POST /api/auth/signup     — create company + admin user
POST /api/auth/login      — login and receive JWT
```

### Users
```
POST   /api/users               — admin only, invite user via email
POST   /api/users/set-password  — public, set password from invite token
GET    /api/users               — authenticated, get all company members
```

### Projects
```
POST   /api/projects      — admin/manager
GET    /api/projects      — all roles, paginated
PUT    /api/projects/:id  — admin/manager
DELETE /api/projects/:id  — admin/manager, soft delete + cascades tasks
```

### Tasks
```
POST   /api/tasks         — admin/manager
GET    /api/tasks         — all roles, paginated
PATCH  /api/tasks/status  — all roles (members only own tasks)
```

---

## Data Models

### JWT Payload
```json
{
  "id": "userId",
  "companyId": "companyId",
  "role": "admin | manager | member",
  "name": "User Name"
}
```

### Request / Response Examples

**Signup**
```
POST /api/auth/signup
Body: { companyName, name, email, password }
Response: { message, token }
```

**Login**
```
POST /api/auth/login
Body: { email, password }
Response: { token }
```

**Create Project**
```
POST /api/projects
Headers: Authorization: Bearer <token>
Body: { name, description }
Response: { project }
```

**Create Task**
```
POST /api/tasks
Headers: Authorization: Bearer <token>
Body: { title, description, projectId, assignedTo }
Response: { task }
```

**Update Task Status**
```
PATCH /api/tasks/status
Headers: Authorization: Bearer <token>
Body: { taskId, status }
Response: { task }
```

---

## Local Setup

### Prerequisites
- Node.js
- MongoDB Atlas account
- Resend account (for email invites)

### Backend
```bash
cd server
npm install
```

Create `server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=http://localhost:5173
```
```bash
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Database Indexes

Indexes added for query performance:

| Model | Index |
|-------|-------|
| User | `inviteToken` |
| Project | `companyId + isDeleted` |
| Task | `companyId + isDeleted`, `projectId`, `assignedTo` |

---

## Future Improvements

- Real-time updates with WebSockets
- Redis caching for frequently accessed data
- API rate limiting on auth endpoints
- Refresh token mechanism
- Docker containerization
- CI/CD pipeline
- Swagger API documentation
- File attachments on tasks

---

## Author

Built as a full-stack portfolio project to demonstrate:
- REST API design and backend architecture
- Multi-tenant SaaS data modeling
- JWT authentication and role-based access control
- React frontend architecture with Redux and Context
- Full stack integration