# @squaredmade/cron-jobs

A TypeScript framework for creating and managing CRON jobs in the Squared monorepo.

## Installation

```bash
pnpm add @squaredmade/cron-jobs
```

## Usage

### Creating a new CRON job

1. Create a new file in `src/jobs/your-job-name.ts`:

```typescript
import { jobManager, JobContext, CronJobConfig } from '../index';

export const yourJobConfig: CronJobConfig = {
  name: 'your-job-name',
  schedule: '0 0 * * *', // CRON schedule (runs daily at midnight)
  timezone: 'UTC',
  runOnInit: false,
  timeout: 60000, // 60 seconds
};

export async function yourJobHandler(context: JobContext): Promise<any> {
  // Your job logic here
  console.log(`Job ${context.jobName} started at ${context.startTime}`);
  
  // Return any data
  return {
    message: 'Job completed successfully',
    timestamp: new Date().toISOString(),
  };
}

export function registerYourJob(): void {
  jobManager.register(yourJobConfig, yourJobHandler);
}
```

2. Add your job to `src/jobs/index.ts`:

```typescript
// Import and export your job
export * from './your-job-name';

// Import registration function
import { registerYourJob } from './your-job-name';

export function registerAllJobs(): void {
  // Add your job registration
  registerYourJob();
}
```

### Running CRON jobs

Create a file to start your CRON jobs:

```typescript
import { jobManager } from '@squaredmade/cron-jobs';
import { registerAllJobs } from '@squaredmade/cron-jobs/jobs';

// Register all available jobs
registerAllJobs();

// Start all jobs
jobManager.startAll();

// Keep process running
process.on('SIGINT', () => {
  console.log('Stopping all jobs...');
  jobManager.stopAll();
  process.exit(0);
});
```

## API

### JobManager

The main class for managing CRON jobs.

Methods:
- `register(config, handler)`: Register a new job
- `start(jobName)`: Start a specific job
- `stop(jobName)`: Stop a specific job
- `startAll()`: Start all registered jobs
- `stopAll()`: Stop all running jobs
- `runNow(jobName)`: Run a job immediately
- `getAllJobs()`: Get all registered jobs
- `getJob(jobName)`: Get a specific job
- `hasJob(jobName)`: Check if a job exists

### CronJobConfig

Configuration options for a CRON job:

```typescript
interface CronJobConfig {
  name: string;          // Unique name for the job
  schedule: string;      // CRON schedule expression
  timezone?: string;     // Timezone (default: 'UTC')
  runOnInit?: boolean;   // Run immediately on start
  timeout?: number;      // Max execution time in ms
}
```

### JobContext

Context passed to job handlers:

```typescript
interface JobContext {
  startTime: Date;       // Timestamp when job started
  jobName: string;       // Name of the job
  [key: string]: any;    // Additional job-specific data
}
```

### JobResult

Result of a job execution:

```typescript
interface JobResult {
  success: boolean;      // Whether job succeeded
  data?: any;            // Data returned by the job
  error?: string;        // Error message if job failed
  duration: number;      // Duration in milliseconds
}
```