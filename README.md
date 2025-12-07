# ClearBroker - Customer Onboarding Platform

A comprehensive customer onboarding platform built for customs brokers to manage their exporter and importer clients efficiently.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)

## 📋 Overview

ClearBroker is a full-stack web application that enables customs brokers to:
- Register and authenticate securely
- Onboard exporters and importers as customers
- Manage customer profiles with GSTIN validation
- Track customer status (Active/Pending/Inactive)
- Access admin dashboard for system-wide oversight

This project was built as part of a technical assessment to demonstrate end-to-end development capabilities including user authentication, database design, API development, and modern React UI.

## ✨ Features

### 🔐 Authentication & Authorization
- Secure user registration with bcrypt password hashing (10 salt rounds)
- Session-based authentication using PostgreSQL
- Protected routes with middleware
- Role-based access control (Admin/Broker)

### 👥 Customer Management
- Add new customers (Exporters/Importers)
- GSTIN validation with Indian tax ID format
- Customer status tracking (Active/Pending/Inactive)
- Email validation and data integrity checks

### 📊 Dashboard
- Real-time statistics (Total, Active, Pending customers)
- Customer list with type indicators
- Responsive card-based layout
- Filter by customer type

### 🛡️ Admin Features
- View all brokers in the system
- System-wide customer analytics
- Broker performance metrics
- Centralized user management

### 🎨 Modern UI/UX
- Clean, professional design with Tailwind CSS
- Dark/Light theme toggle
- Fully responsive (Desktop, Tablet, Mobile)
- Loading states and skeleton screens
- Toast notifications for user feedback
- Accessible components (Radix UI)

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Wouter (lightweight routing)
- TanStack Query (data fetching & caching)
- Tailwind CSS + shadcn/ui components
- React Hook Form + Zod validation

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL database
- Drizzle ORM (type-safe SQL)
- Express Session (authentication)

**Development Tools:**
- Vite (build tool)
- TSX (TypeScript execution)
- ESBuild (bundling)

### Project Structure

```
FarCylindricalLead/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Reusable UI components
│       │   ├── ui/       # shadcn/ui component library
│       │   ├── app-sidebar.tsx
│       │   └── theme-toggle.tsx
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # Utilities & context providers
│       ├── pages/        # Route components
│       │   ├── register.tsx      # Broker registration
│       │   ├── login.tsx         # Broker login
│       │   ├── dashboard.tsx     # Main dashboard
│       │   ├── add-customer.tsx  # Customer onboarding
│       │   └── admin.tsx         # Admin panel
│       └── App.tsx       # Main app component
├── server/               # Backend Express application
│   ├── db.ts            # Database connection
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API route handlers
│   ├── storage.ts       # Database queries
│   └── static.ts        # Static file serving
├── shared/              # Shared types & schemas
│   └── schema.ts        # Database schema & validation
└── script/              # Build scripts
```

### Database Schema

**Brokers Table:**
```sql
CREATE TABLE brokers (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,  -- Bcrypt hashed
  company_name TEXT,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Customers Table:**
```sql
CREATE TABLE customers (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  gstin VARCHAR(15) NOT NULL,  -- Indian GST Identification Number
  type TEXT NOT NULL,  -- 'exporter' | 'importer'
  status TEXT DEFAULT 'pending' NOT NULL,  -- 'active' | 'pending' | 'inactive'
  broker_id VARCHAR NOT NULL REFERENCES brokers(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### API Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new broker
- `POST /api/auth/login` - Login broker
- `POST /api/auth/logout` - Logout broker
- `GET /api/auth/me` - Get current broker

**Customers:**
- `GET /api/customers` - Get all customers for current broker
- `POST /api/customers` - Create new customer
- `PATCH /api/customers/:id/status` - Update customer status
- `DELETE /api/customers/:id` - Delete customer

**Admin:**
- `GET /api/admin/stats` - System-wide statistics
- `GET /api/admin/brokers` - List all brokers
- `GET /api/admin/customers` - List all customers

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd FarCylindricalLead
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database credentials:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/database
   SESSION_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

   **Quick Setup with Neon (Free Cloud Database):**
   - Sign up at https://neon.tech
   - Create a new project
   - Copy the connection string
   - Paste it in your `.env` file

4. **Initialize the database:**
   ```bash
   npm run db:push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   ```
   http://localhost:5000
   ```

### Building for Production

```bash
npm run build
npm start
```

## 🔒 Security

### Password Security
- Passwords are hashed using **bcrypt** with 10 salt rounds
- Never stored in plain text
- Passwords excluded from API responses

### Session Management
- Session data stored in PostgreSQL (not memory)
- HTTP-only cookies prevent XSS attacks
- Secure cookies in production
- 24-hour session expiry

### Input Validation
- **Server-side validation** using Zod schemas
- **Client-side validation** using React Hook Form
- GSTIN format validation with regex
- Email format validation
- SQL injection prevention via Drizzle ORM

### Best Practices Implemented
- Environment variables for sensitive data
- CORS configuration
- Parameterized queries (SQL injection prevention)
- Session secret rotation recommended
- Type-safe database queries

## 📸 Screenshots

### Registration Page
Clean and intuitive broker registration with real-time validation.

### Dashboard
Comprehensive view of customers with statistics and quick actions.

### Customer Onboarding
Simple form to onboard exporters and importers with GSTIN validation.

### Admin Panel
System-wide overview for administrators.

## 🧪 Testing

### Manual Testing Checklist

**Authentication Flow:**
- [ ] Register new broker account
- [ ] Login with credentials
- [ ] Session persists on refresh
- [ ] Logout clears session

**Customer Management:**
- [ ] Add new exporter with valid GSTIN
- [ ] Add new importer with valid GSTIN
- [ ] View customers on dashboard
- [ ] Update customer status
- [ ] Delete customer

**Validation:**
- [ ] Invalid email shows error
- [ ] Short password shows error
- [ ] Invalid GSTIN format rejected
- [ ] Duplicate email prevented

**UI/UX:**
- [ ] Responsive on mobile
- [ ] Dark/Light theme toggle works
- [ ] Loading states display
- [ ] Toast notifications appear

## 📝 Assignment Requirements Checklist

✅ **Page 1: Registration form for exporters/importers**
- Name, Email, GSTIN fields implemented
- Type selection (Exporter/Importer)

✅ **Backend stores customer**
- PostgreSQL with Drizzle ORM
- Foreign key relationship to broker

✅ **Route to dashboard with profile view**
- Automatic redirect after registration
- Dashboard shows broker info + customers

✅ **Dashboard shows data from API**
- Real-time data fetching with React Query
- Statistics and customer list

✅ **Bonus: Admin dashboard**
- System-wide analytics
- All brokers and customers view

✅ **Secure password handling**
- Bcrypt with 10 salt rounds
- Environment-based session secrets

✅ **Clean and consistent design**
- Modern UI with Tailwind CSS
- Responsive layout
- Dark/Light theme support

## 🤝 Contributing

This is a technical assessment project. For educational purposes, feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Aryan Rai**

Built as a technical assessment demonstrating:
- Full-stack development skills
- TypeScript proficiency
- Database design
- Security best practices
- Modern React patterns
- RESTful API design

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Drizzle ORM** for type-safe database queries
- **Neon** for serverless PostgreSQL hosting
- **Radix UI** for accessible primitives

---

