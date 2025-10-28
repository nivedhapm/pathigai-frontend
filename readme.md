# Pathigai (பதிகை) - Frontend

<div align="center">

![Pathigai Logo](https://via.placeholder.com/150x150?text=Pathigai)

**Track. Train. Transform. | Guiding Every Step to Success.**

A comprehensive Student Progress Tracking System from registration to placement.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[Live Demo](https://your-vercel-url.vercel.app) • [Backend Repo](https://github.com/nivedhapm/pathigai-backend) • [Report Issue](https://github.com/nivedhapm/pathigai-frontend/issues)

</div>

---

## 📖 About Pathigai

**Pathigai** (பதிகை) meaning "a trace, log, or record" - is a B2B web application designed to track students' complete training journey from initial application through to placement. Built for training institutions and organizations, it provides role-based dashboards for Students, Faculty, HR, Admins, Interview Panelists, and Mentors.

---

## ✨ Features (Implemented)

### 🔐 Module 1: Authentication & Access Control
- **Role-Based Login System** - Secure authentication for Admin, Faculty, HR, Interview Panelists, Mentors, and Trainees
- **Multi-Level User Roles** with granular permissions
- **Password Security** - Bcrypt encryption, mandatory password reset on first login
- **CAPTCHA Integration** - Bot protection on signup and login forms
- **Forgot Password & Reset** functionality with email verification
- **JWT-Based Session Management** for stateless authentication

### 👥 Module 2: User Management
- **Super Admin Dashboard** - Predefined account for system-wide control
- **User Account Management** - Add, remove, and manage Faculty, Mentor, HR, and Admin accounts
- **Application Portal Control** - Open/close trainee application periods
- **Profile Management** - User profile viewing and editing capabilities
- **Credential Management** - Automatic Zoho mail + temporary password generation

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React.js** | Frontend framework for building dynamic UI |
| **HTML5/CSS3** | Structure and styling |
| **JavaScript (ES6+)** | Core logic and interactivity |
| **Recharts** | Simple analytics and progress visualizations |
| **Chart.js** | Complex dashboards and performance metrics |
| **Axios** | HTTP client for REST API communication |
| **React Router** | Client-side routing |
| **JWT** | Token-based authentication |

---

## 📁 Project Structure

```
pathigai-frontend/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── Dashboard/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── FacultyDashboard.jsx
│   │   │   ├── HRDashboard.jsx
│   │   │   └── TraineeDashboard.jsx
│   │   ├── UserManagement/
│   │   │   ├── UserList.jsx
│   │   │   ├── AddUser.jsx
│   │   │   └── EditUser.jsx
│   │   └── Common/
│   │       ├── Header.jsx
│   │       ├── Sidebar.jsx
│   │       └── Footer.jsx
│   ├── services/
│   │   ├── authService.js
│   │   └── userService.js
│   ├── utils/
│   │   ├── api.js
│   │   └── validators.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16.x or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nivedhapm/pathigai-frontend.git
   cd pathigai-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8080/api
   REACT_APP_API_TIMEOUT=10000
   REACT_APP_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

   The application will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `build/` directory.

---

## 🌿 Branching Strategy

- **`main`** - Production-ready code, deployed on Vercel
- **`dev`** - Active development branch for daily commits and testing

### Workflow
```bash
# Switch to dev branch
git checkout dev

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push to dev
git push origin dev

# When ready for production, merge to main
git checkout main
git merge dev
git push origin main
```

---

## 🔗 API Integration

The frontend communicates with the backend via REST APIs:

**Base URL:** `https://your-backend-url.com/api`

### Key Endpoints
- **POST** `/auth/login` - User login
- **POST** `/auth/register` - User registration
- **POST** `/auth/forgot-password` - Request password reset
- **POST** `/auth/reset-password` - Reset password
- **GET** `/users` - Fetch all users (Admin only)
- **POST** `/users` - Create new user (Admin only)
- **PUT** `/users/:id` - Update user
- **DELETE** `/users/:id` - Delete user (Admin only)

---

## 🎨 UI/UX Design

The UI prototypes are designed using **Figma**. The application follows a clean, modern design with:
- Responsive layout for desktop and mobile
- Role-based dashboard interfaces
- Intuitive navigation with sidebar and breadcrumbs
- Accessible color schemes and typography

---

## 🖼️ Screenshots

### Login Page
![Login Screenshot](https://via.placeholder.com/800x500?text=Login+Page)

### Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/800x500?text=Admin+Dashboard)

### User Management
![User Management](https://via.placeholder.com/800x500?text=User+Management)

---

## 🚧 Upcoming Features

### Phase 2 (In Development)
- Application & Interview Management
- Trainee Onboarding & Profile Management
- Trainee Dashboard with Attendance Tracking

### Phase 3 (Planned)
- Assignment Management System
- Task Tracking (Coding Contests, Seminars, Daily Problems)
- Performance Analytics & Reporting
- Placement Management
- Mentorship & Feedback System

---

## 🤝 Contributing

Contributions are currently limited to project team members. If you're part of the team:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request to `dev` branch

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Project Maintainer:** Nivedha PM

- GitHub: [@nivedhapm](https://github.com/nivedhapm)
- Email: your.email@example.com

**Project Links:**
- Frontend Repository: [https://github.com/nivedhapm/pathigai-frontend](https://github.com/nivedhapm/pathigai-frontend)
- Backend Repository: [https://github.com/nivedhapm/pathigai-backend](https://github.com/nivedhapm/pathigai-backend)
- Live Application: [Your Vercel URL]

---

## 🙏 Acknowledgments

- Built for ZSGS (Zoho Schools of Graduate Studies)
- Duration: 3 months development cycle
- Target Audience: Training institutions, students, and placement teams

---

<div align="center">

**Made with ❤️ for tracking student progress**

</div>
