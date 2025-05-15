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
export interface JobContext<T = unknown> {
	/**
	 * Timestamp when the job started
	 */
	startTime: Date;

	/**
	 * Name of the job
	 */
	jobName: string;

	/**
	 * Optional data payload
	 */
	data?: T;
}

/**
 * Job result data before processing
 * This is what job handlers return directly
 */
export interface JobResultData<T = unknown> {
	/**
	 * Whether the job succeeded
	 */
	success: boolean;

	/**
	 * Any data returned by the job
	 */
	data?: T;

	/**
	 * Error message if the job failed
	 */
	error?: string;
}

/**
 * Complete result of a job execution
 * This is stored in the job manager after processing
 */
export interface JobResult<T = unknown> extends JobResultData<T> {
	/**
	 * Duration of job execution in milliseconds
	 * This is required in the final result
	 */
	duration: number;
}

/**
 * Registered job with its task instance
 */
export interface RegisteredJob<T = unknown> {
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
	lastResult?: JobResult<T>;
}

/**
 * Handler function for a CRON job
 * Returns JobResultData, not JobResult, as duration is added by the job manager
 */
export type JobHandler<T = unknown> = (
	context: JobContext<T>,
) => Promise<JobResultData<T>>;
