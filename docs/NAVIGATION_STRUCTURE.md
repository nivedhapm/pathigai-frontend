# Pathigai Frontend Navigation Structure

## Application Architecture Overview

### Route Hierarchy
```
/ (Landing)
├── /login
├── /signup
├── /email-verification
├── /sms-verification
├── /forgot-password
├── /reset-password
├── /company-info
└── /dashboard
    ├── /dashboard (Main Dashboard - Profile-based)
    ├── /dashboard/users (User Management - Admin only)
    └── /dashboard/* (Future protected routes)
```

## Authentication Flow & Route Protection

### Public Routes (No Authentication Required)
- **/** - Landing page with auth options
- **/login** - User login with email/username
- **/signup** - New user registration
- **/email-verification** - Email OTP verification
- **/sms-verification** - SMS OTP verification  
- **/forgot-password** - Password reset request
- **/reset-password** - Password reset form
- **/company-info** - Company registration details

### Protected Routes (Authentication Required)

#### Main Dashboard Route
```jsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

#### User Management Route (Admin Access Only)
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

## Profile-Based Dashboard Components

### Dashboard Rendering Logic
The `DashboardPage` dynamically renders content based on:
1. **User Profile** (SUPER_ADMIN, ADMIN, MANAGEMENT, etc.)
2. **Content Type** (user-management, default dashboard)

### Supported User Profiles
- **SUPER_ADMIN** → SuperAdminDashboard
- **ADMIN** → AdminDashboard  
- **MANAGEMENT** → ManagementDashboard
- **TRAINER** → TrainerDashboard
- **INTERVIEW_PANELIST** → InterviewPanelistDashboard
- **PLACEMENT** → PlacementDashboard
- **TRAINEE** → TraineeDashboard
- **APPLICANT** → Applicant Portal (no profile)

## User Management Navigation Structure

### User Management Page Structure
```
/dashboard/users
├── Add Users Tab
│   ├── Single User Creation (UserForm)
│   └── Bulk CSV Upload (BulkUploadCSV)
├── Manage Users Tab
│   ├── User Search & Filtering
│   ├── User Profile Editing
│   └── Role/Permission Updates
└── Delete Users Tab
    ├── Single User Deletion
    └── Bulk User Operations
```

### User Management Access Control
- **Required Profiles**: `['SUPER_ADMIN', 'ADMIN', 'MANAGEMENT']`
- **Route Protection**: Enforced by `ProtectedRoute` component
- **Component Level**: Additional permissions checked within components

## Route Protection Implementation

### ProtectedRoute Component Features
```jsx
<ProtectedRoute 
  requiredProfile="SUPER_ADMIN"           // Single profile requirement
  requiredRole="ADMIN"                    // Single role requirement  
  allowedProfiles={['ADMIN', 'MANAGEMENT']} // Multiple profile options
>
  <YourComponent />
</ProtectedRoute>
```

### Protection Levels
1. **Authentication Check** - Valid JWT token required
2. **Session Validation** - Token expiration and refresh handling
3. **Profile Authorization** - User profile/role verification
4. **Dynamic Access Control** - Real-time permission updates

## Navigation State Management

### Route State Handling
- **Loading States** - Spinner during auth verification
- **Error States** - Access denied with user-friendly messages
- **Redirect Logic** - Preserves intended destination after login
- **Session Recovery** - Automatic token refresh and recovery

### URL Parameters & State
- **Authentication Redirects** - `/login?redirect=/dashboard/users`
- **Content Type Routing** - `/dashboard?content=user-management`
- **Search State Persistence** - Query parameters for user filters

## Mobile & Responsive Navigation

### Responsive Dashboard Layout
- **Mobile Menu** - Collapsible navigation drawer
- **Tab Navigation** - Optimized for touch on user management
- **Responsive Tables** - Horizontal scroll for data tables
- **Modal Management** - Full-screen modals on mobile

## Security Considerations

### Route-Level Security
- **Token Validation** - Every protected route validates JWT
- **Profile Verification** - Server-side profile confirmation
- **Session Monitoring** - Real-time session expiration handling
- **CSRF Protection** - Anti-CSRF token integration

### Navigation Security
- **URL Manipulation Protection** - Server validates all route access
- **State Management Security** - No sensitive data in browser history
- **Access Logging** - Route access attempts logged for audit

## Future Navigation Extensions

### Planned Routes Structure
```
/dashboard
├── /analytics (Data visualization dashboards)
├── /reports (Report generation and viewing)
├── /settings (System configuration)
├── /integrations (Third-party service management)
├── /notifications (Alert and notification center)
└── /audit (System audit logs and compliance)
```

### Extension Pattern
```jsx
// New protected route pattern
<Route 
  path="/dashboard/new-feature" 
  element={
    <ProtectedRoute allowedProfiles={['ADMIN', 'SUPER_ADMIN']}>
      <DashboardPage content="new-feature" />
    </ProtectedRoute>
  } 
/>
```

## Performance Optimizations

### Route-Level Optimizations
- **Lazy Loading** - Dynamic imports for dashboard components
- **Route Prefetching** - Preload likely next routes
- **Component Caching** - Memoization for heavy dashboard components
- **Bundle Splitting** - Separate bundles per major feature

### Navigation Performance
- **Virtual Scrolling** - Large user lists in management
- **Progressive Loading** - Incremental data loading
- **State Persistence** - Maintain scroll position and filters
- **Background Updates** - Silent data refresh during navigation

## Error Handling & Fallbacks

### Route Error Boundaries
```jsx
// Error boundary for protected routes
<ErrorBoundary fallback={<RouteErrorFallback />}>
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
</ErrorBoundary>
```

### Navigation Error Recovery
- **Network Failures** - Retry mechanisms for route loading
- **Permission Errors** - Clear user messaging and fallback routes  
- **Session Expiration** - Automatic login redirect with state preservation
- **Component Failures** - Graceful degradation to basic functionality

## Development & Testing Guidelines

### Route Testing Strategy
- **Unit Tests** - Individual route protection logic
- **Integration Tests** - End-to-end navigation flows
- **Permission Tests** - Access control verification
- **Performance Tests** - Route loading and transition times

### Navigation Development Best Practices
- **Consistent URL Structure** - Follow RESTful patterns
- **Accessibility** - Screen reader navigation support
- **SEO Considerations** - Meta tags and structured data
- **Analytics Integration** - Route change tracking and user journey analysis

---

*This navigation structure supports the full user management system with proper security, scalability, and user experience considerations.*