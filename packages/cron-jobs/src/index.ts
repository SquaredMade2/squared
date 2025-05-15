// Export all types and classes
export * from "./types";
export * from "./job-manager";

// Create and export singleton instance of JobManager
import { JobManager } from "./job-manager";
export const jobManager = new JobManager();
