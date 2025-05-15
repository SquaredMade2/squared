// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Export all types and classes
export * from "./types";
export * from "./job-manager";

// Create and export singleton instance of JobManager
import { JobManager } from "./job-manager";
export const jobManager = new JobManager();
