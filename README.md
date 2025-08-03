# Employee Management System
A comprehensive, role-based HR Management System built with Angular frontend and Spring Boot backend, featuring modern UI/UX design principles and robust security.

## 🎯 Project Overview

This HR Management System provides a complete solution for managing employees, attendance, leaves, payroll, and performance with role-based access control. The system is designed with a clean, minimalistic UI and follows modern development practices.

## 🏗️ Architecture

### Frontend
- **Framework**: Angular 17
- **UI Library**: Angular Material
- **Styling**: CSS with responsive design
- **State Management**: RxJS Observables
- **Charts**: Chart.js with ng2-charts
- **Date Handling**: date-fns and moment.js

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: SQLite (embedded)
- **Security**: Spring Security with JWT
- **Documentation**: Swagger/OpenAPI
- **Build Tool**: Maven

## 👥 Key Personas (Roles)

### Admin (HR/Admin)
- Full access to all employee data and approval workflows
- Manage user accounts, roles, and permissions
- View system-wide statistics and reports
- Approve leaves and performance reviews

### Manager (Team Lead/Department Head)
- Access to team data and performance reviews
- Approve leaves for team members
- View team attendance and performance metrics
- Manage team member profiles

### Employee (Staff)
- Self-service access to personal profile
- View and manage attendance records
- Submit and track leave requests
- Access personal performance reviews

### IT Support
- Limited access to technical/maintenance logs
- System monitoring and troubleshooting
- User account management (limited scope)

## 🎨 Core UX Design Principles

- **Clean, minimalistic UI** with intuitive navigation
- **Role-based dashboards** tailored to user permissions
- **Mobile-first design** with responsive layout
- **Dark/light mode toggle** for user preference
- **Micro-interactions** (hover previews, success animations)
- **Accessibility** compliant design

## 📦 Feature Modules

### 1. Dashboard (Role-Based)
- **Admin View**: Total employees, new hires, pending leaves, department-wise headcount
- **Employee View**: Attendance stats, leaves left, upcoming holidays, self-service panel
- **Widgets**: Gender ratio, attrition rate, quick actions

### 2. Employee Directory
- Searchable and filterable employee list
- Toggle between Card View and Table View
- Live status indicators (Online/Remote/Offline)
- Hover preview for quick information

### 3. Employee Profile
- **Tabs**: Overview, Job Info, Documents, Attendance, Projects, Reviews
- Document upload functionality
- Chat/message employee feature
- Performance history

### 4. Attendance Management
- Monthly calendar view
- Punch in/out with geolocation tracking
- Optional biometric sync
- Absence pattern analytics
- Working hours calculation

### 5. Leave Management
- Leave request form (full/half-day with type)
- View leave history and balance
- Manager approval workflow
- Email & in-app notifications

### 6. Payroll Management
- Monthly and YTD salary breakdown
- Download payslips
- View tax deductions and bonuses
- Integration-ready for external payroll systems

### 7. Performance Management
- Goal setting with OKRs
- 360° feedback (self, manager, peer)
- Appraisal tracking and rating visualization
- AI-based performance suggestions

## 🔐 Security Features

- **JWT-based authentication** with role-based authorization
- **Secure password hashing** using BCrypt
- **Session timeout** and refresh token strategy
- **CORS configuration** for cross-origin requests
- **Input validation** and sanitization
- **SQL injection prevention** with JPA

## 🚀 Getting Started

### Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **Angular CLI 17**
- **Maven 3.6** or higher

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hr-management-system/backend
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Access the application**
   - Application: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - API Documentation: http://localhost:8080/v3/api-docs

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:4200

## 📁 Project Structure

```
hr-management-system/
├── backend/
│   ├── src/main/java/com/hrm/system/
│   │   ├── config/           # Configuration classes
│   │   ├── controller/       # REST controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Data access layer
│   │   ├── security/        # Security configuration
│   │   └── service/         # Business logic
│   ├── src/main/resources/
│   │   └── application.yml  # Application configuration
│   └── pom.xml             # Maven dependencies
├── frontend/
│   ├── src/app/
│   │   ├── components/      # Reusable components
│   │   ├── guards/          # Route guards
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── models/          # TypeScript interfaces
│   │   ├── pages/           # Feature pages
│   │   ├── services/        # API services
│   │   └── shared/          # Shared components
│   ├── src/environments/    # Environment configuration
│   └── package.json         # Node dependencies
└── README.md
```

## 🛠️ Development

### Backend Development

- **API Endpoints**: RESTful APIs with proper HTTP methods
- **Validation**: Bean Validation for request/response validation
- **Error Handling**: Global exception handling with proper error responses
- **Logging**: Structured logging with SLF4J
- **Testing**: Unit and integration tests with JUnit and Mockito

### Frontend Development

- **Component Architecture**: Modular component design
- **Service Layer**: Centralized API communication
- **State Management**: Reactive programming with RxJS
- **Form Handling**: Reactive forms with validation
- **Routing**: Lazy-loaded feature modules
- **Testing**: Unit tests with Jasmine and Karma

## 📊 Database Schema

The system uses SQLite with the following main entities:

- **Users**: Employee information and authentication
- **Attendance**: Daily attendance records
- **Leaves**: Leave requests and approvals
- **Payroll**: Salary and payment information
- **Performance**: Performance reviews and ratings

## 🔧 Configuration

### Backend Configuration

Key configuration in `application.yml`:
- Database connection
- JWT secret and expiration
- CORS settings
- Logging levels

### Frontend Configuration

Environment-specific settings in `environment.ts`:
- API endpoints
- Feature flags
- Pagination settings
- Upload limits

## 🧪 Testing

### Backend Testing
```bash
# Run unit tests
mvn test

# Run integration tests
mvn verify

# Generate test coverage report
mvn jacoco:report
```

### Frontend Testing
```bash
# Run unit tests
npm test

# Run e2e tests
npm run e2e

# Generate test coverage
npm run test:coverage
```

## 📦 Deployment

### Backend Deployment
```bash
# Build JAR file
mvn clean package

# Run JAR file
java -jar target/hr-management-system-1.0.0.jar
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to web server
# Copy dist/ folder to web server directory
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core HR features
- **v1.1.0** - Added performance management and enhanced UI
- **v1.2.0** - Mobile responsiveness and dark mode
- **v1.3.0** - Advanced reporting and analytics

## 🙏 Acknowledgments

- Angular team for the excellent framework
- Spring Boot team for the robust backend framework
- Angular Material for the UI components
- Chart.js for data visualization
- The open-source community for various libraries and tools 