# Helpdesk Management System 🛠️

A modern, professional helpdesk ticket management system enabling efficient communication between customers, support agents, and system administrators. Built with a focus on user experience (UX), high performance, and data security.

## 🚀 Core Technologies

### Frontend
- **React 18** with TypeScript for type safety
- **Context API & useReducer** for state management
- **TanStack Query (React Query)** for server state management and caching
- **Material-UI (MUI)** for clean, responsive design
- **React Hook Form** with advanced validation
- **React Router 6** for navigation and route protection
- **SweetAlert2** for interactive notifications
- **Axios** with JWT interceptor for secure API communication

### Backend (Node.js + Express + SQLite)
- See `/helpdesk-api/helpdesk-api-main/README.md` for backend details

---

## ✨ Core Features by Role

### 👤 Customers
- Secure registration and login
- Create new support tickets with priority setting
- Track status of their tickets in real-time
- Add and view comments on their tickets
- Never see other customers' tickets (data isolation)

### 🎧 Support Agents
- View all tickets assigned to them
- Update ticket status (Open, In Progress, Closed)
- Add comments and communicate with customers
- See ticket details and history

### 🔑 Administrators
- Complete dashboard with all tickets in the system
- Manage all users: create agents and admins
- Assign tickets to specific agents
- View system statistics in real-time
- Filter and search tickets by multiple criteria
- Manage ticket statuses and priorities

---

## 🎯 Key Features

### ✅ Implemented
- ✅ Role-Based Access Control (RBAC)
- ✅ JWT Authentication with localStorage persistence
- ✅ Protected routes (ProtectedRoute + Roles component)
- ✅ Ticket filtering by status, priority, and search text
- ✅ Real-time ticket updates
- ✅ Comment system with author information
- ✅ Responsive Material-UI design
- ✅ Loading states and error handling
- ✅ Optimistic UI updates
- ✅ Home page with feature overview

---

## 📁 Project Structure

```
helpdesk-frontend/
├── src/
│   ├── api/
│   │   └── axios.ts              # Axios client with JWT interceptor
│   ├── components/
│   │   ├── Navbar.tsx            # Navigation bar
│   │   ├── Roles.tsx             # Role-based access control
│   │   ├── ProtectedRoute.tsx    # Protected route wrapper
│   │   └── TicketCard.tsx        # Reusable ticket card
│   ├── context/
│   │   └── AuthContext.tsx       # Global auth state management
│   ├── hooks/
│   │   ├── useQueries.ts         # Reusable React Query hooks
│   │   └── useTicketFiltering.ts # Ticket filtering logic
│   ├── pages/
│   │   ├── Home.tsx              # Welcome page
│   │   ├── Login.tsx             # Login form
│   │   ├── Register.tsx          # Registration form
│   │   ├── Dashboard.tsx         # Dashboard router
│   │   ├── DashboardContent.tsx  # Dashboard content
│   │   ├── Admin.tsx             # Admin panel (all tickets, users, stats)
│   │   ├── Tickets.tsx           # Ticket list with filters
│   │   ├── TicketDetails.tsx     # Ticket detail view with comments
│   │   ├── CreateTicket.tsx      # Create new ticket form
│   │   └── NotFound.tsx          # 404 page
│   ├── routes/
│   │   └── Routes.tsx            # Router configuration with protected routes
│   ├── utils/
│   │   ├── colorUtils.ts         # Color mapping utilities for status/priority
│   │   ├── alertUtils.ts         # SweetAlert utility functions
│   │   └── roleUtils.ts          # Role checking and role-based utilities
│   ├── types.ts                  # TypeScript interfaces
│   ├── App.tsx                   # Main app layout
│   └── main.tsx                  # Entry point
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

helpdesk-api/helpdesk-api-main/
└── [Backend implementation - see backend README]
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+ (LTS recommended)
- npm or yarn
- Backend API running on `http://localhost:4000`

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd helpdesk-system

# Install dependencies (Frontend)
cd helpdesk-frontend
npm install

# Set up environment variables
# Create .env file in helpdesk-frontend directory
echo "VITE_API_BASE_URL=http://localhost:4000" > .env

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5175` (or next available port)

### Backend Setup
```bash
# In another terminal
cd helpdesk-api/helpdesk-api-main
npm install
npm run dev
```

Backend will run on `http://localhost:4000`

---

## 🏗️ Code Architecture & Best Practices

### Utility Functions (DRY Principle)
The codebase follows clean code principles with centralized utility functions:

**Color Utilities** (`src/utils/colorUtils.ts`)
- `getStatusColor()` - Maps status names to colors
- `getPriorityColor()` - Maps priority levels to colors

**Alert Utilities** (`src/utils/alertUtils.ts`)
- `showSuccessAlert()` - Standardized success notifications
- `showErrorAlert()` - Standardized error notifications
- `showInfoAlert()` - Information messages
- `showConfirmDialog()` - Confirmation dialogs

**Role Utilities** (`src/utils/roleUtils.ts`)
- `isAdmin()`, `isAgent()`, `isCustomer()` - Role checking
- `canEdit()` - Determine edit permissions
- `hasRole()` - Check multiple roles
- `getRoleColor()` - Role-based styling

### Custom Hooks (Reusability)
**API Queries** (`src/hooks/useQueries.ts`)
- `useFetchTickets()` - Fetch all tickets
- `useFetchTicketById()` - Fetch single ticket
- `useFetchStatuses()` - Fetch available statuses
- `useFetchPriorities()` - Fetch available priorities

**Filtering** (`src/hooks/useTicketFiltering.ts`)
- `useTicketFiltering()` - Centralized filtering logic

---

## 📊 Code Quality Metrics

- ✅ **Zero Code Duplication** - DRY principle enforced
- ✅ **Type Safe** - Full TypeScript coverage, no `any` types
- ✅ **Reusable Components** - Custom hooks for common patterns
- ✅ **Error Handling** - Comprehensive try-catch blocks
- ✅ **Loading States** - Visual feedback for all async operations
- ✅ **Performance** - React Query for efficient caching

---

## 📊 Navigation & Routes

### Public Routes
- `/` - Home page (Welcome)
- `/login` - Login form
- `/register` - Registration form

### Protected Routes (Authentication Required)
- `/dashboard` - User dashboard (role-based content)
- `/tickets` - List all accessible tickets
- `/tickets/new` - Create new ticket (customers only)
- `/tickets/:id` - View ticket details and comments
- `/admin` - Admin panel (admins only)

---

## 🔐 Security Features

### Authentication
- JWT-based authentication
- Tokens stored securely in localStorage
- Automatic token refresh on page reload
- Logout clears all session data

### Authorization
- Role-Based Access Control (RBAC)
- Protected routes validate user roles
- API calls include JWT token in Authorization header
- Customers can only see their own tickets

### Data Privacy
- Each customer sees only their tickets
- Agents see only assigned tickets
- Admins see all tickets and users
- Comments include author information

---

## 🎨 UI/UX Features

### Design
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Material-UI**: Professional, clean interface
- **Color Coding**: Status and priority chips with visual indicators
- **Loading States**: CircularProgress for async operations
- **Error Handling**: SweetAlert2 notifications for user feedback

### User Experience
- **Optimistic Updates**: UI updates before API response
- **Real-time Feedback**: Success/error messages
- **Filter & Search**: Quick ticket filtering
- **Breadcrumbs**: "Back" buttons to return to previous page
- **Empty States**: Clear messages when no data available

---

## 🔍 Testing Credentials

Default test users (created by backend):

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password | Admin |
| agent@example.com | password | Agent |
| customer@example.com | password | Customer |

---

## 📦 Build & Deployment

### Build for Production
```bash
npm run build
npm run preview
```

### Build Artifacts
- `dist/` - Optimized build files
- Ready for deployment to any static hosting

---

## 🛠️ Development Scripts

```bash
npm run dev      # Start development server with Vite
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📚 API Documentation

The backend API has full Swagger documentation:
- **Swagger UI**: `http://localhost:4000/docs`
- **Postman Collection**: Available in `/helpdesk-api/helpdesk-api-main/`

---

## 📝 Notes

- Frontend communicates with backend via REST API
- All API calls include JWT authentication
- CORS enabled for local development
- Error handling with user-friendly messages
- No external AI tools used in development

---

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ React best practices and hooks
- ✅ TypeScript for type safety
- ✅ State management with Context API
- ✅ Server state management with React Query
- ✅ Protected routes and role-based access
- ✅ Form validation and handling
- ✅ API integration with Axios
- ✅ Responsive UI with Material-UI
- ✅ JWT authentication flow
- ✅ Error handling and loading states

---

## 📄 License

Educational project - freely available for learning purposes.
