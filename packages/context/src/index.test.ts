import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	TODO,
	background,
	getRequestId,
	requestIdKey,
	withAbort,
	withDeadline,
	withTimeout,
	withValues,
} from "../src/index";

describe("@squared/context", () => {
	describe("root contexts", () => {
		it("should create background context", () => {
			expect(background).toBeDefined();
			expect(background.signal).toBeUndefined();
			expect(background.deadline).toBeUndefined();
		});

		it("should create TODO context", () => {
			expect(TODO).toBeDefined();
			expect(TODO.signal).toBeUndefined();
			expect(TODO.deadline).toBeUndefined();
		});
	});

	describe("withValues", () => {
		it("should add string values to context", () => {
			const ctx = withValues(background, { "test-key": "test-value" });
			// Use type assertion to handle dynamic properties
			expect((ctx as any)["test-key"]).toBe("test-value");
		});

		it("should add symbol values to context", () => {
			const testSymbol = Symbol("test");
			const ctx = withValues(background, { [testSymbol]: "test-value" });
			// Use type assertion to handle symbol properties
			expect((ctx as any)[testSymbol]).toBe("test-value");
		});

		it("should preserve existing context values", () => {
			const ctx1 = withValues(background, { key1: "value1" });
			const ctx2 = withValues(ctx1, { key2: "value2" });

			// Use type assertion for dynamic properties
			expect((ctx2 as any).key1).toBe("value1");
			expect((ctx2 as any).key2).toBe("value2");
		});

		it("should throw if parent is not a context", () => {
			expect(() => withValues({} as any, { key: "value" })).toThrow(TypeError);
		});
	});

	describe("withAbort", () => {
		it("should create an abortable context", () => {
			const { ctx, abort } = withAbort(background);

			expect(ctx.signal).toBeInstanceOf(AbortSignal);
			expect(typeof abort).toBe("function");
			expect(ctx.signal?.aborted).toBe(false);
		});

		it("should abort the context when abort is called", () => {
			const { ctx, abort } = withAbort(background);

			abort();
			expect(ctx.signal?.aborted).toBe(true);
		});

		it("should chain aborts from parent context", () => {
			const parent = withAbort(background);
			const child = withAbort(parent.ctx);

			parent.abort();

			expect(parent.ctx.signal?.aborted).toBe(true);
			expect(child.ctx.signal?.aborted).toBe(true);
		});
	});

	describe("withDeadline", () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.restoreAllMocks();
		});

		it("should create a context with a deadline", () => {
			const deadline = Date.now() + 1000;
			const { ctx } = withDeadline(background, deadline);

			expect(ctx.deadline).toBe(deadline);
			expect(ctx.signal).toBeInstanceOf(AbortSignal);
			expect(ctx.signal?.aborted).toBe(false);
		});

		it("should abort when deadline is reached", () => {
			const deadline = Date.now() + 1000;
			const { ctx } = withDeadline(background, deadline);

			vi.advanceTimersByTime(1001);

			expect(ctx.signal?.aborted).toBe(true);
		});

		it("should accept Date objects as deadline", () => {
			const deadlineDate = new Date(Date.now() + 1000);
			const { ctx } = withDeadline(background, deadlineDate);

			expect(ctx.deadline).toBe(deadlineDate.getTime());
		});

		it("should use parent deadline if it expires sooner", () => {
			const parentDeadline = Date.now() + 1000;
			const childDeadline = Date.now() + 2000;

			const parent = withDeadline(background, parentDeadline);
			const child = withDeadline(parent.ctx, childDeadline);

			expect(child.ctx.deadline).toBe(parentDeadline);
		});
	});

	describe("withTimeout", () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.restoreAllMocks();
		});

		it("should create a context with a timeout", () => {
			const { ctx } = withTimeout(background, 1000);

			expect(ctx.deadline).toBeDefined();
			expect(ctx.signal).toBeInstanceOf(AbortSignal);
			expect(ctx.signal?.aborted).toBe(false);
		});

		it("should abort when timeout is reached", () => {
			const { ctx } = withTimeout(background, 1000);

			vi.advanceTimersByTime(1001);

			expect(ctx.signal?.aborted).toBe(true);
		});
	});

	describe("getRequestId", () => {
		it("should return undefined when no request ID is set", () => {
			expect(getRequestId(background)).toBeUndefined();
		});

		it("should return the request ID when set", () => {
			const ctx = withValues(background, { [requestIdKey]: "test-request-id" });

			expect(getRequestId(ctx)).toBe("test-request-id");
		});
	});

	describe("complex scenarios", () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.restoreAllMocks();
		});

		it("should handle nested contexts with values, timeouts, and aborts", async () => {
			// Create a base context with request ID
			const baseCtx = withValues(background, {
				[requestIdKey]: "request-123",
				user: "john",
			});

			// Add a timeout
			const { ctx: timedCtx, abort: abortTimed } = withTimeout(baseCtx, 2000);

			// Add more values
			const finalCtx = withValues(timedCtx, { role: "admin" });

			// Verify all properties are accessible
			expect(getRequestId(finalCtx)).toBe("request-123");
			expect((finalCtx as any).user).toBe("john");
			expect((finalCtx as any).role).toBe("admin");
			expect(finalCtx.deadline).toBeDefined();

			// Advance time but not enough to trigger timeout
			vi.advanceTimersByTime(1000);
			expect(finalCtx.signal?.aborted).toBe(false);

			// Manually abort
			abortTimed();
			expect(finalCtx.signal?.aborted).toBe(true);
		});

		it("should preserve correct prototype chain for inspection", () => {
			const ctx1 = withValues(background, { key1: "value1" });
			const ctx2 = withValues(ctx1, { key2: "value2" });
			const ctx3 = withValues(ctx2, { key3: "value3" });

			// All values should be accessible through prototype chain
			expect((ctx3 as any).key1).toBe("value1");
			expect((ctx3 as any).key2).toBe("value2");
			expect((ctx3 as any).key3).toBe("value3");

			// Should convert to string when using custom inspect
			const inspectSymbol = Symbol.for("nodejs.util.inspect.custom");
			expect(typeof (ctx3 as any)[inspectSymbol]).toBe("function");
		});
	});
});
