import createCustomLogger from "@squared/logger";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import {
	RpcError,
	createErrorHandler,
	createRequestHandler,
	createRpcHandler,
} from "../src/index";

// Mock logger
const mockLogger = createCustomLogger("rpc-test");

describe("@squared/rpc", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("createRpcHandler", () => {
		it("should create a service set with proper structure", () => {
			const serviceName = "testService";
			const schema = {
				hello: {
					input: z.object({ name: z.string() }),
					output: z.object({ message: z.string() }),
				},
			};
			const implementation = {
				hello: async (input: { name: string }) => {
					return { message: `Hello, ${input.name}!` };
				},
			};

			const serviceSet = createRpcHandler(serviceName, schema, implementation);

			// Check the structure of the service set
			expect(serviceSet).toHaveProperty("meta");
			expect(serviceSet).toHaveProperty("implementation");
			expect(serviceSet.meta.service).toBe(serviceName);
			expect(serviceSet.meta.expose).toHaveLength(1);
			expect(serviceSet.meta.expose[0].methodName).toBe("hello");
			expect(serviceSet.implementation.hello).toBeDefined();
			expect(typeof serviceSet.implementation.hello).toBe("function");
		});
	});

	describe("createRequestHandler", () => {
		it("should create an Express request handler", () => {
			// Create a simple service
			const serviceName = "testService";
			const schema = {
				hello: {
					input: z.object({ name: z.string() }),
					output: z.object({ message: z.string() }),
				},
			};
			const implementation = {
				hello: async (input: { name: string }) => {
					return { message: `Hello, ${input.name}!` };
				},
			};

			const serviceSet = createRpcHandler(serviceName, schema, implementation);
			const requestHandler = createRequestHandler([serviceSet]);

			// Check that it's a function (Express middleware)
			expect(typeof requestHandler).toBe("function");
			expect(requestHandler.length).toBe(3); // (req, res, next)
		});
	});

	describe("createErrorHandler", () => {
		it("should create an Express error handler", () => {
			const errorHandler = createErrorHandler({ log: mockLogger });

			// Check that it's a function (Express error middleware)
			expect(typeof errorHandler).toBe("function");
			expect(errorHandler.length).toBe(4); // (err, req, res, next)
		});
	});

	describe("RpcError", () => {
		it("should create an error with proper structure", () => {
			const serviceName = "testService";
			const methodName = "testMethod";
			const innerError = new Error("Test error");

			const rpcError = new RpcError(serviceName, methodName, innerError);

			expect(rpcError.serviceName).toBe(serviceName);
			expect(rpcError.methodName).toBe(methodName);
			expect(rpcError.inner).toBe(innerError);
			expect(rpcError.message).toContain(serviceName);
			expect(rpcError.message).toContain(methodName);
			expect(rpcError.name).toBe("RpcError");
		});
	});
});
