# Student-Course Management System (MERN Stack)

A production-ready full-stack web application built with the **MERN** (**M**ongoDB, **E**xpress.js, **R**eact, **N**ode.js) stack for managing students, courses, and enrollments. This project demonstrates advanced architectural patterns and professional security standards.

** [Live Demo](https://student-course-management-college.vercel.app/)**

## 🛠️ Technical Stack

- **Frontend:** React (Vite), React Bootstrap (UI Components), React Hook Form (Form Management), Axios (API Client).
- **Backend:** Node.js, Express.js (RESTful API), Mongoose (ODM for MongoDB).
- **Security:** JSON Web Tokens (JWT) with httpOnly Cookies, Bcrypt.js (Password Hashing).
- **Architecture:** Model-View-Controller (MVC) pattern on the backend, Component-based architecture on the frontend.

## Project Structure

```text
student-course-system/
├── express-server/             # Backend (Node.js/Express.js)
│   ├── app/
│   │   ├── controllers/       # Business logic (MVC Controller layer)
│   │   ├── middleware/        # RBAC, JWT Auth, Validation & Error handling
│   │   ├── models/            # Mongoose schemas (MongoDB Data layer)
│   │   ├── routes/            # REST API endpoint definitions
│   │   └── utils/             # Helpers (Async error wrappers, etc.)
│   ├── config/                # Environment-specific configuration
│   ├── server.js              # Application entry point
│   ├── seedData.js            # Database bootstrapping script
│   └── .env.example           # Backend environment template
├── react-client/              # Frontend (React/Vite)
│   ├── src/
│   │   ├── api/               # Centralized Axios configuration
│   │   ├── components/        # Reusable UI components & Form logic
│   │   ├── context/           # Global State Management (Auth, Toast)
│   │   ├── pages/             # Route-level View components
│   │   └── main.jsx           # App entry point with Error Boundary
│   └── .env.example           # Frontend environment template
├── README.md                  # Project overview & Setup
└── GEMINI.md                  # Architectural guidelines
```

## Industry-Level Implementations

This project incorporates professional software engineering patterns designed for security, scalability, and maintainability:

### **Security & Authentication (JSON Web Tokens)**
- **Stateless Auth:** Implements **JWT** (**J**SON **W**eb **T**oken) stored in `httpOnly` cookies to mitigate **XSS** (**C**ross-**S**ite **S**cripting) attacks.
- **Automated Session Synchronization:** The frontend performs a `/auth/me` check on startup to synchronize application state with the backend's secure session.
- **Hardened RBAC:** Multi-layered **RBAC** (**R**ole-**B**ased **A**ccess **C**ontrol) enforced via custom middleware on the backend and Route Guards on the frontend.
- **Safe Promotion Logic:** Implements defensive programming to prevent administrators from demoting themselves or deleting their own accounts.

### **Scalability & Engineering Excellence**
- **Server-Side Pagination:** Student and Course directories are paginated at the database layer (MongoDB) to optimize performance for large datasets.
- **Defensive Data Integrity:** Implements **DRY** (**D**on't **R**epeat **Y**ourself) principles using a custom `asyncHandler` wrapper to manage asynchronous operations and global error middleware.
- **Robust Validation:** Uses `express-validator` to enforce strict schema validation for all **CRUD** (**C**reate, **R**ead, **U**pdate, **D**elete) operations.

### **User Experience (UI/UX) & Resilience**
- **Component-Driven Design:** Leverages React Bootstrap for a responsive, accessible, and professional **UI** (**U**ser **I**nterface).
- **Self-Service Dashboard:** Enables students to securely manage their own profiles and specialized skills (e.g., "Favorite Topic") through a dedicated profile view.
- **Centralized Feedback System:** A global Toast context provides real-time, non-intrusive feedback for system actions.
- **Fault Tolerance:** A global React **Error Boundary** catches runtime UI crashes and presents a graceful recovery path for the user.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation & Setup

1. **Backend:**
   ```bash
   cd express-server
   npm install
   cp .env.example .env # Provide your MONGO_URI and JWT_SECRET
   npm run seedData     # Optional: Seed initial data (Admin, Students, Courses)
   npm run dev

   ```

2. **Frontend:**
   ```bash
   cd ../react-client
   npm install
   cp .env.example .env # Set VITE_API_BASE_URL
   npm run dev
   ```

---
*Developed with a focus on Security, Scalability, and Maintainability.*
