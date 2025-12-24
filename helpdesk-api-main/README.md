# Helpdesk API — Node.js + SQLite Backend

A complete, production-ready helpdesk API built with **Node.js**, **Express**, **TypeScript**, and **SQLite**. This project demonstrates a professional layered architecture with JWT authentication, role-based access control, and comprehensive API documentation.

---

## 📋 Project Overview

### What This Project Does
- **User Management**: Register customers, login, admin-only user creation (agents, admins)
- **Ticket System**: Create, list, update, delete support tickets with status & priority tracking
- **Comments**: Add and view comments on tickets with author enrichment
- **Admin Features**: Manage users, statuses, priorities with role-based access control
- **Authentication**: JWT-based auth with three roles: customer, agent, admin
- **Documentation**: Full Swagger UI at /docs and Postman collection included

---

## 🏗️ Architecture

### Layered Structure
src/
├── db/                    # Database initialization and seeding
├── models/                # TypeScript interfaces (User, Ticket, Comment, etc.)
├── repositories/          # Data access layer (queries, JOINs)
├── services/              # Business logic and validation
├── controllers/           # HTTP request handlers
├── routes/                # Route definitions and middleware
├── middleware/            # Auth, role-based access, error handling
├── swagger/               # OpenAPI documentation
└── index.ts               # Server entry point

### Key Design Principles
- **Strict TypeScript**: No any types; full type safety
- **Separation of Concerns**: Each layer has a single responsibility
- **Non-destructive DB Init**: Creates tables if missing, seeds defaults only when empty
- **Rich Responses**: Ticket/comment endpoints return enriched data (creator/assignee names)
- **Consistent Error Handling**: DB errors mapped to friendly JSON responses

---

## 🔐 Authentication & Authorization

### Roles
- **Customer**: Can create tickets, comment on own tickets
- **Agent**: Can view/assign/update tickets, manage comments
- **Admin**: Full access; can create/manage users, statuses, priorities

### Default Seeded Users
| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password | admin |
| agent@example.com | password | agent |
| customer@example.com | password | customer |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+ (tested with LTS)
- npm or yarn

### Installation

\\\ash
cd REACT-SERVER
npm install
npm run build
npm run dev
\\\

Server runs on **http://localhost:4000**

### Database
- File: data/app.db (SQLite)
- Automatically created on first startup
- Seeded with default users, statuses, priorities, and sample ticket/comment
- Schema: users, statuses, priorities, tickets, comments

---

## 📚 API Endpoints (Summary)

### Authentication
- POST /auth/register → Creates customer (public)
- POST /auth/login → Returns JWT token
- GET /auth/me → Current user info (requires auth)

### Users (Admin Only)
- GET /users → List all users
- GET /users/:id → Get specific user
- POST /users → Create user with specified role

### Tickets
- GET /tickets → List tickets (enriched with status_name, priority_name)
- POST /tickets → Create ticket (auto-set created_by)
- GET /tickets/:id → Get ticket
- PATCH /tickets/:id → Update ticket (status_id, priority_id, assigned_to)
- DELETE /tickets/:id → Delete ticket

### Comments
- POST /tickets/:ticketId/comments → Add comment (enriched with author_name, author_email)
- GET /tickets/:ticketId/comments → List comments (with author info)

### Statuses & Priorities (Admin Only)
- GET /statuses, POST /statuses
- GET /priorities, POST /priorities

---

## �� Testing

### Postman Collection
1. Import helpdesk.postman_collection.json into Postman
2. Collection variables: baseHost (localhost), basePort (4000), token, ticketId, userId
3. Example flow: Health Check → Register → Login (token saved) → Create Ticket → List Tickets

### Swagger UI
Browse http://localhost:4000/docs for interactive API documentation

---

## 💾 Key Database Tables

### users
- id, name, email, password, role (admin|agent|customer), is_active, created_at

### tickets
- id, subject, description, status_id, priority_id, created_by, assigned_to, created_at, updated_at

### comments
- id, ticket_id, author_id, content, created_at

### statuses & priorities
- id, name

---

## 🛠️ Development Commands

\\\ash
npm run build      # Compile TypeScript to dist/
npm run dev        # Start dev server with auto-restart
\\\

---

## 📦 Technologies

- Node.js, Express, TypeScript
- SQLite3 (lightweight database)
- JWT (jsonwebtoken)
- Swagger UI (interactive docs)
- ts-node-dev (hot-reload dev server)

---

## 🎓 Learning Outcomes

✅ RESTful API design (CRUD operations)
✅ Layered architecture (routes → controllers → services → repos → db)
✅ TypeScript best practices (strict typing, interfaces, generics)
✅ Authentication & Authorization (JWT, role-based access control)
✅ Database design & SQL (schema, foreign keys, JOINs for enrichment)
✅ Error handling & validation (centralized, typed)
✅ API documentation (OpenAPI/Swagger, Postman collections)
✅ Express middleware (custom auth, role checking)

---

## ✨ Key Features

### Rich Data Returns
- Tickets include status_name, priority_name (via JOINs, not just IDs)
- Comments include author_name, author_email (not just author_id)
- Efficient single-trip data fetching (no N+1 queries)

### Non-Destructive Database Initialization
- CREATE TABLE IF NOT EXISTS prevents accidental data loss
- Seeding only runs if users table is empty
- Safe for development and learning

### Strict TypeScript
- All functions use explicit Request/Response generics
- Zero any types in codebase
- Full type safety from request to response

### Consistent Error Handling
- Database errors mapped to friendly JSON responses
- Proper HTTP status codes (400, 401, 403, 404, 409, 500)

---

## 🚨 Important Notes

1. **Plain Text Passwords**: For learning only. Use bcrypt in production!
2. **JWT Secret**: Default is 'change_this_secret'. Use JWT_SECRET env var in production.
3. **CORS**: Not configured. Add cors middleware if deploying frontend separately.

---

**Happy learning!** ��
