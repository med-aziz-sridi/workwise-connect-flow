
# Freeness Backend

This is the Node.js backend for the Freeness platform.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=5000
   ```

3. Run the development server:
   ```
   npm run dev
   ```

## API Routes

- `/api/auth`: Authentication endpoints (signup, signin, signout)
- `/api/jobs`: Job management
- `/api/applications`: Job applications
- `/api/projects`: Freelancer projects
- `/api/notifications`: User notifications
- `/api/users`: User profiles
- `/api/experiences`: Freelancer experiences
- `/api/certifications`: Freelancer certifications

## Structure

- `src/index.ts`: Entry point
- `src/controllers/`: Business logic
- `src/routes/`: API routes
- `src/middleware/`: Middleware functions
- `src/lib/`: Shared utilities

## Authentication

The backend uses Supabase for authentication. JWT tokens are validated using the Supabase client.
