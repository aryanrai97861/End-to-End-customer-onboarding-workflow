# Setup Instructions

## Prerequisites

Before running the application, you need:

1. **Node.js** (v18 or higher)
2. **PostgreSQL** database

## Database Setup Options

### Option 1: Local PostgreSQL (Recommended for Development)

#### Windows:
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install and remember your postgres user password
3. Create a database:
   ```bash
   # Open pgAdmin or use psql command line
   psql -U postgres
   CREATE DATABASE clearbroker;
   \q
   ```

#### Mac (using Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
createdb clearbroker
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb clearbroker
```

### Option 2: Use a Free Cloud PostgreSQL

**Neon (Recommended - Free tier):**
1. Go to https://neon.tech
2. Sign up for free
3. Create a new project
4. Copy the connection string

**Supabase (Alternative):**
1. Go to https://supabase.com
2. Create a free project
3. Get the connection string from Settings → Database

## Installation Steps

### 1. Clone and Install Dependencies
```bash
cd FarCylindricalLead
npm install
```

### 2. Configure Environment Variables
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your database credentials
# For local PostgreSQL:
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/clearbroker

# For cloud PostgreSQL (Neon/Supabase):
DATABASE_URL=postgresql://user:password@host.region.provider.com/dbname
```

### 3. Initialize Database
```bash
# This creates the tables in your database
npm run db:push
```

### 4. (Optional) Seed Initial Data
If you want to start with some test data:
```bash
npm run seed
```

### 5. Run the Development Server
```bash
npm run dev
```

The application will be available at: http://localhost:5000

## Quick Start (Using Neon - No Local Installation)

If you don't want to install PostgreSQL locally:

1. Go to https://neon.tech and sign up
2. Create a new project (free tier)
3. Copy the connection string
4. Create `.env` file:
   ```
   DATABASE_URL=your_neon_connection_string_here
   SESSION_SECRET=any-random-string-here
   ```
5. Run:
   ```bash
   npm install
   npm run db:push
   npm run dev
   ```

## Troubleshooting

### Error: "DATABASE_URL must be set"
- Make sure `.env` file exists in the root directory
- Check that `DATABASE_URL` is set correctly in `.env`

### Error: "Connection refused"
- Ensure PostgreSQL is running: `sudo service postgresql status` (Linux)
- Check if the port 5432 is correct
- Verify your username and password

### Error: "Database does not exist"
- Create the database: `createdb clearbroker`
- Or use pgAdmin to create it manually

## Default Users

After running the seed script, you can log in with:

**Admin User:**
- Email: admin@clearbroker.com
- Password: admin123

**Regular Broker:**
- Email: broker@example.com
- Password: broker123

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Secret key for session encryption | Any random string |
| `NODE_ENV` | Environment mode | `development` or `production` |

## Production Deployment

For production deployment, make sure to:
1. Use a strong `SESSION_SECRET`
2. Use a production PostgreSQL database
3. Set `NODE_ENV=production`
4. Build the application: `npm run build`
5. Start with: `npm start`

## Need Help?

- Check if PostgreSQL is installed: `psql --version`
- Check if database exists: `psql -U postgres -l`
- View application logs for detailed error messages
