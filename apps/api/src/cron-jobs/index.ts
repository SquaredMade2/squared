import { jobManager } from "@squaredmade/cron-jobs";
import createCustomLogger from "@squaredmade/logger";
import { registerArchiveTasksJob } from "./archiveTasks";

// Create logger
const logger = createCustomLogger("cron-jobs");

/**
 * Register all cron jobs
 * This function will register and initialize all CRON jobs for the API.
 * Add new job registrations here as they are created.
 */
export function registerCronJobs(): void {
	logger.info("Registering cron jobs...");

	// Register each job
	registerArchiveTasksJob();
	// Add more job registrations here as needed

	// Start all jobs
	const jobs = jobManager.getAllJobs();
	if (jobs.length > 0) {
		jobManager.startAll();
		logger.info(`Started ${jobs.length} CRON jobs`);

		// Log registered jobs
		for (const job of jobs) {
			logger.info(
				`Job: ${job.config.name}, Schedule: ${job.config.schedule}, Active: ${job.active}`,
			);
		}
	} else {
		logger.warn("No CRON jobs were registered");
	}
}

// Export all job modules
export {
	archiveTasksConfig,
	archiveTasksHandler,
	registerArchiveTasksJob,
} from "./archiveTasks";
