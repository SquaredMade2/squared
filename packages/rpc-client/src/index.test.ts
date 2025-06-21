import {
	background,
	requestIdKey,
	withAbort,
	withDeadline,
	withValues,
} from "@squaredmade/context";
import superjson from "@squaredmade/superjson";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RPCContextClient, RpcResponseError } from "../src/index";

describe("@squaredmade/rpc-client", () => {
	let mockFetch: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		// Reset and setup the fetch mock
		mockFetch = vi.fn();
		global.fetch = mockFetch as typeof fetch;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("RPCContextClient", () => {
		it("should create a client with correct properties", () => {
			const baseURL = "http://api.example.com";
			const serviceName = "userService";

			const client = new RPCContextClient(baseURL, serviceName);

			// Using private property access for testing
			expect((client as any).baseURL).toBe("http://api.example.com/rpc");
			expect((client as any).serviceName).toBe("userService");
		});

		it("should normalize the baseURL by adding /rpc", () => {
			const baseURL = "http://api.example.com/";
			const serviceName = "userService";

			const client = new RPCContextClient(baseURL, serviceName);

			// Check that trailing slash is handled correctly
			expect((client as any).baseURL).toBe("http://api.example.com/rpc");
		});

		it("should make a request with correct parameters", async () => {
			// Mock successful response
			mockFetch.mockResolvedValueOnce({
				json: () => Promise.resolve(superjson.stringify({ result: "success" })),
				ok: true,
			});

			const baseURL = "http://api.example.com";
			const serviceName = "userService";
			const client = new RPCContextClient(baseURL, serviceName);

			// Create a context
			const ctx = background;

			// Make the request
			const result = await client.request(ctx, "getUser", {
				json: { id: "123" },
			});

			// Verify fetch was called with correct URL and params
			expect(mockFetch).toHaveBeenCalledTimes(1);
			expect(mockFetch).toHaveBeenCalledWith(
				"http://api.example.com/rpc/userService/getUser",
				expect.objectContaining({
					body: expect.any(String),
					headers: expect.objectContaining({
						"Content-Type": "application/json",
					}),
					method: "POST",
					signal: expect.any(AbortSignal),
				}),
			);

			// Check that result was parsed correctly
			expect(result).toEqual({ result: "success" });
		});

		it("should handle error responses", async () => {
			// Mock error response
			mockFetch.mockResolvedValueOnce({
				json: () =>
					Promise.resolve({
						code: "validation_error",
						message: "Validation failed",
						type: "https://errors.squared.global/@squaredmade/rpc/validation",
					}),
				ok: false,
				status: 400,
			});

			const baseURL = "http://api.example.com";
			const serviceName = "userService";
			const client = new RPCContextClient(baseURL, serviceName);

			// Create a context
			const ctx = background;

			// Expect the request to throw an RpcResponseError
			await expect(
				client.request(ctx, "getUser", { id: "123" }),
			).rejects.toThrow(RpcResponseError);

			// Verify fetch was called
			expect(mockFetch).toHaveBeenCalledTimes(1);
		});

		it("should include request ID in headers if present in context", async () => {
			// Mock successful response
			mockFetch.mockResolvedValueOnce({
				json: () => Promise.resolve(superjson.stringify({ result: "success" })),
				ok: true,
			});

			const baseURL = "http://api.example.com";
			const serviceName = "userService";
			const client = new RPCContextClient(baseURL, serviceName);

			// Create a context with request ID
			const ctx = withValues(background, {
				[requestIdKey]: "test-request-id",
			});

			// Make the request
			await client.request(ctx, "getUser", { id: "123" });

			// Verify request ID was included in headers
			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						"X-Request-ID": "test-request-id",
					}),
				}),
			);
		});

		it("should include deadline in headers if present in context", async () => {
			// Mock successful response
			mockFetch.mockResolvedValueOnce({
				json: () => Promise.resolve(superjson.stringify({ result: "success" })),
				ok: true,
			});

			const baseURL = "http://api.example.com";
			const serviceName = "userService";
			const client = new RPCContextClient(baseURL, serviceName);

			// Create a context with deadline
			const deadline = Date.now() + 5000; // 5 seconds from now
			const { ctx } = withDeadline(background, deadline);

			// Make the request
			await client.request(ctx, "getUser", { id: "123" });

			// Verify deadline was included in headers
			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						"X-Request-Deadline": expect.any(String),
					}),
				}),
			);
		});

		it("should use abort signal from context", async () => {
			// Mock successful response
			mockFetch.mockResolvedValueOnce({
				json: () => Promise.resolve(superjson.stringify({ result: "success" })),
				ok: true,
			});

			const baseURL = "http://api.example.com";
			const serviceName = "userService";
			const client = new RPCContextClient(baseURL, serviceName);

			// Create a context with abort controller
			const { ctx } = withAbort(background);

			// Make the request
			const requestPromise = client.request(ctx, "getUser", { id: "123" });

			// Verify signal was passed to fetch
			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					signal: ctx.signal,
				}),
			);

			// Wait for the request to complete
			await requestPromise;
		});
	});

	describe("RpcResponseError", () => {
		it("should create an error with the correct properties", () => {
			const source = "userService/getUser";
			const responseBody = {
				code: "validation_error",
				message: "Validation failed",
				type: "https://errors.squared.global/@squaredmade/rpc/validation",
			};
			const status = 400;

			const error = new RpcResponseError(source, responseBody, status);

			expect(error.name).toBe("RpcResponseError");
			expect(error.message).toBe("Validation failed");
			expect(error.code).toBe("validation_error");
			expect(error.type).toBe(
				"https://errors.squared.global/@squaredmade/rpc/validation",
			);
			expect(error.source).toEqual([source]);
			expect(error.status).toBe(status);
		});

		it("should append source to existing sources in the response body", () => {
			const source = "userService/getUser";
			const responseBody = {
				code: "internal_error",
				message: "Internal error",
				source: ["internal/service"],
			};
			const status = 500;

			const error = new RpcResponseError(source, responseBody, status);

			expect(error.source).toEqual(["internal/service", source]);
		});
	});
});
