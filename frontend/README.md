# HR Management System - Frontend

A modern, responsive Angular frontend for the Role-Based HR Management System with Material Design and role-based access control.

## 🚀 Features

### 🎨 Modern UI/UX
- **Material Design**: Clean, modern interface using Angular Material
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Dark/Light Theme**: Toggle between dark and light themes
- **Micro-interactions**: Smooth animations and hover effects
- **Accessibility**: WCAG compliant with keyboard navigation

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Different views and permissions based on user roles
- **Route Guards**: Protected routes with authentication and role checks
- **Auto Token Refresh**: Automatic token refresh before expiration
- **Secure HTTP**: Interceptors for adding auth headers and error handling

### 📊 Role-Based Dashboards
- **Admin Dashboard**: System overview, employee management, analytics
- **Manager Dashboard**: Team management, leave approvals, performance reviews
- **Employee Dashboard**: Personal info, attendance, leave requests
- **IT Support Dashboard**: System logs, maintenance, technical reports

### 👥 Core Modules
- **Employee Directory**: Searchable employee database with filters
- **Employee Profiles**: Detailed employee information and documents
- **Attendance Management**: Punch in/out with geolocation
- **Leave Management**: Request and approval workflow
- **Payroll Management**: Salary and compensation tracking
- **Performance Management**: Reviews and evaluations

## 🛠 Tech Stack

- **Framework**: Angular 17
- **UI Library**: Angular Material
- **State Management**: RxJS BehaviorSubject
- **HTTP Client**: Angular HttpClient with interceptors
- **Routing**: Angular Router with guards
- **Styling**: CSS with CSS Variables for theming
- **Charts**: Chart.js with ng2-charts
- **Date Handling**: date-fns and moment.js
- **Build Tool**: Angular CLI

## 📋 Prerequisites

- Node.js 18+ and npm
- Angular CLI 17+
- Git

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

The application will start on `http://localhost:4200`

### 3. Build for Production
```bash
npm run build
```

## 🔑 Default Credentials

Use the same credentials as the backend:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hrm.com | admin123 |
| Manager | manager@hrm.com | manager123 |
| Employee | employee@hrm.com | employee123 |
| IT Support | support@hrm.com | support123 |

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Reusable components
│   ├── pages/              # Page components
│   │   ├── login/          # Authentication pages
│   │   ├── dashboard/      # Role-based dashboards
│   │   ├── employee-directory/
│   │   ├── employee-profile/
│   │   ├── attendance/
│   │   ├── leave-management/
│   │   ├── payroll/
│   │   ├── performance/
│   │   └── settings/
│   ├── services/           # API services
│   ├── models/             # TypeScript interfaces
│   ├── guards/             # Route guards
│   ├── interceptors/       # HTTP interceptors
│   └── shared/             # Shared components
├── assets/                 # Static assets
├── environments/           # Environment configuration
└── styles.css             # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary**: #3f51b5 (Indigo)
- **Accent**: #ff4081 (Pink)
- **Success**: #4caf50 (Green)
- **Warning**: #ff9800 (Orange)
- **Error**: #f44336 (Red)
- **Info**: #2196f3 (Blue)

### Typography
- **Font Family**: Roboto
- **Headings**: 500 weight
- **Body**: 400 weight
- **Captions**: 300 weight

### Spacing
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px

## 🔐 Authentication Flow

1. **Login**: User enters credentials
2. **Token Storage**: JWT token stored in localStorage
3. **Route Protection**: Guards check authentication
4. **Auto Refresh**: Token refreshed before expiration
5. **Logout**: Clear tokens and redirect to login

## 🛡️ Security Features

- **JWT Token Management**: Secure token storage and refresh
- **Route Guards**: Authentication and role-based protection
- **HTTP Interceptors**: Automatic token injection and error handling
- **Input Validation**: Form validation and sanitization
- **XSS Protection**: Angular's built-in XSS protection
- **CSRF Protection**: Token-based CSRF protection

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- **Touch-friendly**: Large touch targets
- **Swipe gestures**: Navigation and actions
- **Offline support**: Service worker for offline functionality
- **Progressive Web App**: Installable as PWA

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run e2e
```

### Code Coverage
```bash
npm run test:coverage
```

## 📦 Build & Deployment

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build:prod
```

### Docker Deployment
```bash
# Build Docker image
docker build -t hr-management-frontend .

# Run container
docker run -p 80:80 hr-management-frontend
```

## 🔧 Configuration

### Environment Variables
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  appName: 'HR Management System',
  version: '1.0.0'
};
```

### API Configuration
- **Base URL**: Configurable via environment
- **Timeout**: 30 seconds
- **Retry Logic**: Automatic retry on network errors
- **Caching**: HTTP caching for static resources

## 📈 Performance Optimization

- **Lazy Loading**: Route-based code splitting
- **Tree Shaking**: Unused code elimination
- **Bundle Optimization**: Minification and compression
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Browser and service worker caching
- **CDN**: Static assets served from CDN

## 🔍 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

## 🔄 Version History

- **v1.0.0**: Initial release with core HR features
- Modern Angular 17 architecture
- Material Design implementation
- Role-based access control
- Responsive design
- JWT authentication 