import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createLogger, format, transports } from "winston";
import createCustomLogger from ".";

// Mock winston
vi.mock("winston", () => {
	const formatModule = {
		combine: vi.fn(() => "combine_result"),
		timestamp: vi.fn(() => "timestamp_result"),
		simple: vi.fn(() => "simple_result"),
		colorize: vi.fn(() => "colorize_result"),
		splat: vi.fn(() => "splat_result"),
		printf: vi.fn(() => "printf_result"),
	};

	const transportModule = {
		File: vi.fn(),
		Console: vi.fn(),
	};

	const mockLogger = {
		info: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
		debug: vi.fn(),
		add: vi.fn(),
	};

	return {
		createLogger: vi.fn(() => mockLogger),
		format: formatModule,
		transports: transportModule,
	};
});

describe("@squared/logger", () => {
	let originalEnv: NodeJS.ProcessEnv;

	beforeEach(() => {
		originalEnv = { ...process.env };
		vi.clearAllMocks();
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	describe("logger creation", () => {
		it("should create a logger with default options", () => {
			const logger = createCustomLogger("test");

			expect(createLogger).toHaveBeenCalled();
			expect(logger).toBeDefined();
			expect(logger.info).toBeDefined();
			expect(logger.error).toBeDefined();
			expect(logger.warn).toBeDefined();
			expect(logger.debug).toBeDefined();
		});

		it("should create a logger with a prefix", () => {
			createCustomLogger("test-service");

			expect(createLogger).toHaveBeenCalled();
			const call = vi.mocked(createLogger).mock.calls[0][0];
			expect(call).toBeDefined();

			// Verify that the printf format is called
			// Although we mock the function, we can still verify it's called
			expect(format.printf).toHaveBeenCalled();
		});

		it("should set up file transports", () => {
			createCustomLogger("test");

			expect(transports.File).toHaveBeenCalledTimes(2);

			// First call should be for error.log
			const errorLogCall = vi.mocked(transports.File).mock.calls[0][0];
			expect(errorLogCall).toHaveProperty("filename", "error.log");
			expect(errorLogCall).toHaveProperty("level", "error");

			// Second call should be for combined.log
			const combinedLogCall = vi.mocked(transports.File).mock.calls[1][0];
			expect(combinedLogCall).toHaveProperty("filename", "combined.log");
		});
	});

	describe("environment handling", () => {
		it("should add console transport in non-production environment", () => {
			process.env.NODE_ENV = "development";
			const logger = createCustomLogger("test");

			expect(transports.Console).toHaveBeenCalled();
			expect(logger.add).toHaveBeenCalled();
		});

		it("should not add console transport in production environment", () => {
			process.env.NODE_ENV = "production";
			const logger = createCustomLogger("test");

			expect(transports.Console).not.toHaveBeenCalled();
			expect(logger.add).not.toHaveBeenCalled();
		});

		it("should respect the RUNNING_TESTS environment variable", () => {
			process.env.NODE_ENV = "development";
			process.env.RUNNING_TESTS = "true";

			createCustomLogger("test");

			const consoleCall = vi.mocked(transports.Console).mock.calls[0][0];
			expect(consoleCall).toHaveProperty("silent", true);
		});
	});

	describe("log level configuration", () => {
		it("should use debug level in non-production environment", () => {
			process.env.NODE_ENV = "development";
			createCustomLogger("test");

			const createLoggerCall = vi.mocked(createLogger).mock.calls[0][0];
			expect(createLoggerCall).toHaveProperty("level", "debug");
		});

		it("should use info level in production environment", () => {
			process.env.NODE_ENV = "production";
			createCustomLogger("test");

			const createLoggerCall = vi.mocked(createLogger).mock.calls[0][0];
			expect(createLoggerCall).toHaveProperty("level", "info");
		});
	});

	describe("error formatting", () => {
		it("should set up formatError for error handling", () => {
			createCustomLogger("test");

			// Check that printf was called, which uses formatError
			expect(format.printf).toHaveBeenCalled();
		});
	});
});
