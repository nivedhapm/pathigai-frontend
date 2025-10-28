<div align="center">

# Pathigai (பதிகை) - Frontend

<img src="public/logo.svg" alt="Pathigai Logo" width="80"/>

**Track. Train. Transform. | Guiding Every Step to Success.**

A comprehensive Student Progress Tracking System from registration to placement.

A comprehensive Student Progress Tracking System from registration to placement.

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[Backend Repository](https://github.com/nivedhapm/pathigai-backend) • [Report Issue](https://github.com/nivedhapm/pathigai-frontend/issues)

</div>

---

## Table of Contents

- [About Pathigai](#about-pathigai)
- [Features (Implemented)](#features-implemented)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
  - [Building for Production](#building-for-production)
- [Architecture](#architecture)
- [API Integration](#api-integration)
- [Authentication & Security](#authentication--security)
- [Branching Strategy](#branching-strategy)
- [Upcoming Features](#upcoming-features)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## About Pathigai

**Pathigai** (பதிகை) meaning "a trace, log, or record" is a B2B web application designed to track students' complete training journey from initial application through to placement. Built for training institutions and organizations, it provides role-based dashboards for Trainees, Trainers, HR, Admins, Interview Panelists, and Management.

**Target Organizations:** Training institutions, corporate training programs, and student placement management systems.

---

## Features (Implemented)

### Authentication & Verification System
- **Multi-Step Registration** with email and SMS verification
- **Company Information Setup** during initial signup
- **Role-Based Login** with JWT token authentication
- **Password Management**
  - Forgot password with email verification
  - Reset password functionality
  - Mandatory password change on first login for temporary passwords
- **reCAPTCHA Integration** for bot protection
- **Session Management**
  - JWT-based stateless authentication
  - Automatic token refresh mechanism
  - 2-hour access tokens with 7-day refresh tokens
  - Proactive token renewal before expiration

### User Management System
- **Hierarchical Role-Profile System**
  - 7 Profiles: SUPER_ADMIN, ADMIN, MANAGEMENT, TRAINER, INTERVIEW_PANELIST, PLACEMENT, TRAINEE
  - 9 Roles: ADMIN, MANAGER, HR, FACULTY, MENTOR, INTERVIEW_PANELIST, EMPLOYEE, TRAINEE, APPLICANT
  - Role-Profile mapping validation
- **User Creation**
  - Single user creation with form validation
  - Bulk CSV upload with validation and preview
  - Automatic temporary password generation
  - Company-isolated user management
- **User Operations**
  - Search and filter by role/profile
  - Edit user role and profile
  - Soft delete (deactivate users)
  - Export users to CSV
- **Access Control**
  - Profile-based permissions (SUPER_ADMIN > ADMIN > MANAGEMENT)
  - Users can only manage lower-privilege profiles
  - Company-based data isolation

### Dashboard System
- **Role-Specific Dashboards**
  - Super Admin Dashboard
  - Admin Dashboard
  - Management Dashboard
  - Trainer Dashboard
  - Interview Panelist Dashboard
  - Placement Dashboard
  - Trainee Dashboard
- **Common Features**
  - Responsive sidebar navigation
  - Theme toggle (Light/Dark mode)
  - User profile access
  - Protected routes with role validation

### UI/UX Components
- **Reusable Components**
  - Custom Dropdown with theme support
  - Custom Date Picker
  - Table component with pagination
  - Toast notifications
  - Button variants (primary, secondary, success, danger, outline)
  - Card component
  - Password strength indicator
  - OTP input
- **Theme System**
  - Global light/dark theme context
  - Persistent theme preference
  - Smooth theme transitions

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2 | Frontend library for building UI |
| **Vite** | 5.4 | Build tool and dev server |
| **React Router** | 6.20 | Client-side routing |
| **Axios** | 1.11 | HTTP client for API requests |
| **Lucide React** | 0.544 | Modern icon library |
| **Material-UI** | 7.3 | Component library (selective usage) |
| **React DatePicker** | 8.7 | Date selection component |
| **date-fns** | 4.1 | Date utility library |
| **ESLint** | 8.53 | Code linting |

---

## Project Structure

```
## Project Structure

```
pathigai-frontend/
├── public/
│   └── logo.svg
├── src/
│   ├── assets/                      # Static assets (logos, images)
│   ├── components/
│   │   ├── layout/                  # Layout components
│   │   │   ├── FloatingElements/
│   │   │   ├── Footer/
│   │   │   ├── LogoSection/
│   │   │   ├── ThemeToggle/
│   │   │   └── TopNav/
│   │   └── ui/                      # Reusable UI components
│   │       ├── Button/
│   │       ├── Card/
│   │       ├── CustomDatePicker/
│   │       ├── CustomDropdown/
│   │       ├── OTPInput/
│   │       ├── PasswordInput/
│   │       ├── PasswordStrengthIndicator/
│   │       ├── ProtectedRoute/
│   │       ├── Recaptcha/
│   │       ├── Table/
│   │       └── Toast/
│   ├── modules/
│   │   ├── auth/                    # Authentication module
│   │   │   └── pages/
│   │   │       ├── LandingPage.jsx
│   │   │       ├── LoginPage.jsx
│   │   │       ├── SignupPage.jsx
│   │   │       ├── EmailVerificationPage.jsx
│   │   │       ├── SMSVerificationPage.jsx
│   │   │       ├── ForgotPasswordPage.jsx
│   │   │       ├── ResetPasswordPage.jsx
│   │   │       └── CompanyInfoPage.jsx
│   │   ├── dashboard/               # Dashboard module
│   │   │   ├── components/
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── TopNav.jsx
│   │   │   │   └── ContentArea.jsx
│   │   │   ├── pages/
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   ├── SuperAdminDashboard.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ManagementDashboard.jsx
│   │   │   │   ├── TrainerDashboard.jsx
│   │   │   │   ├── InterviewPanelistDashboard.jsx
│   │   │   │   ├── PlacementDashboard.jsx
│   │   │   │   ├── TraineeDashboard.jsx
│   │   │   │   └── SettingsPage.jsx
│   │   │   └── styles/
│   │   └── user-management/         # User management module
│   │       ├── components/
│   │       │   ├── UserForm.jsx
│   │       │   ├── AddUsersSection.jsx
│   │       │   ├── BulkUploadCSV.jsx
│   │       │   ├── ManageUsersSection.jsx
│   │       │   ├── DeleteUsersSection.jsx
│   │       │   └── ExportUsersCSV.jsx
│   │       ├── pages/
│   │       │   └── UserManagementPage.jsx
│   │       └── styles/
│   ├── shared/
│   │   ├── contexts/
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   └── useTokenRefresh.js
│   │   └── services/
│   │       ├── api.js
│   │       ├── authService.js
│   │       ├── userService.js
│   │       ├── dashboardService.js
│   │       ├── profileService.js
│   │       ├── sessionService.js
│   │       └── tokenRefreshManager.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v16.x or higher
- **npm** v8.x or higher (or **yarn** v1.22+)
- **Git** for version control

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/nivedhapm/pathigai-frontend.git
   cd pathigai-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE=http://localhost:8080/api/v1

# reCAPTCHA Configuration
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here

# Optional: Email Configuration (for development reference)
MAIL_USERNAME=your_email@example.com
MAIL_PASSWORD=your_app_password

# Optional: JWT Configuration (backend handles this)
JWT_SECRET=your_jwt_secret_key

# Optional: Database Configuration (backend reference)
DB_URL=jdbc:mysql://127.0.0.1:3306/pathigai_app
DB_USERNAME=root
DB_PASSWORD=your_db_password
```

**Important:** The `.env.example` file provides a template. Never commit your actual `.env` file to version control.

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Create an optimized production build:

```bash
npm run build
```

This generates a `dist/` folder with production-ready static files.

Preview the production build locally:

```bash
npm run preview
```

---

## Architecture

### Component Organization

The application follows a modular architecture with clear separation of concerns:

- **Layout Components** - Reusable layout elements (header, footer, navigation)
- **UI Components** - Atomic, reusable components with consistent theming
- **Module Pages** - Feature-specific pages organized by business domain
- **Shared Services** - Centralized API communication and business logic
- **Context Providers** - Global state management (theme, authentication)

### State Management

- **Local State** - Component-level state with React hooks
- **Context API** - Global state for theme and authentication
- **Service Layer** - Business logic and API communication separated from components

### Routing Strategy

Protected routes implement role-based access control:

```jsx
<Route 
  path="/dashboard/users" 
  element={
    <ProtectedRoute allowedProfiles={['SUPER_ADMIN', 'ADMIN', 'MANAGEMENT']}>
      <DashboardPage content="user-management" />
    </ProtectedRoute>
  } 
/>
```

---

## API Integration

The frontend communicates with a Spring Boot backend via REST APIs.

**Base URL:** `http://localhost:8080/api/v1` (configurable via `VITE_API_BASE`)

### Key Endpoints

#### Authentication
- `POST /signup/register` - User registration
- `POST /signup/complete` - Complete signup with company info
- `POST /login/authenticate` - User login
- `POST /login/complete` - Complete login and get JWT tokens
- `POST /login/logout` - User logout
- `POST /login/reset-temporary-password` - Reset temporary password
- `POST /password-reset/initiate` - Initiate password reset
- `POST /password-reset/complete` - Complete password reset

#### Verification
- `POST /verification/verify` - Verify OTP
- `POST /verification/resend` - Resend verification code
- `POST /verification/initiate` - Initiate verification
- `POST /verification/change-type` - Change verification method

#### Token Management
- `POST /auth/refresh-token` - Refresh access token
- `GET /auth/session-status` - Check session status
- `POST /auth/extend-session` - Extend user session

#### User Management
- `GET /users/profile` - Get user profile
- `GET /users/manage` - Get manageable users (filtered by company and profile)
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `PUT /users/:id/status` - Update user status (soft delete)

---

## Authentication & Security

### JWT Token Management

- **Access Token:** 2-hour validity, contains user claims (userId, email, role, profile, companyId)
- **Refresh Token:** 7-day validity, used to obtain new access tokens
- **Proactive Refresh:** Tokens are automatically refreshed 20 minutes before expiration
- **Secure Storage:** Tokens stored in localStorage with validation

### Session Management

```javascript
// Token refresh mechanism
tokenRefreshManager.initialize()

// Proactive token renewal
authService.refreshTokenIfNeeded()

// Session validation
authService.isAuthenticated()
```

### Role-Based Access Control

```javascript
// Profile hierarchy (descending privilege)
SUPER_ADMIN (level 7)
  └─ ADMIN (level 6)
      └─ MANAGEMENT (level 5)
          └─ TRAINER (level 4)
              └─ INTERVIEW_PANELIST (level 3)
                  └─ PLACEMENT (level 2)
                      └─ TRAINEE (level 1)
```

### Company Isolation

All user operations are isolated by company ID extracted from JWT token claims, ensuring data segregation in multi-tenant scenarios.

---

## Branching Strategy

- **`main`** - Production-ready code (protected)
- **`dev`** - Active development branch for daily commits and testing

### Development Workflow

```bash
# Switch to dev branch
git checkout dev

# Create feature branch (optional)
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add user search functionality"

# Push to dev
git push origin dev

# When ready for production, create PR to main
# After review and testing, merge to main
```

---

## Upcoming Features

### In Development
- Application & Interview Management
- Trainee Onboarding & Profile Management
- Attendance Tracking System

### Planned Features
- Assignment Management System
- Task Tracking (Coding Contests, Seminars, Daily Problems)
- Performance Analytics & Reporting
- Placement Management Module
- Mentorship & Feedback System
- Advanced Dashboard Analytics
- Notification System
- File Upload & Document Management

---

## Contributing

This project is currently under active development by the project team. External contributions are not being accepted at this time.

For team members:

1. Ensure you're working on the `dev` branch
2. Follow the established code structure and naming conventions
3. Write clean, commented code
4. Test thoroughly before committing
5. Create descriptive commit messages following conventional commits

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

**Project Maintainer:** Nivedha PM

- GitHub: [@nivedhapm](https://github.com/nivedhapm)
- Email: nivi110401@gmail.com

**Project Links:**
- Frontend Repository: [https://github.com/nivedhapm/pathigai-frontend](https://github.com/nivedhapm/pathigai-frontend)
- Backend Repository: [https://github.com/nivedhapm/pathigai-backend](https://github.com/nivedhapm/pathigai-backend)

---

## Acknowledgments

- React Team for the powerful UI library
- Vite Team for the blazing fast build tool
- Lucide React for beautiful icon system
- React Router for seamless navigation
- Axios for reliable HTTP client
- Material-UI for component inspiration
- Google reCAPTCHA for bot protection
- Vercel for deployment platform

---

<div align="center">

**Made for comprehensive training management**

Star this repo if you find it helpful!

</div>