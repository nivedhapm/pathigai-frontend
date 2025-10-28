<div align="center">

# Pathigai (பதிகை) - Frontend

<img src="https://via.placeholder.com/80x80?text=Pathigai" alt="Pathigai Logo" width="80" />

**Track. Train. Transform. | Guiding Every Step to Success.**

A comprehensive Student Progress Tracking System from registration to placement.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[Live Demo](#) • [Backend Repo](https://github.com/nivedhapm/pathigai-backend) • [Report Issue](https://github.com/nivedhapm/pathigai-frontend/issues)

</div>

---

## Table of Contents

- [About Pathigai](#about-pathigai)
- [Current Implementation Status](#current-implementation-status)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
  - [Authentication System](#authentication-system)
  - [User Management](#user-management)
  - [Dashboard System](#dashboard-system)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [API Integration](#api-integration)
- [Branching Strategy](#branching-strategy)
- [Development Guidelines](#development-guidelines)
- [Upcoming Features](#upcoming-features)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## About Pathigai

**Pathigai** (பதிகை) meaning "a trace, log, or record" - is a B2B web application designed to track students' complete training journey from initial application through to placement. Built for training institutions and organizations, it provides role-based dashboards for Students, Faculty, HR, Admins, Interview Panelists, and Mentors.

The application serves as a centralized platform for managing:
- Student registration and onboarding
- Training progress tracking
- Performance analytics
- Interview scheduling and feedback
- Placement management
- Mentorship programs

---

## Current Implementation Status

### Completed Modules

**Module 1: Authentication & Access Control**
- Multi-step signup with email/SMS verification
- Company information registration
- Role-based login system with JWT authentication
- Password security with bcrypt encryption
- Temporary password reset on first login
- Google reCAPTCHA v2 integration
- Forgot password & reset password flows
- Enhanced token refresh mechanism (2-hour automatic refresh)
- Session management and recovery

**Module 2: User Management System**
- Single user creation with comprehensive form validation
- Bulk CSV upload with 4-step validation workflow
- User search, filtering, and management interface
- Role-profile hierarchy enforcement
- Profile-based access control (SUPER_ADMIN, ADMIN, MANAGEMENT)
- Temporary password generation
- Company isolation and multi-tenancy support
- Export user data to CSV

**Module 3: Dashboard System**
- Role-based dashboard rendering
- Dynamic content routing
- Profile-specific dashboard components:
  - Super Admin Dashboard
  - Admin Dashboard
  - Management Dashboard
  - Trainer Dashboard
  - Interview Panelist Dashboard
  - Placement Dashboard
  - Trainee Dashboard
- Protected route system with authorization
- Responsive navigation and layout

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | Frontend UI framework |
| **Vite** | 5.4.19 | Build tool and development server |
| **React Router** | 6.20.1 | Client-side routing and navigation |
| **Axios** | 1.11.0 | HTTP client for API communication |
| **Lucide React** | 0.544.0 | Modern icon library |
| **Material-UI** | 7.3.2 | Component library for forms and data grids |
| **React DatePicker** | 8.7.0 | Date selection component |
| **date-fns** | 4.1.0 | Date manipulation and formatting |
| **ESLint** | 8.53.0 | Code linting and quality |

### Additional Technologies
- **JWT** - Token-based authentication
- **Google reCAPTCHA v2** - Bot protection
- **LocalStorage** - Client-side session management
- **Font Awesome** - Additional icons

---

## Project Structure

```
pathigai-frontend/
├── public/
│   └── logo.svg                          # Application logo
├── src/
│   ├── assets/                           # Static assets
│   ├── components/                       # Reusable UI components
│   │   ├── layout/                       # Layout components
│   │   │   ├── FloatingElements/         # Decorative elements
│   │   │   ├── Footer/                   # Footer component
│   │   │   ├── LogoSection/              # Logo display
│   │   │   ├── ThemeToggle/              # Dark/light theme switcher
│   │   │   └── TopNav/                   # Navigation bar
│   │   └── ui/                           # UI components
│   │       ├── Button/                   # Button component
│   │       ├── Card/                     # Card wrapper
│   │       ├── CustomDatePicker/         # Date picker
│   │       ├── CustomDropdown/           # Dropdown select
│   │       ├── OTPInput/                 # OTP input field
│   │       ├── PasswordInput/            # Password with visibility toggle
│   │       ├── PasswordStrengthIndicator/ # Password strength meter
│   │       ├── ProtectedRoute/           # Route authorization wrapper
│   │       ├── Recaptcha/                # reCAPTCHA integration
│   │       ├── Table/                    # Data table component
│   │       └── Toast/                    # Toast notifications
│   ├── modules/                          # Feature modules
│   │   ├── auth/                         # Authentication module
│   │   │   └── pages/
│   │   │       ├── LandingPage.jsx       # Application landing page
│   │   │       ├── LoginPage.jsx         # User login
│   │   │       ├── SignupPage.jsx        # User registration
│   │   │       ├── EmailVerificationPage.jsx
│   │   │       ├── SMSVerificationPage.jsx
│   │   │       ├── ForgotPasswordPage.jsx
│   │   │       ├── ResetPasswordPage.jsx
│   │   │       └── CompanyInfoPage.jsx   # Company details
│   │   ├── dashboard/                    # Dashboard module
│   │   │   ├── components/
│   │   │   │   ├── DashboardLayout.jsx   # Main layout wrapper
│   │   │   │   ├── Sidebar.jsx           # Dashboard sidebar
│   │   │   │   ├── TopNav.jsx            # Dashboard top navigation
│   │   │   │   └── ContentArea.jsx       # Main content area
│   │   │   └── pages/
│   │   │       ├── DashboardPage.jsx     # Dashboard router
│   │   │       ├── SuperAdminDashboard.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ManagementDashboard.jsx
│   │   │       ├── TrainerDashboard.jsx
│   │   │       ├── InterviewPanelistDashboard.jsx
│   │   │       ├── PlacementDashboard.jsx
│   │   │       ├── TraineeDashboard.jsx
│   │   │       └── SettingsPage.jsx
│   │   └── user-management/              # User management module
│   │       ├── components/
│   │       │   ├── AddUsersSection.jsx   # Add users interface
│   │       │   ├── UserForm.jsx          # Single user creation
│   │       │   ├── BulkUploadCSV.jsx     # Bulk CSV upload
│   │       │   ├── ManageUsersSection.jsx # User management
│   │       │   ├── DeleteUsersSection.jsx
│   │       │   └── ExportUsersCSV.jsx
│   │       ├── pages/
│   │       │   └── UserManagementPage.jsx
│   │       └── styles/                   # Module-specific styles
│   ├── shared/                           # Shared utilities
│   │   ├── contexts/
│   │   │   └── ThemeContext.jsx          # Theme management
│   │   ├── hooks/
│   │   │   └── useTokenRefresh.js        # Token refresh hook
│   │   ├── services/                     # API service layer
│   │   │   ├── api.js                    # Axios instance
│   │   │   ├── authService.js            # Authentication API
│   │   │   ├── userService.js            # User management API
│   │   │   ├── dashboardService.js       # Dashboard data API
│   │   │   ├── profileService.js         # Profile API
│   │   │   ├── sessionService.js         # Session handling
│   │   │   └── tokenRefreshManager.js    # Token refresh logic
│   │   └── utils/                        # Utility functions
│   ├── styles/
│   │   └── globals.css                   # Global styles
│   ├── App.jsx                           # Main app component
│   └── main.jsx                          # Application entry point
├── docs/                                 # Documentation
│   ├── USER_MANAGEMENT_STATUS.md
│   ├── USER_MANAGEMENT_IMPLEMENTATION.md
│   ├── NAVIGATION_STRUCTURE.md
│   ├── TOKEN_REFRESH_TESTING.md
│   └── BACKEND_FRONTEND_SYNC.md
├── .env                                  # Environment variables
├── .gitignore
├── eslint.config.js                      # ESLint configuration
├── vite.config.js                        # Vite configuration
├── package.json
└── README.md
```

---

## Features

### Authentication System

**Signup Flow**
- Multi-step registration process
- Email and phone number validation
- Email OTP verification (6-digit code)
- SMS OTP verification
- Company information collection
- Password strength validation
- Google reCAPTCHA v2 protection
- Automatic user profile assignment

**Login Flow**
- Email/username and password authentication
- reCAPTCHA verification
- JWT token generation
- Refresh token management
- Automatic token refresh (2-hour mechanism)
- Session persistence and recovery
- Temporary password reset on first login
- Remember me functionality

**Password Management**
- Forgot password with email verification
- Secure password reset with token validation
- Password strength requirements
- Bcrypt encryption (backend)
- Mandatory password change on first login

**Session Management**
- Enhanced 2-hour token refresh mechanism
- Automatic session extension
- Silent token refresh during user activity
- Session recovery after browser restart
- Secure token storage in localStorage
- Automatic logout on token expiration

### User Management

**Single User Creation**
- Comprehensive user form with validation
- Personal information fields:
  - Full name
  - Email address
  - Phone number
  - Date of birth (minimum age 17)
  - Gender selection
  - Work location
- Role and profile assignment:
  - Profile hierarchy enforcement
  - Role-profile mapping validation
  - Permission-based profile selection
- Temporary password generation
- Account activation control
- Real-time form validation

**Bulk CSV Upload**
- 4-step upload workflow:
  1. File selection with drag-and-drop
  2. Data preview and validation
  3. Processing with progress tracking
  4. Results summary with success/error details
- Row-level validation
- Invalid row deletion
- Password generation for each user
- CSV template download
- Batch processing with partial success handling
- Detailed error reporting

**User Management Interface**
- Real-time user search
- Advanced filtering by role and profile
- User profile editing
- Role and profile updates
- User deletion with confirmation
- Pagination for large datasets
- Export user data to CSV
- Professional table interface

**Access Control**
- Profile-based restrictions:
  - SUPER_ADMIN: Full system access
  - ADMIN: Cannot create other admins
  - MANAGEMENT: Limited to trainees and interview panelists
- Company isolation
- Permission validation
- Route protection

### Dashboard System

**Profile-Based Dashboards**
- Dynamic dashboard rendering based on user profile
- Customized navigation and features per role
- Responsive layout with sidebar navigation
- Theme toggle (light/dark mode)
- User profile display
- Quick action buttons

**Dashboard Components**
- Super Admin Dashboard: System-wide control
- Admin Dashboard: High-level management
- Management Dashboard: Supervisory access
- Trainer Dashboard: Training operations
- Interview Panelist Dashboard: Interview management
- Placement Dashboard: Placement operations
- Trainee Dashboard: Student portal

**Dashboard Features**
- Protected route system
- Dynamic content loading
- Real-time data updates
- Responsive design
- Professional UI/UX

---

## Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm or yarn
- Git

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
   or
   ```bash
   yarn install
   ```

3. Set up environment variables (see [Environment Configuration](#environment-configuration))

4. Start the development server
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

   The application will open at `http://localhost:5173`

### Building for Production

```bash
npm run build
```
or
```bash
yarn build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```
or
```bash
yarn preview
```

---

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE=http://localhost:8080/api/v1

# Google reCAPTCHA v2
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here

# Email Configuration (Backend)
MAIL_USERNAME=your_email@example.com
MAIL_PASSWORD=your_app_password

# JWT Configuration (Backend)
JWT_SECRET=your_jwt_secret_key

# Database Configuration (Backend)
DB_URL=jdbc:mysql://localhost:3306/pathigai_app
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
```

### Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE` | Backend API base URL | Yes |
| `VITE_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v2 site key | Yes |
| `MAIL_USERNAME` | Email service username (backend) | Backend only |
| `MAIL_PASSWORD` | Email service app password (backend) | Backend only |
| `JWT_SECRET` | JWT secret key (backend) | Backend only |
| `DB_URL` | Database connection URL (backend) | Backend only |
| `DB_USERNAME` | Database username (backend) | Backend only |
| `DB_PASSWORD` | Database password (backend) | Backend only |

Note: Variables prefixed with `VITE_` are available in the frontend. Others are backend configuration.

---

## API Integration

### Base Configuration

The application uses Axios for HTTP requests with the following configuration:

```javascript
// src/shared/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'
const API_TIMEOUT = 10000

axios.defaults.baseURL = API_BASE_URL
axios.defaults.timeout = API_TIMEOUT
axios.defaults.headers.common['Content-Type'] = 'application/json'
```

### API Endpoints

**Authentication Endpoints**
```
POST   /signup/register              - User registration
POST   /signup/complete              - Complete signup with company info
GET    /signup/check-email           - Check if email exists
GET    /signup/check-phone           - Check if phone exists
POST   /login/authenticate           - User login
POST   /login/complete               - Complete login and get JWT
POST   /login/reset-temporary-password - Reset temp password
POST   /login/logout                 - User logout
POST   /forgot-password/request      - Request password reset
POST   /forgot-password/reset        - Reset password with token
POST   /refresh-token                - Refresh access token
```

**User Management Endpoints**
```
POST   /users/create                 - Create single user
POST   /users/bulk-create            - Bulk create users
GET    /users/search                 - Search users with filters
GET    /users/:id                    - Get user by ID
PUT    /users/:id                    - Update user
DELETE /users/:id                    - Delete user
GET    /users/export                 - Export users to CSV
```

**Dashboard Endpoints**
```
GET    /dashboard/stats              - Get dashboard statistics
GET    /dashboard/profile            - Get user profile
PUT    /dashboard/profile            - Update user profile
```

### Request/Response Format

**Request with Authentication**
```javascript
// Automatic JWT token inclusion
axios.interceptors.request.use(config => {
  const token = authService.getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

**Response Interceptor**
```javascript
// Automatic token refresh on 401
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      await authService.refreshAccessToken()
      // Retry original request
    }
    return Promise.reject(error)
  }
)
```

---

## Branching Strategy

### Branch Structure

- **`main`** - Production-ready code, deployed on Vercel
- **`dev`** - Active development branch for daily commits and testing
- **`feature/*`** - Feature-specific branches
- **`bugfix/*`** - Bug fix branches

### Workflow

```bash
# Start new feature
git checkout dev
git pull origin dev
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request to dev
# After review and approval, merge to dev

# When ready for production
git checkout main
git merge dev
git push origin main
```

### Commit Message Convention

```
feat: Add new feature
fix: Fix bug in component
docs: Update documentation
style: Format code
refactor: Refactor component
test: Add tests
chore: Update dependencies
```

---

## Development Guidelines

### Code Style

- Follow ESLint configuration
- Use functional components with hooks
- Implement proper error handling
- Add PropTypes or TypeScript types
- Write meaningful commit messages
- Keep components focused and reusable

### Component Structure

```jsx
// Component template
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './ComponentName.css'

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialState)
  
  useEffect(() => {
    // Side effects
  }, [dependencies])
  
  const handleAction = () => {
    // Event handlers
  }
  
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  )
}

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
}

export default ComponentName
```

### File Naming

- Components: PascalCase (e.g., `UserForm.jsx`)
- Services: camelCase (e.g., `authService.js`)
- Styles: kebab-case (e.g., `user-form.css`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_CONSTANTS.js`)

### Best Practices

- Use semantic HTML
- Implement accessibility features
- Optimize performance with React.memo
- Handle loading and error states
- Validate user input
- Sanitize data before API calls
- Use environment variables for configuration
- Implement proper authentication checks
- Write self-documenting code
- Add comments for complex logic

---

## Upcoming Features

### Phase 2 (In Development)

**Application Management**
- Student application portal
- Application submission and tracking
- Document upload and verification
- Application status management

**Interview Management**
- Interview scheduling system
- Panelist assignment
- Interview feedback collection
- Result processing

**Trainee Onboarding**
- Student profile creation
- Batch assignment
- Attendance tracking
- Performance monitoring

### Phase 3 (Planned)

**Assignment System**
- Assignment creation and distribution
- Submission management
- Auto-grading for coding assignments
- Feedback and review system

**Task Tracking**
- Daily coding problems
- Coding contest integration
- Seminar scheduling
- Progress tracking

**Analytics & Reporting**
- Performance dashboards
- Progress visualization
- Custom report generation
- Data export capabilities

**Placement Management**
- Company onboarding
- Job posting management
- Application tracking
- Placement statistics

**Mentorship System**
- Mentor-student assignment
- One-on-one session scheduling
- Feedback and progress tracking
- Communication platform

---

## Contributing

This project is currently maintained by the development team. If you're part of the team:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request to the `dev` branch

### Pull Request Guidelines

- Follow the commit message convention
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass
- Keep PRs focused on a single feature/fix
- Add screenshots for UI changes

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
- Live Application: Coming Soon

---

## Acknowledgments

- **React Team** for the powerful UI library
- **Vite Team** for the blazing fast build tool
- **Lucide React** for beautiful icon system
- **React Router** for seamless navigation
- **Axios** for reliable HTTP client
- **Material-UI** for component inspiration
- **Google reCAPTCHA** for bot protection
- **Vercel** for deployment platform

---
<div align="center">

**Made for comprehensive training management**

Star this repo if you find it helpful!

</div>
