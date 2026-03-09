# TeamBoard Pro – Backend API

⚠️ **Frontend implementation is currently in progress.**
This repository currently contains the **backend REST API** for the system.

---

# Project Overview

TeamBoard Pro is a **multi-tenant project management backend system** built with **Node.js, Express, and MongoDB**.

It allows organizations to manage:

* Companies
* Users
* Projects
* Tasks

The system demonstrates **real-world backend engineering practices** such as:

* JWT Authentication
* Role-Based Authorization
* Multi-tenant architecture
* Soft deletion strategy
* Pagination for scalable data retrieval
* Modular Express architecture

The goal of this project is to demonstrate **backend system design and API architecture similar to production SaaS applications**.

---

# System Architecture

The backend follows a **layered architecture** separating routing, middleware, controllers, and database models.

Architecture overview:

```
Client Application
        ↓
 Express Router Layer
        ↓
Middleware Layer (Authentication / Authorization)
        ↓
 Controller Layer (Business Logic)
        ↓
   Model Layer (Mongoose ODM)
        ↓
 MongoDB Database
```

Architectural Principles Used

- Separation of concerns
- Modular route handling
- Middleware-driven request pipeline
- Controller-based business logic
- Model-driven data management
---

# Request Lifecycle

A typical API request follows this flow:

```
Request
→ Express Route
→ Authentication Middleware
→ Authorization Middleware
→ Controller Logic
→ Database Query via Mongoose
→ JSON Response
```

This structure keeps the application **modular, maintainable, and scalable**.

---

# Core Features

## Authentication

The system uses **JWT (JSON Web Token)** authentication.

Features:

* Secure password hashing using **bcrypt**
* JWT token generation during login
* Protected routes using authentication middleware

Authentication Flow:

```
User Login
    ↓
Password Verification
    ↓
JWT Token Generated
    ↓
Client Stores Token
    ↓
Token Used for Future API Requests
```

---

## Role-Based Authorization

Users belong to a company and have a **role**.

Roles supported:

* `admin`
* `manager`
* `member`

Role permissions:

**admin**
* Full system control
* Manage users, projects, and tasks

**manager**
* Create and manage projects
* Manage tasks

**member**
* View projects
* Update assigned tasks

Authorization is enforced using **middleware** before executing controller logic.

---

## Multi-Tenant Architecture

The system supports **multiple companies using the same backend infrastructure**.

Each document contains a:

* `companyId`

Every database query filters data by companyId so that users can only access their own organization's data.

Example query pattern:

```javascript
Project.find({
  companyId: req.user.companyId,
  isDeleted: false
})
```

This ensures **data isolation between companies**.

---

## Soft Deletion Strategy

Instead of permanently deleting records, the system uses **soft deletion**.

Each entity contains:

* `isDeleted: Boolean`

When a resource is deleted, this field becomes `true`.

Benefits:

* Data recovery
* Historical records
* Safer production behavior

Normal queries exclude deleted resources.

---

# Technology Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Token (JWT) |
| Password Security | bcrypt |
| Environment Management | dotenv |

---

# Folder Structure

```
server
│
├── server.js
├── package.json
│
└── src
    ├── app.js
    │
    ├── controllers
    │   ├── authController.js
    │   ├── userController.js
    │   ├── projectController.js
    │   └── taskController.js
    │
    ├── models
    │   ├── Company.js
    │   ├── User.js
    │   ├── Project.js
    │   └── Task.js
    │
    ├── routes
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── projectRoutes.js
    │   └── taskRoutes.js
    │
    ├── middlewares
    │   ├── authMiddleware.js
    │   ├── roleMiddleware.js
    │   └── errorHandler.js
    │
    └── config
        └── db.js
```

---
### Relationship Explanation

**Company**
- A company can have multiple users
- A company can have multiple projects

**User**
- Belongs to a company
- Can create projects
- Can be assigned tasks

**Project**
- Belongs to a company
- Created by a user
- Contains multiple tasks

**Task**
- Belongs to a project
- Assigned to a user
---

# Database ER Diagram

Below is the conceptual relationship between entities:

```                Company
                   │
                   │ 1 : N
                   │
        ┌──────────┴──────────┐
        │                     │
        │                     │
       User                Project
        │                     │
        │ creates             │ 1 : N
        └───────────────►     │
                              │
                              ▼
                            Task
                              │
                              │ assignedTo
                              │
                              ▼
                            User
```

---

# Database Design


## Company

Fields:

* `name`
* `subscriptionType`
* `isDeleted`

Represents an organization using the system.

---

## User

Fields:

* `name`
* `email`
* `password`
* `role`
* `companyId`
* `isDeleted`

Relationships:

* Belongs to a Company
* Can create Projects
* Can be assigned Tasks

---

## Project

Fields:

* `name`
* `description`
* `companyId`
* `createdBy`
* `status`
* `isDeleted`

Relationships:

* Belongs to a Company
* Created by a User
* Contains multiple Tasks

---

## Task

Fields:

* `title`
* `description`
* `projectId`
* `assignedTo`
* `companyId`
* `status`
* `isDeleted`

Relationships:

* Belongs to a Project
* Assigned to a User

---

# API Endpoints

## Authentication

```
POST /api/auth/signup
POST /api/auth/login
```

---

## Users

```
GET /api/users
GET /api/users/:id
PUT /api/users/:id
DELETE /api/users/:id
POST /api/users/invite
```

---

## Projects

```
GET /api/projects
POST /api/projects
GET /api/projects/:id
PUT /api/projects/:id
DELETE /api/projects/:id
```

---

## Tasks

```
GET /api/tasks
POST /api/tasks
GET /api/tasks/:id
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

---

# API Example Requests

These examples demonstrate how the API is expected to be consumed.

---

## User Registration

**Endpoint:** `POST /api/auth/signup`

**Request Body:**

```json
{
  "name": "Ali Hider",
  "email": "ali@example.com",
  "password": "123456",
  "companyName": "Tech Corp"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here"
}
```

---

## User Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "email": "ali@example.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Ali Hider",
    "role": "admin"
  }
}
```

---

## Create Project

**Endpoint:** `POST /api/projects`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**

```json
{
  "name": "Website Redesign",
  "description": "Revamp company website"
}
```

**Response:**

```json
{
  "message": "Project created successfully",
  "project": {
    "id": "project_id",
    "name": "Website Redesign"
  }
}
```

---

## Get Projects (Pagination)

**Endpoint:** `GET /api/projects?page=1&limit=10`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**

```json
{
  "totalProjects": 25,
  "currentPage": 1,
  "totalPages": 3,
  "projects": [
    {
      "id": "project_id",
      "name": "Website Redesign"
    }
  ]
}
```

---

## Create Task

**Endpoint:** `POST /api/tasks`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**

```json
{
  "title": "Design homepage",
  "description": "Create UI design for homepage",
  "projectId": "project_id",
  "assignedTo": "user_id"
}
```

**Response:**

```json
{
  "message": "Task created successfully"
}
```

---

# Data Protection Strategy

The system follows a soft delete strategy to prevent accidental data loss.

Instead of removing documents permanently:
```
isDeleted: true
```
is set when a resource is deleted.

Normal queries automatically filter:

{ isDeleted: false }

Benefits:

Data recovery

Historical tracking

Safer production behavior
---

# Pagination

Large datasets can be retrieved using pagination.

Example:

```
GET /api/projects?page=1&limit=10
```

Advantages:

* Reduces server load
* Improves performance
* Enables scalable APIs

---

# Environment Setup

Create a `.env` file inside the server folder.

```
PORT=5000

MONGODB_URI=mongodb://localhost:27017/teamboard

JWT_SECRET=your_secret_key
```

---

# Installation

**Clone the repository**

```bash
git clone <repository_url>
```

**Install dependencies**

```bash
npm install
```

**Run development server**

```bash
npm run dev
```

---

# Future Improvements

Planned improvements:

* Redis caching
* API rate limiting
* WebSocket real-time updates
* Docker containerization
* CI/CD pipeline
* API documentation with Swagger

---

# Frontend (Coming Soon)

The frontend will be built using **React**.

Planned features:

* Project dashboard
* Task management interface
* User management panel
* Role-based UI
* Responsive design

---

# Author

Backend Engineering Portfolio Project

Built to demonstrate:

* REST API design
* Backend architecture
* Authentication systems
* Multi-tenant data modeling
