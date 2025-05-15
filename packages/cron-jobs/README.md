# @squaredmade/cron-jobs

A TypeScript framework for creating and managing CRON jobs in the Squared monorepo.

## Installation

```bash
pnpm add @squaredmade/cron-jobs
```

## Usage

### Creating a CRON Job

Create a file for your job:

```typescript
// my-job.ts
import { jobManager, type JobContext, type CronJobConfig, type JobResult } from '@squaredmade/cron-jobs';

// Define job-specific context (optional)
interface MyJobContext {
  environmentName: string;
}

// Define job-specific result data (optional)
interface MyJobResult {
  processed: number;
  status: string;
}

// Configure your job
const config: CronJobConfig = {
  name: 'my-job',
  schedule: '0 0 * * *', // Run daily at midnight (CRON syntax)
  timezone: 'UTC',       // Timezone for the job
  runOnInit: false,      // Don't run immediately when registered
  timeout: 60000,        // Timeout after 60 seconds
};

// Create the job handler
async function myJobHandler(
  context: JobContext<MyJobContext>
): Promise<JobResult<MyJobResult>> {
  // Access job context
  console.log(`Job started at ${context.startTime}`);
  console.log(`Environment: ${context.data?.environmentName || 'production'}`);
  
  try {
    // Your job logic here
    // ...
    
    // Return success result
    return {
      success: true,
      data: {
        processed: 42,
        status: 'completed',
      },
    };
  } catch (error) {
    // Return failure result
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Register the job
export function registerMyJob(): void {
  jobManager.register<MyJobContext>(config, myJobHandler);
}
```

### Registering and Running Jobs

Create a file to manage all your jobs:

```typescript
// jobs.ts
import { registerMyJob } from './my-job';
import { registerOtherJob } from './other-job';

export function registerAllJobs(): void {
  registerMyJob();
  registerOtherJob();
  // Add more job registrations here
}
```

### Starting the CRON Service

```typescript
// cron-service.ts
import { jobManager } from '@squaredmade/cron-jobs';
import { registerAllJobs } from './jobs';

// Register all jobs
registerAllJobs();

// Start all jobs
jobManager.startAll();

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('Stopping all jobs...');
  jobManager.stopAll();
  process.exit(0);
});
```

### Using the CLI

You can also use the included CLI to run your jobs. Create a script that registers your jobs and then runs the CLI:

```typescript
// start-cron.ts
import { jobManager } from '@squaredmade/cron-jobs';
import { registerAllJobs } from './jobs';

// Register your jobs
registerAllJobs();

// Import the CLI (this will start the service)
import '@squaredmade/cron-jobs/dist/bin/cli';
```

Then run:

```bash
ts-node start-cron.ts
```

## API Reference

### JobManager

The main class for managing CRON jobs.

**Methods:**

- `register<T>(config, handler)`: Register a new job
- `start(jobName)`: Start a specific job
- `stop(jobName)`: Stop a specific job
- `startAll()`: Start all registered jobs
- `stopAll()`: Stop all running jobs
- `runNow<T>(jobName)`: Run a job immediately
- `getAllJobs()`: Get all registered jobs
- `getJob<T>(jobName)`: Get a specific job
- `hasJob(jobName)`: Check if a job exists

### Types

#### CronJobConfig

```typescript
interface CronJobConfig {
  name: string;          // Unique name for the job
  schedule: string;      // CRON schedule expression
  timezone?: string;     // Timezone (default: 'UTC')
  runOnInit?: boolean;   // Run immediately on start
  timeout?: number;      // Max execution time in ms
}
```

#### JobContext

```typescript
interface JobContext<T = unknown> {
  startTime: Date;       // Timestamp when job started
  jobName: string;       // Name of the job
  data?: T;              // Additional job-specific data
}
```

#### JobResult

```typescript
interface JobResult<T = unknown> {
  success: boolean;      // Whether job succeeded
  data?: T;              // Data returned by the job
  error?: string;        // Error message if job failed
  duration: number;      // Duration in milliseconds
}
```

### CRON Schedule Syntax

The `schedule` property uses standard CRON syntax:

```sh
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of the month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

Examples:

- `* * * * *`: Every minute
- `0 * * * *`: Every hour at minute 0
- `0 0 * * *`: Every day at midnight
- `0 12 * * MON-FRI`: Weekdays at noon
- `0 0 1 * *`: First day of every month

## Best Practices

1. **Idempotency**: Design your jobs to be idempotent so they can be safely retried.
2. **Error Handling**: Always include error handling in your job handler.
3. **Logging**: Log start, completion, and any errors for better monitoring.
4. **Job Duration**: Keep jobs short; if a job needs to run for a long time, consider breaking it into smaller steps.
5. **Timeouts**: Set appropriate timeouts to prevent jobs from running indefinitely.
