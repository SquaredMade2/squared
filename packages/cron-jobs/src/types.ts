import type { CronJob } from "cron";

/**
 * Configuration for a CRON job
 */
export interface CronJobConfig {
	/**
	 * Name of the job for identification
	 */
	name: string;

	/**
	 * CRON schedule expression (e.g. "0 0 * * *" for daily at midnight)
	 */
	schedule: string;

	/**
	 * Timezone for the job (default: 'UTC')
	 */
	timezone?: string;

	/**
	 * Whether to run the job immediately when started (default: false)
	 */
	runOnInit?: boolean;

	/**
	 * Maximum execution time in milliseconds (0 for unlimited)
	 */
	timeout?: number;
}

/**
 * Generic context passed to jobs during execution
 */
export interface JobContext {
	/**
	 * Timestamp when the job started
	 */
	startTime: Date;

	/**
	 * Name of the job
	 */
	jobName: string;

	/**
	 * Any additional data for the job
	 */
	[key: string]: any;
}

/**
 * Result of a job execution
 */
export interface JobResult {
	/**
	 * Whether the job succeeded
	 */
	success: boolean;

	/**
	 * Any data returned by the job
	 */
	data?: any;

	/**
	 * Error message if the job failed
	 */
	error?: string;

	/**
	 * Duration of job execution in milliseconds
	 */
	duration: number;
}

/**
 * Registered job with its task instance
 */
export interface RegisteredJob {
	/**
	 * Job configuration
	 */
	config: CronJobConfig;

	/**
	 * Task instance from cron library
	 */
	task: CronJob;

	/**
	 * Whether the job is currently active
	 */
	active: boolean;

	/**
	 * Last execution result
	 */
	lastResult?: JobResult;
}

/**
 * Handler function for a CRON job
 */
export type JobHandler = (context: JobContext) => Promise<any>;
