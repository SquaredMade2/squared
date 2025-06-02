import {
	type CronJobConfig,
	type JobContext,
	type JobResultData,
	jobManager,
} from "@squaredmade/cron-jobs";
import { inArray, lt, sql, workspacesTable } from "@squaredmade/db";
import { and } from "@squaredmade/db";
import { eq } from "@squaredmade/db";
import { tasksTable } from "@squaredmade/db";
import createCustomLogger from "@squaredmade/logger";
import { subDays } from "date-fns";
import { db } from "../api";

// Set up logger
const logger = createCustomLogger("archive-tasks-job");

/**
 * Archive task job result data
 */
interface ArchiveTasksResult {
	tasksArchived: number;
	error?: string;
}

/**
 * Configure the archive tasks job
 * Runs daily at 2am to minimize impact on users
 */
export const archiveTasksConfig: CronJobConfig = {
	name: "archive-tasks",
	// Run every day at 2am
	schedule: "0 2 * * *",
	// Run in UTC timezone
	timezone: "UTC",
	// Don't run immediately when registered
	runOnInit: false,
	// Timeout after 10 minutes
	timeout: 10 * 60 * 1000,
};

/**
 * Archives tasks that are completed and older than 90 days
 *
 * @param context Job context
 * @returns Promise that resolves to a JobResultData
 */
export async function archiveTasksHandler(
	context: JobContext,
): Promise<JobResultData<ArchiveTasksResult>> {
	logger.info(
		`Archive tasks job started at ${context.startTime.toISOString()}`,
	);

	try {
		// Calculate the date 90 days ago
		const ninetyDaysAgo = subDays(new Date(), 90);
		logger.info(
			`Archiving tasks completed before: ${ninetyDaysAgo.toISOString()}`,
		);

		// Find tasks to archive (completed and older than 90 days)
		const tasks = await db
			.update(tasksTable)
			.set({ status: "archived" })
			.from(tasksTable)
			.innerJoin(
				workspacesTable,
				eq(tasksTable.workspaceId, workspacesTable.externalId),
			)
			.where(
				and(
					eq(tasksTable.deleted, false),
					inArray(tasksTable.status, ["done", "canceled", "duplicated"]),
					lt(
						tasksTable.updatedAt,
						sql`NOW() - INTERVAL '1 day' * ${workspacesTable.daysUntilArchive}`,
					),
				),
			);

		logger.info(`Found ${tasks.rows.length} tasks to archive`);

		// Return success result - duration will be added by the job manager
		return {
			success: true,
			data: {
				tasksArchived: tasks.rows.length,
			},
		};
	} catch (error) {
		logger.error("Error archiving tasks", error);

		// Return failure result - duration will be added by the job manager
		return {
			success: false,
			error: error instanceof Error ? error.message : String(error),
			data: {
				tasksArchived: 0,
				error: error instanceof Error ? error.message : String(error),
			},
		};
	}
}

/**
 * Register the archive tasks job with the job manager
 */
export function registerArchiveTasksJob(): void {
	jobManager.register(archiveTasksConfig, archiveTasksHandler);
	logger.info("Archive tasks job registered");
}
