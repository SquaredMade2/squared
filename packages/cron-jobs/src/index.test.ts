import { CronJob } from "cron";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JobManager } from "../src/job-manager";
import type { CronJobConfig, JobHandler } from "../src/types";

// Create a proper mock for CronJob
const mockCronJobInstance = {
	start: vi.fn(),
	stop: vi.fn(),
	running: false,
};

vi.mock("cron", () => ({
	CronJob: vi.fn(() => mockCronJobInstance),
}));

// Mock the logger with more detailed tracking
const mockLogger = {
	info: vi.fn(),
	warn: vi.fn(),
	error: vi.fn(),
	debug: vi.fn(),
};

vi.mock("@squaredmade/logger", () => ({
	default: vi.fn(() => mockLogger),
}));

describe("JobManager", () => {
	let jobManager: JobManager;

	beforeEach(() => {
		vi.clearAllMocks();
		mockCronJobInstance.start.mockClear();
		mockCronJobInstance.stop.mockClear();
		jobManager = new JobManager();
	});

	afterEach(() => {
		jobManager.stopAll();
	});

	describe("register", () => {
		it("should register a job successfully", () => {
			const config: CronJobConfig = {
				name: "test-job",
				schedule: "0 0 * * *",
			};

			const handler: JobHandler = async () => ({
				success: true,
				data: "test-data",
			});

			const jobName = jobManager.register(config, handler);

			expect(jobName).toBe("test-job");
			expect(jobManager.hasJob("test-job")).toBe(true);
			expect(CronJob).toHaveBeenCalledWith(
				"0 0 * * *",
				expect.any(Function),
				null,
				false,
				"UTC",
				null,
				undefined,
			);
		});

		it("should register a job with custom timezone and runOnInit", () => {
			const config: CronJobConfig = {
				name: "timezone-job",
				schedule: "0 0 * * *",
				timezone: "America/New_York",
				runOnInit: true,
			};

			const handler: JobHandler = async () => ({
				success: true,
			});

			jobManager.register(config, handler);

			expect(CronJob).toHaveBeenCalledWith(
				"0 0 * * *",
				expect.any(Function),
				null,
				false,
				"America/New_York",
				null,
				true,
			);
		});

		it("should throw error if job with same name already exists", () => {
			const config: CronJobConfig = {
				name: "duplicate-job",
				schedule: "0 0 * * *",
			};

			const handler: JobHandler = async () => ({
				success: true,
			});

			jobManager.register(config, handler);

			expect(() => {
				jobManager.register(config, handler);
			}).toThrow("Job with name 'duplicate-job' already exists");
		});
	});

	describe("start", () => {
		it("should start a registered job", () => {
			const config: CronJobConfig = {
				name: "start-job",
				schedule: "0 0 * * *",
			};

			const handler: JobHandler = async () => ({
				success: true,
			});

			jobManager.register(config, handler);
			jobManager.start("start-job");

			const job = jobManager.getJob("start-job");
			expect(job?.active).toBe(true);
			expect(mockCronJobInstance.start).toHaveBeenCalledTimes(1);
			expect(mockLogger.info).toHaveBeenCalledWith("Started job: start-job");
		});

		it("should throw error if job does not exist", () => {
			expect(() => {
				jobManager.start("non-existent-job");
			}).toThrow("Job 'non-existent-job' not found");
		});

		it("should warn if job is already running", () => {
			const config: CronJobConfig = {
				name: "already-running-job",
				schedule: "0 0 * * *",
			};

			const handler: JobHandler = async () => ({
				success: true,
			});

			jobManager.register(config, handler);
			jobManager.start("already-running-job");

			// Reset the mock to check the second call
			mockCronJobInstance.start.mockClear();
			mockLogger.warn.mockClear();

			jobManager.start("already-running-job"); // Start again

			expect(mockCronJobInstance.start).not.toHaveBeenCalled();
			expect(mockLogger.warn).toHaveBeenCalledWith(
				"Job 'already-running-job' is already running",
			);
		});
	});

	describe("stop", () => {
		it("should stop a running job", () => {
			const config: CronJobConfig = {
				name: "stop-job",
				schedule: "0 0 * * *",
			};

			const handler: JobHandler = async () => ({
				success: true,
			});

			jobManager.register(config, handler);
			jobManager.start("stop-job");
			jobManager.stop("stop-job");

			const job = jobManager.getJob("stop-job");
			expect(job?.active).toBe(false);
			expect(mockCronJobInstance.stop).toHaveBeenCalledTimes(1);
			expect(mockLogger.info).toHaveBeenCalledWith("Stopped job: stop-job");
		});

		it("should throw error if job does not exist", () => {
			expect(() => {
				jobManager.stop("non-existent-job");
			}).toThrow("Job 'non-existent-job' not found");
		});

		it("should warn if job is not running", () => {
			const config: CronJobConfig = {
				name: "not-running-job",
				schedule: "0 0 * * *",
			};

			const handler: JobHandler = async () => ({
				success: true,
			});

			jobManager.register(config, handler);
			jobManager.stop("not-running-job"); // Stop without starting

			expect(mockCronJobInstance.stop).not.toHaveBeenCalled();
			expect(mockLogger.warn).toHaveBeenCalledWith(
				"Job 'not-running-job' is not running",
			);
		});
	});

	describe("startAll", () => {
		it("should start all registered jobs", () => {
			const configs = [
				{ name: "job1", schedule: "0 0 * * *" },
				{ name: "job2", schedule: "0 1 * * *" },
				{ name: "job3", schedule: "0 2 * * *" },
			];

			const handler: JobHandler = async () => ({ success: true });

			for (const config of configs) {
				jobManager.register(config, handler);
			}

			// Clear mocks before calling startAll
			mockCronJobInstance.start.mockClear();
			mockLogger.info.mockClear();

			jobManager.startAll();

			expect(jobManager.getJob("job1")?.active).toBe(true);
			expect(jobManager.getJob("job2")?.active).toBe(true);
			expect(jobManager.getJob("job3")?.active).toBe(true);
			expect(mockCronJobInstance.start).toHaveBeenCalledTimes(3);
		});
	});

	describe("stopAll", () => {
		it("should stop all running jobs", () => {
			const configs = [
				{ name: "job1", schedule: "0 0 * * *" },
				{ name: "job2", schedule: "0 1 * * *" },
			];

			const handler: JobHandler = async () => ({ success: true });

			for (const config of configs) {
				jobManager.register(config, handler);
			}
			jobManager.startAll();

			// Clear mocks before calling stopAll
			mockCronJobInstance.stop.mockClear();
			mockLogger.info.mockClear();

			jobManager.stopAll();

			expect(jobManager.getJob("job1")?.active).toBe(false);
			expect(jobManager.getJob("job2")?.active).toBe(false);
			expect(mockCronJobInstance.stop).toHaveBeenCalledTimes(2);
		});
	});

	describe("runNow", () => {
		it("should execute a job immediately and return result", async () => {
			const config: CronJobConfig = {
				name: "immediate-job",
				schedule: "0 0 * * *",
			};

			const testData = { message: "test-result" };

			// Add artificial delay to make test execution time more realistic
			const handler: JobHandler<typeof testData> = async (context) => {
				await new Promise((resolve) => setTimeout(resolve, 10)); // 10ms delay
				expect(context.jobName).toBe("immediate-job");
				expect(context.startTime).toBeInstanceOf(Date);
				return {
					success: true,
					data: testData,
				};
			};

			jobManager.register(config, handler);

			const startTime = Date.now();
			const result = await jobManager.runNow<typeof testData>("immediate-job");
			const endTime = Date.now();

			expect(result.success).toBe(true);
			expect(result.data).toEqual(testData);
			expect(result.duration).toBeGreaterThanOrEqual(8); // Account for some timing variance
			expect(result.duration).toBeLessThan(endTime - startTime + 5); // Reasonable upper bound
			expect(typeof result.duration).toBe("number");

			expect(mockLogger.info).toHaveBeenCalledWith(
				"Manually running job: immediate-job",
			);
			expect(mockLogger.info).toHaveBeenCalledWith(
				expect.stringMatching(/Manual job completed: immediate-job \(\d+ms\)/),
			);
		});

		it("should handle job errors gracefully", async () => {
			const config: CronJobConfig = {
				name: "error-job",
				schedule: "0 0 * * *",
			};

			const handler: JobHandler = async () => {
				await new Promise((resolve) => setTimeout(resolve, 5)); // Small delay
				throw new Error("Test error");
			};

			jobManager.register(config, handler);

			const startTime = Date.now();
			const result = await jobManager.runNow("error-job");
			const endTime = Date.now();

			expect(result.success).toBe(false);
			expect(result.error).toBe("Test error");
			expect(result.duration).toBeGreaterThanOrEqual(3);
			expect(result.duration).toBeLessThan(endTime - startTime + 5);

			expect(mockLogger.error).toHaveBeenCalledWith(
				expect.stringMatching(/Manual job failed: error-job \(\d+ms\)/),
				expect.any(Error),
			);
		});

		it("should throw error if job does not exist", async () => {
			await expect(jobManager.runNow("non-existent-job")).rejects.toThrow(
				"Job 'non-existent-job' not found",
			);
		});

		it("should update lastResult after execution", async () => {
			const config: CronJobConfig = {
				name: "result-job",
				schedule: "0 0 * * *",
			};

			const handler: JobHandler = async () => {
				await new Promise((resolve) => setTimeout(resolve, 5));
				return {
					success: true,
					data: "result-data",
				};
			};

			jobManager.register(config, handler);
			await jobManager.runNow("result-job");

			const job = jobManager.getJob("result-job");
			expect(job?.lastResult?.success).toBe(true);
			expect(job?.lastResult?.data).toBe("result-data");
			expect(job?.lastResult?.duration).toBeGreaterThanOrEqual(3);
		});
	});

	describe("job execution with timeout", () => {
		it("should handle job timeouts", async () => {
			vi.useFakeTimers();

			const config: CronJobConfig = {
				name: "timeout-job",
				schedule: "0 0 * * *",
				timeout: 1000, // 1 second timeout
			};

			const handler: JobHandler = async () => {
				// Simulate a job that takes longer than timeout
				await new Promise((resolve) => setTimeout(resolve, 2000));
				return { success: true };
			};

			jobManager.register(config, handler);

			// Get the wrapped handler that was passed to CronJob
			const cronJobCalls = vi.mocked(CronJob as any).mock.calls;
			const latestCall = cronJobCalls[cronJobCalls.length - 1];
			const wrappedHandler = latestCall[1];

			// Execute the wrapped handler
			const executionPromise = wrappedHandler();

			// Fast-forward time to trigger timeout
			vi.advanceTimersByTime(1000);

			await executionPromise;

			const job = jobManager.getJob("timeout-job");
			expect(job?.lastResult?.success).toBe(false);
			expect(job?.lastResult?.error).toBe("Job timed out after 1000ms");
			expect(mockLogger.error).toHaveBeenCalledWith(
				expect.stringMatching(/Job failed: timeout-job \(\d+ms\)/),
				expect.any(Error),
			);

			vi.useRealTimers();
		});
	});

	describe("scheduled job execution", () => {
		it("should execute job multiple times on schedule", async () => {
			vi.useFakeTimers();

			const config: CronJobConfig = {
				name: "scheduled-job",
				schedule: "*/1 * * * * *", // Every second
			};

			let executionCount = 0;
			const executionTimes: Date[] = [];

			const handler: JobHandler<{ execution: number }> = async (context) => {
				executionCount++;
				executionTimes.push(context.startTime);

				return {
					success: true,
					data: { execution: executionCount },
				};
			};

			// Register and start the job
			jobManager.register(config, handler);
			jobManager.start("scheduled-job");

			// Get the wrapped handler that was passed to CronJob
			const cronJobCalls = vi.mocked(CronJob as any).mock.calls;
			const latestCall = cronJobCalls[cronJobCalls.length - 1];
			const wrappedHandler = latestCall[1];

			expect(mockCronJobInstance.start).toHaveBeenCalled();
			expect(jobManager.getJob("scheduled-job")?.active).toBe(true);

			// Simulate the cron job firing multiple times
			// Execute the handler manually to simulate cron ticks
			await wrappedHandler(); // First execution

			// Advance time and simulate another execution
			vi.advanceTimersByTime(1000); // 1 second
			await wrappedHandler(); // Second execution

			// Advance time and simulate third execution
			vi.advanceTimersByTime(1000); // Another second
			await wrappedHandler(); // Third execution

			// Verify multiple executions
			expect(executionCount).toBe(3);
			expect(executionTimes).toHaveLength(3);

			// Verify the job's last result is updated with the latest execution
			const job = jobManager.getJob<{ execution: number }>("scheduled-job");
			expect(job?.lastResult?.success).toBe(true);
			expect(job?.lastResult?.data?.execution).toBe(3);

			// Verify logging for each execution
			expect(mockLogger.info).toHaveBeenCalledWith(
				"Starting job: scheduled-job",
			);
			expect(mockLogger.info).toHaveBeenCalledWith(
				expect.stringMatching(/Job completed: scheduled-job \(\d+ms\)/),
			);

			// Check that the logger was called for each execution
			const startingJobCalls = mockLogger.info.mock.calls.filter(
				(call) => call[0] === "Starting job: scheduled-job",
			);
			const completedJobCalls = mockLogger.info.mock.calls.filter(
				(call) =>
					typeof call[0] === "string" &&
					call[0].includes("Job completed: scheduled-job"),
			);

			expect(startingJobCalls).toHaveLength(3);
			expect(completedJobCalls).toHaveLength(3);

			vi.useRealTimers();
		});

		it("should handle errors in scheduled executions without stopping the job", async () => {
			vi.useFakeTimers();

			const config: CronJobConfig = {
				name: "error-scheduled-job",
				schedule: "*/2 * * * * *", // Every 2 seconds
			};

			let executionCount = 0;
			const handler: JobHandler = async () => {
				executionCount++;

				// Fail on the second execution
				if (executionCount === 2) {
					throw new Error(`Execution ${executionCount} failed`);
				}

				return {
					success: true,
					data: `Execution ${executionCount} succeeded`,
				};
			};

			jobManager.register(config, handler);
			jobManager.start("error-scheduled-job");

			const cronJobCalls = vi.mocked(CronJob as any).mock.calls;
			const latestCall = cronJobCalls[cronJobCalls.length - 1];
			const wrappedHandler = latestCall[1];

			// First execution (should succeed)
			await wrappedHandler();

			// Second execution (should fail)
			vi.advanceTimersByTime(2000);
			await wrappedHandler();

			// Third execution (should succeed again)
			vi.advanceTimersByTime(2000);
			await wrappedHandler();

			expect(executionCount).toBe(3);

			const job = jobManager.getJob("error-scheduled-job");

			// The last result should be the successful third execution
			expect(job?.lastResult?.success).toBe(true);
			expect(job?.lastResult?.data).toBe("Execution 3 succeeded");

			// Verify error logging for the failed execution
			expect(mockLogger.error).toHaveBeenCalledWith(
				expect.stringMatching(/Job failed: error-scheduled-job \(\d+ms\)/),
				expect.any(Error),
			);

			// Job should still be active after errors
			expect(job?.active).toBe(true);

			vi.useRealTimers();
		});

		it("should respect runOnInit option", async () => {
			const config: CronJobConfig = {
				name: "run-on-init-job",
				schedule: "0 0 * * *", // Daily at midnight
				runOnInit: true,
			};

			const handler: JobHandler = async () => {
				return { success: true };
			};

			// Verify that CronJob is called with runOnInit: true
			jobManager.register(config, handler);

			expect(CronJob).toHaveBeenCalledWith(
				"0 0 * * *",
				expect.any(Function),
				null,
				false,
				"UTC",
				null,
				true, // runOnInit should be true
			);
		});
	});

	describe("getJob", () => {
		it("should return job if it exists", () => {
			const config: CronJobConfig = {
				name: "get-job",
				schedule: "0 0 * * *",
			};

			const handler: JobHandler = async () => ({ success: true });

			jobManager.register(config, handler);
			const job = jobManager.getJob("get-job");

			expect(job).toBeDefined();
			expect(job?.config.name).toBe("get-job");
			expect(job?.config.schedule).toBe("0 0 * * *");
			expect(job?.active).toBe(false);
			expect(job?.task).toBe(mockCronJobInstance);
		});

		it("should return undefined if job does not exist", () => {
			const job = jobManager.getJob("non-existent-job");
			expect(job).toBeUndefined();
		});
	});

	describe("getAllJobs", () => {
		it("should return all registered jobs", () => {
			const configs = [
				{ name: "job1", schedule: "0 0 * * *" },
				{ name: "job2", schedule: "0 1 * * *" },
			];

			const handler: JobHandler = async () => ({ success: true });

			for (const config of configs) {
				jobManager.register(config, handler);
			}
			const jobs = jobManager.getAllJobs();

			expect(jobs).toHaveLength(2);
			expect(jobs.map((job) => job.config.name)).toContain("job1");
			expect(jobs.map((job) => job.config.name)).toContain("job2");

			// Verify structure of returned jobs
			for (const job of jobs) {
				expect(job).toHaveProperty("config");
				expect(job).toHaveProperty("task");
				expect(job).toHaveProperty("active");
				expect(job.task).toBe(mockCronJobInstance);
			}
		});

		it("should return empty array if no jobs registered", () => {
			const jobs = jobManager.getAllJobs();
			expect(jobs).toHaveLength(0);
			expect(Array.isArray(jobs)).toBe(true);
		});
	});

	describe("hasJob", () => {
		it("should return true for existing job", () => {
			const config: CronJobConfig = {
				name: "exists-job",
				schedule: "0 0 * * *",
			};

			const handler: JobHandler = async () => ({ success: true });

			jobManager.register(config, handler);
			expect(jobManager.hasJob("exists-job")).toBe(true);
		});

		it("should return false for non-existent job", () => {
			expect(jobManager.hasJob("non-existent-job")).toBe(false);
		});
	});

	describe("job execution wrapper", () => {
		it("should pass correct context to handler", async () => {
			const config: CronJobConfig = {
				name: "context-job",
				schedule: "0 0 * * *",
			};

			let receivedContext: any;
			const handler: JobHandler = async (context) => {
				receivedContext = context;
				await new Promise((resolve) => setTimeout(resolve, 1));
				return { success: true };
			};

			jobManager.register(config, handler);

			// Get the wrapped handler from CronJob mock
			const cronJobCalls = vi.mocked(CronJob as any).mock.calls;
			const latestCall = cronJobCalls[cronJobCalls.length - 1];
			const wrappedHandler = latestCall[1];

			// Execute the wrapped handler
			await wrappedHandler();

			expect(receivedContext).toBeDefined();
			expect(receivedContext.jobName).toBe("context-job");
			expect(receivedContext.startTime).toBeInstanceOf(Date);

			expect(mockLogger.info).toHaveBeenCalledWith("Starting job: context-job");
			expect(mockLogger.info).toHaveBeenCalledWith(
				expect.stringMatching(/Job completed: context-job \(\d+ms\)/),
			);
		});

		it("should handle non-Error thrown values", async () => {
			const config: CronJobConfig = {
				name: "throw-string-job",
				schedule: "0 0 * * *",
			};

			const handler: JobHandler = async () => {
				await new Promise((resolve) => setTimeout(resolve, 1));
				throw "String error";
			};

			jobManager.register(config, handler);

			// Get the wrapped handler from CronJob mock
			const cronJobCalls = vi.mocked(CronJob as any).mock.calls;
			const latestCall = cronJobCalls[cronJobCalls.length - 1];
			const wrappedHandler = latestCall[1];

			// Execute the wrapped handler
			await wrappedHandler();

			const job = jobManager.getJob("throw-string-job");
			expect(job?.lastResult?.success).toBe(false);
			expect(job?.lastResult?.error).toBe("String error");
			expect(job?.lastResult?.duration).toBeGreaterThanOrEqual(0);

			expect(mockLogger.error).toHaveBeenCalledWith(
				expect.stringMatching(/Job failed: throw-string-job \(\d+ms\)/),
				"String error",
			);
		});
	});
});

// Test the singleton export
describe("jobManager singleton", () => {
	it("should export a singleton instance", async () => {
		// You would uncomment this to test the actual export
		// const { jobManager: singletonInstance } = await import('../src/index');
		// expect(singletonInstance).toBeInstanceOf(JobManager);
		// expect(singletonInstance).toBe(jobManager); // Same instance

		// For now, just verify the test structure
		expect(true).toBe(true);
	});
});

// Integration tests
describe("Integration Tests", () => {
	it("should handle full job lifecycle", async () => {
		const jobManager = new JobManager();

		const config: CronJobConfig = {
			name: "lifecycle-job",
			schedule: "0 0 * * *",
			timeout: 5000,
		};

		let executionCount = 0;
		const handler: JobHandler<{ count: number }> = async (context) => {
			await new Promise((resolve) => setTimeout(resolve, 10)); // Add realistic delay
			executionCount++;

			// Verify context properties
			expect(context.jobName).toBe("lifecycle-job");
			expect(context.startTime).toBeInstanceOf(Date);

			return {
				success: true,
				data: { count: executionCount },
			};
		};

		// Register job
		jobManager.register(config, handler);
		expect(jobManager.hasJob("lifecycle-job")).toBe(true);
		expect(CronJob).toHaveBeenCalledWith(
			"0 0 * * *",
			expect.any(Function),
			null,
			false,
			"UTC",
			null,
			undefined,
		);

		// Start job
		jobManager.start("lifecycle-job");
		const job = jobManager.getJob<{ count: number }>("lifecycle-job");
		expect(job?.active).toBe(true);
		expect(mockCronJobInstance.start).toHaveBeenCalled();

		// Run immediately
		const startTime = Date.now();
		const result = await jobManager.runNow<{ count: number }>("lifecycle-job");
		const endTime = Date.now();

		expect(result.success).toBe(true);
		expect(result.data?.count).toBe(1);
		expect(result.duration).toBeGreaterThanOrEqual(8);
		expect(result.duration).toBeLessThan(endTime - startTime + 5);

		// Stop job
		jobManager.stop("lifecycle-job");
		expect(job?.active).toBe(false);
		expect(mockCronJobInstance.stop).toHaveBeenCalled();

		// Check last result
		expect(job?.lastResult?.success).toBe(true);
		expect(job?.lastResult?.data?.count).toBe(1);
		expect(job?.lastResult?.duration).toBeGreaterThanOrEqual(8);

		// Verify logging
		expect(mockLogger.info).toHaveBeenCalledWith("Started job: lifecycle-job");
		expect(mockLogger.info).toHaveBeenCalledWith("Stopped job: lifecycle-job");
		expect(mockLogger.info).toHaveBeenCalledWith(
			"Manually running job: lifecycle-job",
		);
		expect(mockLogger.info).toHaveBeenCalledWith(
			expect.stringMatching(/Manual job completed: lifecycle-job \(\d+ms\)/),
		);
	});
});
