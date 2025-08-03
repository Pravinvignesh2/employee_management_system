export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  appName: 'HR Management System',
  version: '1.0.0',
  defaultLanguage: 'en',
  supportedLanguages: ['en'],
  dateFormat: 'MM/dd/yyyy',
  timeFormat: 'HH:mm:ss',
  currency: 'USD',
  timezone: 'UTC',
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100]
  },
  features: {
    darkMode: true,
    notifications: true,
    fileUpload: true,
    export: true,
    import: true,
    realTimeUpdates: false
  },
  auth: {
    tokenKey: 'hrms_token',
    refreshTokenKey: 'hrms_refresh_token',
    userKey: 'hrms_user',
    tokenExpiryKey: 'hrms_token_expiry'
  },
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxFiles: 5
  },
  charts: {
    colors: [
      '#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0',
      '#00BCD4', '#8BC34A', '#FF5722', '#795548', '#607D8B'
    ]
  }
}; 