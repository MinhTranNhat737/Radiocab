# RadioCabs API Server

A comprehensive REST API server for the RadioCabs taxi management system built with Node.js, Express, and SQL Server.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Database Integration**: Full SQL Server integration with connection pooling
- **RESTful API**: Complete CRUD operations for all entities
- **File Upload**: Support for image uploads with validation
- **Search & Filtering**: Advanced search capabilities across all entities
- **Admin Panel**: Administrative functions for approval workflows
- **Dashboard Analytics**: Comprehensive statistics and reporting
- **Rate Limiting**: Built-in rate limiting for API protection
- **Validation**: Request validation using express-validator
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js (v16 or higher)
- SQL Server (2016 or higher)
- npm or yarn

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   ```

3. **Configure Environment Variables**
   Edit the `.env` file with your database and server configuration:
   ```env
   # Database Configuration
   DB_SERVER=localhost
   DB_NAME=Radiocabs
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_PORT=1433
   DB_ENCRYPT=true
   DB_TRUST_SERVER_CERTIFICATE=true

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_EXPIRES_IN=30d

   # Server Configuration
   PORT=3001
   NODE_ENV=development
   ```

4. **Database Setup**
   Run the SQL Server schema script to create the database and tables.

## 🚀 Running the Server

### Development Mode
```bash
npm run api:dev
```

### Production Mode
```bash
npm run api:build
npm run api:start
```

The server will start on `http://localhost:3001` (or your configured PORT).

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api/v1
```

### Authentication

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "role_id": 2
}
```

### Companies

#### Get All Companies
```http
GET /api/v1/companies?page=1&limit=10&search=company&status=active
Authorization: Bearer <token>
```

#### Get Company by ID
```http
GET /api/v1/companies/1
Authorization: Bearer <token>
```

#### Create Company
```http
POST /api/v1/companies
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "ABC Taxi Company",
  "contact_person": "John Doe",
  "address_line": "123 Main St",
  "city_id": 1,
  "mobile": "+1234567890",
  "email": "contact@abctaxi.com",
  "membership_type_id": 1
}
```

#### Update Company
```http
PUT /api/v1/companies/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Company Name",
  "status": "active"
}
```

#### Delete Company
```http
DELETE /api/v1/companies/1
Authorization: Bearer <token>
```

### Drivers

#### Get All Drivers
```http
GET /api/v1/drivers?page=1&limit=10&search=driver&status=active
Authorization: Bearer <token>
```

#### Create Driver
```http
POST /api/v1/drivers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "address_line": "456 Oak Ave",
  "city_id": 1,
  "mobile": "+1234567890",
  "email": "jane@example.com",
  "experience_years": 5
}
```

### Advertisements

#### Get All Advertisements
```http
GET /api/v1/advertisements?page=1&limit=10&status=active
Authorization: Bearer <token>
```

#### Create Advertisement
```http
POST /api/v1/advertisements
Authorization: Bearer <token>
Content-Type: application/json

{
  "company_id": 1,
  "title": "Special Airport Service",
  "description": "24/7 airport transportation",
  "status_id": 2,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31"
}
```

### Subscriptions

#### Get All Subscriptions
```http
GET /api/v1/subscriptions?page=1&limit=10&status=active
Authorization: Bearer <token>
```

#### Create Subscription
```http
POST /api/v1/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan_id": 1,
  "status_id": 2,
  "start_date": "2024-01-01",
  "end_date": "2024-02-01",
  "company_id": 1
}
```

### Payments

#### Get All Payments
```http
GET /api/v1/payments?page=1&limit=10&status=paid
Authorization: Bearer <token>
```

#### Create Payment
```http
POST /api/v1/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "subscription_id": 1,
  "amount": 15.00,
  "currency": "USD",
  "method_id": 1,
  "status_id": 2,
  "txn_ref": "TXN123456"
}
```

### File Upload

#### Upload Single File
```http
POST /api/v1/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <file>
type: logo
```

#### Upload Multiple Files
```http
POST /api/v1/upload/multiple
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: <files>
type: ad_creative
```

### Search

#### Global Search
```http
GET /api/v1/search?query=taxi&type=all&page=1&limit=10
Authorization: Bearer <token>
```

#### Search Companies
```http
GET /api/v1/search/companies?query=company&page=1&limit=10
Authorization: Bearer <token>
```

### Dashboard

#### Get Dashboard Stats
```http
GET /api/v1/dashboard/stats
Authorization: Bearer <token>
```

#### Get Company Dashboard
```http
GET /api/v1/companies/1/dashboard
Authorization: Bearer <token>
```

### Admin Functions

#### Approve Company
```http
POST /api/v1/admin/companies/1/approve
Authorization: Bearer <token>
```

#### Reject Company
```http
POST /api/v1/admin/companies/1/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Incomplete documentation"
}
```

## 🔐 Authentication

All API endpoints (except login and register) require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## 📊 Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Error description"
}
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different access levels for different user types
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Configurable cross-origin resource sharing

## 📁 Project Structure

```
server/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── validation.js       # Request validation
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── companies.js        # Company management
│   ├── drivers.js          # Driver management
│   ├── advertisements.js   # Advertisement management
│   ├── subscriptions.js    # Subscription management
│   ├── payments.js         # Payment management
│   ├── reviews.js          # Review management
│   ├── dashboard.js       # Dashboard analytics
│   ├── lookup.js           # Lookup data
│   ├── upload.js           # File upload
│   ├── search.js           # Search functionality
│   └── admin.js            # Admin functions
├── index.js                # Main server file
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
└── README.md               # This file
```

## 🚨 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## 📈 Performance

- **Connection Pooling**: Efficient database connection management
- **Rate Limiting**: Prevents API abuse
- **Compression**: Response compression for better performance
- **Caching**: Strategic caching for lookup data

## 🔧 Configuration

Key configuration options in `.env`:

- `DB_SERVER`: SQL Server hostname
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 3001)
- `CORS_ORIGIN`: Allowed origins for CORS

## 🧪 Testing

The API can be tested using tools like:
- Postman
- Insomnia
- curl
- Any HTTP client

## 📝 Logs

The server logs all requests and errors. Check the console output for debugging information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review the error logs
- Contact the development team

---

**Happy Coding! 🚀**
