import createCustomLogger, { type Logger } from "@squaredmade/logger";
import { CronJob } from "cron";
import type {
	CronJobConfig,
	JobContext,
	JobHandler,
	JobResult,
	JobResultData,
	RegisteredJob,
} from "./types";

/**
 * Manages the registration and execution of CRON jobs
 */
export class JobManager {
	private jobs: Map<string, RegisteredJob<unknown>> = new Map();
	private handlers: Map<
		string,
		// biome-ignore lint/suspicious/noExplicitAny: Any is used to allow the handler to be a function that can return any type
		(context: JobContext<any>) => Promise<JobResultData<any>>
	> = new Map();
	private logger: Logger;

	constructor() {
		this.logger = createCustomLogger("cron-jobs");
	}

	/**
	 * Register a new CRON job
	 * @param config Job configuration
	 * @param handler Function to execute when the job runs
	 * @returns The name of the registered job
	 */
	register<T = unknown>(config: CronJobConfig, handler: JobHandler<T>): string {
		if (this.jobs.has(config.name)) {
			throw new Error(`Job with name '${config.name}' already exists`);
		}

		// Create wrapper function that adds timing and error handling
		const wrappedHandler = async (): Promise<void> => {
			const startTime = new Date();

			// Create the base context properties
			const baseContext = {
				startTime,
				jobName: config.name,
			};

			// Cast to JobContext<T> since we can't know what T contains at runtime
			// The handler is responsible for providing any additional T properties if needed
			const jobContext = baseContext;

			this.logger.info(`Starting job: ${config.name}`);

			let result: JobResult<T>;

			try {
				// Add timeout if specified
				let jobPromise = handler(jobContext);

				if (config.timeout && config.timeout > 0) {
					jobPromise = Promise.race([
						jobPromise,
						new Promise<JobResultData<T>>((_, reject) => {
							setTimeout(
								() =>
									reject(new Error(`Job timed out after ${config.timeout}ms`)),
								config.timeout,
							);
						}),
					]);
				}

				const jobResult = await jobPromise;
				const endTime = new Date();
				const duration = endTime.getTime() - startTime.getTime();

				// Add duration to the result
				result = {
					...jobResult,
					duration,
				};

				this.logger.info(`Job completed: ${config.name} (${duration}ms)`);
			} catch (error) {
				const endTime = new Date();
				const duration = endTime.getTime() - startTime.getTime();

				result = {
					success: false,
					error: error instanceof Error ? error.message : String(error),
					duration,
				};

				this.logger.error(`Job failed: ${config.name} (${duration}ms)`, error);
			}

			// Update the job's last result
			const job = this.jobs.get(config.name);
			if (job) {
				job.lastResult = result;
			}
		};

		// Create the CRON job
		const task = new CronJob(
			config.schedule,
			wrappedHandler,
			null,
			false,
			config.timezone || "UTC",
			null,
			config.runOnInit,
		);

		// Store the job and handler
		this.jobs.set(config.name, {
			config,
			task,
			active: false,
		});

		this.handlers.set(config.name, handler);

		return config.name;
	}

	/**
	 * Start a job by name
	 * @param jobName Name of the job to start
	 */
	start(jobName: string): void {
		const job = this.jobs.get(jobName);

		if (!job) {
			throw new Error(`Job '${jobName}' not found`);
		}

		if (job.active) {
			this.logger.warn(`Job '${jobName}' is already running`);
			return;
		}

		job.task.start();
		job.active = true;

		this.logger.info(`Started job: ${jobName}`);
	}

	/**
	 * Stop a job by name
	 * @param jobName Name of the job to stop
	 */
	stop(jobName: string): void {
		const job = this.jobs.get(jobName);

		if (!job) {
			throw new Error(`Job '${jobName}' not found`);
		}

		if (!job.active) {
			this.logger.warn(`Job '${jobName}' is not running`);
			return;
		}

		job.task.stop();
		job.active = false;

		this.logger.info(`Stopped job: ${jobName}`);
	}

	/**
	 * Start all registered jobs
	 */
	startAll(): void {
		for (const jobName of this.jobs.keys()) {
			try {
				this.start(jobName);
			} catch (error) {
				this.logger.error(`Error starting job '${jobName}'`, error);
			}
		}
	}

	/**
	 * Stop all running jobs
	 */
	stopAll(): void {
		for (const jobName of this.jobs.keys()) {
			try {
				this.stop(jobName);
			} catch (error) {
				this.logger.error(`Error stopping job '${jobName}'`, error);
			}
		}
	}

	/**
	 * Run a job immediately, regardless of its schedule
	 * @param jobName Name of the job to run
	 */
	async runNow<T = unknown>(jobName: string): Promise<JobResult<T>> {
		const job = this.jobs.get(jobName);
		const handler = this.handlers.get(jobName);

		if (!job || !handler) {
			throw new Error(`Job '${jobName}' not found`);
		}

		const jobContext: JobContext<T> = {
			startTime: new Date(),
			jobName: job.config.name,
		};

		this.logger.info(`Manually running job: ${jobName}`);

		let result: JobResult<T>;

		const startTime = new Date();
		try {
			const jobResult = await handler(jobContext);
			const endTime = new Date();
			const duration = endTime.getTime() - startTime.getTime();

			// Add duration to the result
			result = {
				...jobResult,
				duration,
			};

			this.logger.info(`Manual job completed: ${jobName} (${duration}ms)`);
		} catch (error) {
			const endTime = new Date();
			const duration = endTime.getTime() - startTime.getTime();

			result = {
				success: false,
				error: error instanceof Error ? error.message : String(error),
				duration,
			};

			this.logger.error(`Manual job failed: ${jobName} (${duration}ms)`, error);
		}

		// Update the job's last result
		job.lastResult = result;

		return result;
	}

	/**
	 * Get all registered jobs
	 * @returns Array of registered jobs
	 */
	getAllJobs(): Array<RegisteredJob<unknown>> {
		return Array.from(this.jobs.values());
	}

	/**
	 * Get a specific job by name
	 * @param jobName Name of the job
	 * @returns Job if found, undefined otherwise
	 */
	getJob<T = unknown>(jobName: string): RegisteredJob<T> | undefined {
		return this.jobs.get(jobName) as RegisteredJob<T> | undefined;
	}

	/**
	 * Check if a job exists
	 * @param jobName Name of the job
	 * @returns True if the job exists, false otherwise
	 */
	hasJob(jobName: string): boolean {
		return this.jobs.has(jobName);
	}
}
