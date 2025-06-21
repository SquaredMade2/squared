// Export all types and classes

export type { JobManager } from "./job-manager";
export type {
	CronJobConfig,
	JobContext,
	JobHandler,
	JobResult,
	JobResultData,
	RegisteredJob,
} from "./types";

// Create and export singleton instance of JobManager
import { JobManager } from "./job-manager";
export const jobManager = new JobManager();
