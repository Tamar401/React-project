# Helpdesk Frontend

React-based frontend for the Helpdesk Management System. A modern, responsive web application for managing support tickets with role-based access control.

## 🎯 Features

### Authentication & Authorization
- User login and registration
- JWT token management with localStorage persistence
- Role-Based Access Control (Admin, Agent, Customer)
- Protected routes with automatic redirects

### User Interfaces by Role

#### Customers
- Create and track their own tickets
- View ticket status and details
- Add and read comments
- Filter by status and priority

#### Agents
- View assigned tickets
- Update ticket status
- Add comments for communication
- Access ticket history

#### Admins
- View all tickets in the system
- Manage user accounts (create agents, admins)
- Assign tickets to agents
- Update ticket status and priority
- View system statistics and analytics
- Advanced filtering and search

### User Experience
- Responsive Material-UI design
- Real-time status updates
- Loading states and error handling
- Optimistic UI updates
- Interactive notifications (SweetAlert2)
- Keyboard-friendly navigation

---

## 🏗️ Architecture

### Component Structure
- **Pages**: Full-screen components for routes
- **Components**: Reusable UI components
- **Context**: Global state management (Auth)
- **Hooks**: Custom React hooks (if any)
- **Utilities**: Helper functions and constants

### State Management
- **AuthContext**: Manages user authentication state
- **React Query**: Server state and caching
- **Local State**: Component-level with useState

### API Communication
- **Axios**: HTTP client with interceptors
- **JWT Authentication**: Automatic token attachment
- **Error Handling**: Centralized error responses

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- npm or yarn
- Backend API running on `http://localhost:4000`

### Installation

```bash
# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:4000" > .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5175`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
src/
├── api/
│   └── axios.ts                  # API client configuration
├── components/
│   ├── Navbar.tsx               # Navigation bar
│   ├── Roles.tsx                # Role-based access wrapper
│   ├── ProtectedRoute.tsx       # Route protection
│   └── TicketCard.tsx           # Ticket display component
├── context/
│   └── AuthContext.tsx          # Auth state management
├── hooks/
│   ├── useQueries.ts            # React Query hooks
│   └── useTicketFiltering.ts    # Filtering logic hook
├── pages/
│   ├── Home.tsx                 # Welcome page
│   ├── Login.tsx                # Login form
│   ├── Register.tsx             # Registration form
│   ├── Dashboard.tsx            # Dashboard router
│   ├── DashboardContent.tsx     # Dashboard view
│   ├── Admin.tsx                # Admin panel
│   ├── Tickets.tsx              # Tickets list
│   ├── TicketDetails.tsx        # Ticket details
│   ├── CreateTicket.tsx         # Create ticket form
│   └── NotFound.tsx             # 404 page
├── routes/
│   └── Routes.tsx               # Route configuration
├── utils/
│   ├── colorUtils.ts            # Color mapping utilities
│   ├── alertUtils.ts            # Alert notification utilities
│   └── roleUtils.ts             # Role checking utilities
├── types.ts                     # TypeScript interfaces
├── App.tsx                      # Main layout
└── main.tsx                     # Entry point
```

---

## ✨ Code Quality & Best Practices

### Clean Code Architecture
- **Utility Functions**: Centralized utilities for colors, alerts, and roles
- **Custom Hooks**: Reusable hooks for queries and filtering
- **Type Safety**: Full TypeScript coverage with no `any` types
- **DRY Principle**: Zero code duplication across components

### Utility Modules

**Color Utilities** (`utils/colorUtils.ts`)
```typescript
- getStatusColor(status) → Maps status to color codes
- getPriorityColor(priority) → Maps priority to MUI colors
```

**Alert Utilities** (`utils/alertUtils.ts`)
```typescript
- showSuccessAlert() → Success notifications
- showErrorAlert() → Error notifications
- showInfoAlert() → Info messages
- showConfirmDialog() → Confirmation dialogs
```

**Role Utilities** (`utils/roleUtils.ts`)
```typescript
- isAdmin() → Check admin role
- isAgent() → Check agent role
- isCustomer() → Check customer role
- canEdit() → Check edit permission (admin/agent)
- hasRole() → Check multiple roles
- getRoleColor() → Get color for role display
```

### Custom Hooks

**API Queries** (`hooks/useQueries.ts`)
```typescript
- useFetchTickets() → Fetch all tickets with caching
- useFetchTicketById() → Fetch single ticket
- useFetchStatuses() → Fetch status options
- useFetchPriorities() → Fetch priority options
```

**Filtering** (`hooks/useTicketFiltering.ts`)
```typescript
- useTicketFiltering() → Centralized ticket filtering logic
```

---

## 🎯 Performance Optimizations

- **React Query Caching**: Automatic caching and refetching
- **Lazy Loading**: Code splitting with React Router
- **Memoization**: useMemo for expensive calculations
- **Request Deduplication**: React Query prevents duplicate requests

---

## 🔐 Security

- **JWT Tokens**: Stored in localStorage
- **Protected Routes**: Prevent unauthorized access
- **Role Checking**: UI elements conditional on user role
- **Request Interceptor**: Automatically adds token to all API calls
- **CORS**: Configured for development

---

## 🎨 Styling

Built with **Material-UI (MUI)** for:
- Professional, clean design
- Responsive layouts
- Consistent color scheme
- Accessible components

---

## 📝 Environment Variables

```
VITE_API_BASE_URL=http://localhost:4000
```

---

## 🔌 API Integration

All API calls are made to the backend running on `http://localhost:4000`. See backend documentation for available endpoints.

Key endpoints used:
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /tickets` - List tickets
- `POST /tickets` - Create ticket
- `PATCH /tickets/:id` - Update ticket
- `GET /tickets/:id/comments` - Get comments
- `POST /tickets/:id/comments` - Add comment

---

## 🧪 Testing

Default test credentials:
- **Admin**: admin@example.com / password
- **Agent**: agent@example.com / password
- **Customer**: customer@example.com / password

---

## 📦 Dependencies

- **react** - UI framework
- **react-router-dom** - Routing
- **@tanstack/react-query** - Server state management
- **@mui/material** - UI components
- **react-hook-form** - Form handling
- **axios** - HTTP client
- **sweetalert2** - Notifications
- **typescript** - Type safety

See `package.json` for full list and versions.

---

## 🚢 Deployment

### Build
```bash
npm run build
```

### Deploy
- Upload `dist/` folder to any static hosting
- Configure API endpoint in environment variables
- Ensure backend API is accessible from production environment

---

## 📚 Development Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

---

## 🐛 Troubleshooting

### API Connection Issues
- Ensure backend is running on `http://localhost:4000`
- Check VITE_API_BASE_URL in .env
- Verify CORS is enabled on backend

### Login Issues
- Check credentials in backend seeded data
- Clear localStorage and try again
- Check browser console for errors

### Build Issues
- Clear `node_modules` and `dist`
- Reinstall dependencies: `npm install`
- Check TypeScript errors: `npm run build`

---

## 📄 License

Educational project - freely available for learning purposes.
