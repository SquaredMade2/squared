import createCustomLogger from "@squaredmade/logger";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
	createEnumSchema,
	createSchema,
	createServiceSchema,
} from "../src/index";
import {
	ResponseValidationError,
	serviceWithSchema,
	ValidationError,
} from "../src/rpc-types";

const testLogger = createCustomLogger("rpc-test");

describe("@squaredmade/rpc schema utilities", () => {
	describe("createSchema", () => {
		it("should return the input schema", () => {
			type User = {
				id: string;
				name: string;
				age: number;
			};

			const userSchema = createSchema<User>()(
				z.object({
					age: z.number(),
					id: z.string(),
					name: z.string(),
				}),
			);

			expect(userSchema).toBeInstanceOf(z.ZodObject);

			// Test validation works
			const validUser = { age: 30, id: "123", name: "John" };
			expect(userSchema.parse(validUser)).toEqual(validUser);

			// Test validation fails
			const invalidUser = { age: "30", id: "123", name: "John" };
			expect(() => userSchema.parse(invalidUser)).toThrow();
		});
	});

	describe("createEnumSchema", () => {
		it("should return the input enum schema", () => {
			type UserRole = "admin" | "user" | "guest";

			const roleSchema = createEnumSchema<UserRole>()(
				z.enum(["admin", "user", "guest"]),
			);

			expect(roleSchema).toBeInstanceOf(z.ZodEnum);

			// Test validation works
			expect(roleSchema.parse("admin")).toBe("admin");
			expect(roleSchema.parse("user")).toBe("user");
			expect(roleSchema.parse("guest")).toBe("guest");

			// Test validation fails
			expect(() => roleSchema.parse("moderator")).toThrow();
		});
	});

	describe("createServiceSchema", () => {
		it("should return the input service schema", () => {
			// Define a service interface
			interface UserService {
				getUser: (arg: { id: string }) => Promise<{
					name: string;
					age: number;
				}>;
				createUser: (arg: { name: string; age: number }) => Promise<{
					id: string;
				}>;
			}

			// Create schema for the service
			const userServiceSchema = createServiceSchema<UserService>()({
				createUser: {
					input: z.object({ age: z.number(), name: z.string() }),
					output: z.object({ id: z.string() }),
				},
				getUser: {
					input: z.object({ id: z.string() }),
					output: z.object({ age: z.number(), name: z.string() }),
				},
			});

			expect(userServiceSchema).toHaveProperty("getUser");
			expect(userServiceSchema).toHaveProperty("createUser");
			expect(userServiceSchema.getUser.input).toBeInstanceOf(z.ZodObject);
			expect(userServiceSchema.getUser.output).toBeInstanceOf(z.ZodObject);
		});
	});

	describe("ValidationError", () => {
		it("should create a validation error with the correct properties", () => {
			const code = "validation";
			const type = "https://errors.squared.global/@squaredmade/rpc/validation";
			const message = "Validation failed";
			const params = { instancePath: "user.age", schemaPath: "min" };

			const error = new ValidationError(code, type, message, params);

			expect(error).toBeInstanceOf(Error);
			expect(error.name).toBe("ValidationError");
			expect(error.code).toBe(code);
			expect(error.type).toBe(type);
			expect(error.message).toBe(message);
			expect(error.params).toEqual(params);
		});
	});

	describe("ResponseValidationError", () => {
		it("should create a response validation error with the correct properties", () => {
			const message = "Response validation failed";
			const params = { instancePath: "response.data", schemaPath: "type" };

			const error = new ResponseValidationError(message, params);

			expect(error).toBeInstanceOf(ValidationError);
			expect(error.name).toBe("ResponseValidationError");
			expect(error.code).toBe("response-validation");
			expect(error.type).toBe(
				"https://errors.squared.global/@squaredmade/rpc/response-validation",
			);
			expect(error.message).toBe(message);
			expect(error.params).toEqual(params);
		});
	});

	describe("serviceWithSchema", () => {
		it("should create a service set with validation", () => {
			// Mock service implementation
			const service = {
				hello: async (i: { name: string }) => {
					return { greeting: `Hello, ${i.name}!` };
				},
			};

			// Define service schema
			const serviceMeta = {
				logger: testLogger,
				methods: {
					hello: {
						methodName: "hello",
						requestSchema: z.object({ name: z.string() }),
						responseSchema: z.object({ greeting: z.string() }),
					},
				},
				name: "greetingService",
			};

			// Create service with schema
			const serviceSet = serviceWithSchema(service, serviceMeta);

			expect(serviceSet).toHaveProperty("implementation");
			expect(serviceSet).toHaveProperty("meta");
			expect(serviceSet.meta.service).toBe("greetingService");
			expect(serviceSet.meta.expose).toHaveLength(1);
			expect(serviceSet.meta.expose[0].methodName).toBe("hello");

			// Test implementation function
			const input = { name: "John" };
			return serviceSet.implementation.hello(input).then((result) => {
				expect(result).toEqual({ greeting: "Hello, John!" });
			});
		});

		it("should throw validation errors for invalid input", async () => {
			// Mock service implementation
			const service = {
				checkAge: async (input: { age: number }) => {
					return { allowed: input.age >= 18 };
				},
			};

			// Define service schema
			const serviceMeta = {
				logger: testLogger,
				methods: {
					checkAge: {
						methodName: "checkAge",
						requestSchema: z.object({ age: z.number().min(18) }),
						responseSchema: z.object({ allowed: z.boolean() }),
					},
				},
				name: "validationService",
			};

			// Create service with schema
			const serviceSet = serviceWithSchema(service, serviceMeta);

			// Test with invalid input
			const invalidInput = { age: 16 };

			await expect(
				serviceSet.implementation.checkAge(invalidInput),
			).rejects.toThrow(ValidationError);
		});
	});
});
