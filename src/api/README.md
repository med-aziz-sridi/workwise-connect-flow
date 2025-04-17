
# API Integration

This directory contains the API client and service files for interacting with the backend.

## Structure

- `client.ts`: Core API client with Axios configuration
- Service files for each entity (auth.ts, jobs.ts, etc.)

## Usage

Import the service functions in your components:

```typescript
import { getAllJobs } from '@/api/jobs';

// Inside a component or hook
const fetchJobs = async () => {
  try {
    const jobs = await getAllJobs();
    // Process the jobs
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }
};
```

## Authentication

The API client automatically attaches the authentication token to requests.
The token is stored in localStorage after login and removed on logout.
