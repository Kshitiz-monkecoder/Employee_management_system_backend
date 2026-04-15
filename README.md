# HRMS Backend API

HR Management System backend built with **Node.js + Express + MongoDB**.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Validation:** Joi
- **Logging:** Winston + Morgan
- **Security:** Helmet, CORS, express-rate-limit

---

## Project Structure

```
src/
├── config/         # DB connection, logger
├── controllers/    # HTTP request handlers
├── middlewares/    # Auth, error handler, audit logger, validation
├── models/         # Mongoose schemas
├── repositories/   # DB query logic
├── routes/         # Express routers
├── services/       # Business logic
└── utils/          # AppError, catchAsync, APIFeatures, seeder
```

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Seed the database
```bash
npm run seed
```

### 4. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

---

## Default Seed Credentials

| Role     | Email                | Password    |
|----------|----------------------|-------------|
| Admin    | admin@hrms.com       | Admin@1234  |
| HR       | hr@hrms.com          | Hr@1234     |
| Employee | employee@hrms.com    | Emp@1234    |

---

## API Endpoints

### Auth
| Method | Endpoint             | Access        | Description          |
|--------|----------------------|---------------|----------------------|
| POST   | /api/auth/login      | Public        | Login, returns JWT   |
| POST   | /api/auth/register   | Admin only    | Create new user      |
| GET    | /api/auth/me         | Authenticated | Get current user     |
| POST   | /api/auth/logout     | Authenticated | Logout               |

### Employees
| Method | Endpoint                  | Access        | Description          |
|--------|---------------------------|---------------|----------------------|
| GET    | /api/employees            | All           | List all employees   |
| POST   | /api/employees            | Admin, HR     | Create employee      |
| GET    | /api/employees/:id        | All           | Get employee by ID   |
| PUT    | /api/employees/:id        | Admin, HR     | Update employee      |
| DELETE | /api/employees/:id        | Admin only    | Delete employee      |
| GET    | /api/employees/stats      | Admin, HR     | Stats by department  |

### Departments
| Method | Endpoint                  | Access        | Description          |
|--------|---------------------------|---------------|----------------------|
| GET    | /api/departments          | All           | List all departments |
| POST   | /api/departments          | Admin, HR     | Create department    |
| GET    | /api/departments/:id      | All           | Get department       |
| PUT    | /api/departments/:id      | Admin, HR     | Update department    |
| DELETE | /api/departments/:id      | Admin only    | Delete department    |

### Attendance
| Method | Endpoint                                         | Access    | Description           |
|--------|--------------------------------------------------|-----------|-----------------------|
| GET    | /api/attendance                                  | Admin, HR | All records           |
| POST   | /api/attendance                                  | Admin, HR | Mark attendance       |
| PUT    | /api/attendance/:id                              | Admin, HR | Update record         |
| DELETE | /api/attendance/:id                              | Admin     | Delete record         |
| GET    | /api/attendance/employee/:employeeId             | All       | Employee attendance   |
| GET    | /api/attendance/employee/:employeeId/summary     | All       | Monthly summary       |

### Payroll
| Method | Endpoint                         | Access    | Description           |
|--------|----------------------------------|-----------|-----------------------|
| GET    | /api/payroll                     | Admin, HR | All payrolls          |
| POST   | /api/payroll                     | Admin     | Create payroll        |
| GET    | /api/payroll/:id                 | Admin, HR | Get payroll           |
| PUT    | /api/payroll/:id                 | Admin     | Update payroll        |
| DELETE | /api/payroll/:id                 | Admin     | Delete payroll        |
| GET    | /api/payroll/employee/:id        | All       | Employee payroll      |
| POST   | /api/payroll/:id/process         | Admin     | Process monthly pay   |
| GET    | /api/payroll/stats               | Admin     | Payroll cost stats    |

### Audit Logs
| Method | Endpoint                         | Access | Description           |
|--------|----------------------------------|--------|-----------------------|
| GET    | /api/audit-logs                  | Admin  | All audit logs        |
| GET    | /api/audit-logs/user/:userId     | Admin  | Logs by user          |

---

## Query Parameters (all list endpoints)

| Param    | Example                        | Description               |
|----------|--------------------------------|---------------------------|
| page     | ?page=2                        | Pagination page           |
| limit    | ?limit=20                      | Results per page          |
| sort     | ?sort=-createdAt               | Sort field (- = desc)     |
| fields   | ?fields=name,email             | Field projection          |
| search   | ?search=alice                  | Full-text search          |
| filters  | ?status=active                 | Field filters             |

---

## Health Check

```
GET /health
```

Returns server status and environment info.
