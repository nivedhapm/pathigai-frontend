# Pathigai Frontend - Authentication Module

A modern authentication system built with Vite + React.js + Plain CSS for the Pathigai platform.

## 🚀 Features

- **Complete Authentication Flow**
  - Landing Page with Sign Up/Login options
  - User Registration with form validation
  - Email & SMS OTP verification
  - Login with email/password
  - Password reset functionality
  - Company information setup
  
- **Modern UI/UX**
  - Dark/Light theme toggle
  - Responsive design for all devices
  - Floating background elements
  - Smooth animations and transitions
  - Clean, professional design

- **Component Architecture**
  - Reusable UI components
  - Modular file structure
  - Proper separation of concerns
  - Context-based theme management

## 📁 Project Structure

```
pathigai-frontend/
├── public/
│   ├── logo.svg                 # App logo
│   └── index.html              # Main HTML template
├── src/
│   ├── components/
│   │   ├── common/             # Shared components
│   │   │   ├── FloatingElements/
│   │   │   ├── Footer/
│   │   │   ├── LogoSection/
│   │   │   └── ThemeToggle/
│   │   └── ui/                 # UI components
│   │       ├── OTPInput/
│   │       └── PasswordInput/
│   ├── modules/
│   │   └── auth/               # Authentication module
│   │       └── pages/          # Page components
│   ├── shared/
│   │   └── contexts/           # React contexts
│   ├── styles/
│   │   └── globals.css         # Global styles
│   ├── App.jsx                 # Main app component
│   └── main.jsx               # Entry point
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Quick Start

1. **Clone & Install**
   ```bash
   # Create project directory
   mkdir pathigai-frontend
   cd pathigai-frontend

   # Initialize the project
   npm init -y
   
   # Install dependencies
   npm install react react-dom react-router-dom
   npm install -D @vitejs/plugin-react vite eslint
   ```

2. **Add Logo**
   - Place your `logo.svg` file in the `public/` directory

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Update your environment variables
   # VITE_RECAPTCHA_SITE_KEY=your_actual_site_key
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## 🎯 Available Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Welcome page with Sign Up/Login options |
| `/login` | LoginPage | User login form |
| `/signup` | SignupPage | User registration form |
| `/email-verification` | EmailVerificationPage | Email OTP verification |
| `/sms-verification` | SMSVerificationPage | SMS OTP verification |
| `/reset-password` | ResetPasswordPage | Password reset form |
| `/company-info` | CompanyInfoPage | Company setup form |

## 🔧 Key Components

### OTPInput Component
- 6-digit OTP input with auto-focus
- Paste support for OTP codes
- 60-second resend timer
- Form validation

### PasswordInput Component
- Toggle visibility (eye icon)
- Secure password input
- Consistent styling

### ThemeToggle Component
- Light/Dark mode switching
- Persistent theme state
- Smooth transitions

## 🎨 Styling

- **CSS Framework**: Plain CSS (no external frameworks)
- **Design System**: Custom design with CSS variables
- **Responsive**: Mobile-first approach
- **Themes**: Light and Dark mode support
- **Animations**: Floating elements and smooth transitions

## 🚀 Deployment Options

### Netlify (Recommended)
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Vercel
```bash
npx vercel
```

### Render
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔐 Security Features

- Form validation on client-side
- Google reCAPTCHA integration ready
- Secure password input handling
- Input sanitization

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Adding New Pages

1. Create page component in `src/modules/auth/pages/`
2. Add route in `src/App.jsx`
3. Follow existing patterns for consistency

### Customization

- **Colors**: Update CSS variables in `globals.css`
- **Fonts**: Modify Google Fonts import
- **Layout**: Adjust container widths and spacing
- **Components**: Extend existing components or create new ones

## 📦 Dependencies

### Production
- `react` - UI library
- `react-dom` - React DOM bindings
- `react-router-dom` - Client-side routing

### Development
- `@vitejs/plugin-react` - Vite React plugin
- `vite` - Build tool and dev server
- `eslint` - Code linting

## 🔄 Next Steps

1. **Backend Integration**
   - Connect to authentication APIs
   - Add JWT token management
   - Implement actual OTP sending

2. **Enhanced Features**
   - Social login (Google, Facebook)
   - Remember me functionality
   - Password strength indicator

3. **Additional Modules**
   - Dashboard
   - Profile management
   - Training modules
   - Analytics

## 📞 Support

For questions or issues, please check:
1. This README file
2. Component documentation in code
3. Create an issue in the project repository

## 📄 License

© 2025 Pathigai. All Rights Reserved.