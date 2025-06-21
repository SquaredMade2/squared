import fs from "node:fs";
import { Decimal } from "decimal.js";
import { describe, expect, it, type TestAPI, test } from "vitest";
import SuperJSON from "./index";
import {
	isArray,
	isMap,
	isPlainObject,
	isPrimitive,
	isSet,
	isTypedArray,
} from "./is";
import type { JSONValue, SuperJSONResult, SuperJSONValue } from "./types";

const isNode10 = process.version.indexOf("v10") === 0;

describe("stringify & parse", () => {
	const cases: Record<
		string,
		{
			input: (() => SuperJSONValue) | SuperJSONValue;
			output: JSONValue | ((v: JSONValue) => void);
			outputAnnotations?: SuperJSONResult["meta"];
			customExpectations?: (value: any) => void;
			skipOnNode10?: boolean;
			dontExpectEquality?: boolean;
			only?: boolean;
		}
	> = {
		"issue #58": {
			input: () => {
				const cool = Symbol("cool");
				SuperJSON.registerSymbol(cool);
				return {
					q: [
						9,
						{
							foo1: new Date(2020, 1, 1),
							henlo: undefined,
							yee: new Date(2020, 1, 1),
							yee2: new Date(2020, 1, 1),
							z: cool,
						},
					],
				};
			},
			output: {
				q: [
					9,
					{
						foo1: new Date(2020, 1, 1).toISOString(),
						henlo: null,
						yee: new Date(2020, 1, 1).toISOString(),
						yee2: new Date(2020, 1, 1).toISOString(),
						z: "cool",
					},
				],
			},
			outputAnnotations: {
				values: {
					"q.1.foo1": ["Date"],
					"q.1.henlo": ["undefined"],
					"q.1.yee": ["Date"],
					"q.1.yee2": ["Date"],
					"q.1.z": [["symbol", "cool"]],
				},
			},
			skipOnNode10: true,
		},

		"preserves object identity": {
			customExpectations: (output) => {
				expect(output.selected).toBe(output.options[0]);
			},
			input: () => {
				const a = { id: "a" };
				const b = { id: "b" };
				return {
					options: [a, b],
					selected: a,
				};
			},
			output: {
				options: [{ id: "a" }, { id: "b" }],
				selected: { id: "a" },
			},
			outputAnnotations: {
				referentialEqualities: {
					selected: ["options.0"],
				},
			},
		},

		"regression #109: nested classes": {
			customExpectations(value) {
				expect(value.pet.woof()).toEqual("Rover");
			},
			input: () => {
				class Pet {
					private name: string;
					constructor(name: string) {
						this.name = name;
					}

					woof() {
						return this.name;
					}
				}

				class User {
					pet: Pet;
					constructor(p: Pet) {
						this.pet = p;
					}
				}

				SuperJSON.registerClass(Pet);
				SuperJSON.registerClass(User);

				const pet = new Pet("Rover");
				const user = new User(pet);

				return user;
			},
			output: {
				pet: {
					name: "Rover",
				},
			},
			outputAnnotations: {
				values: [
					["class", "User"],
					{
						pet: [["class", "Pet"]],
					},
				],
			},
		},

		"special case: objects with array-like keys": {
			input: {
				a: { 0: 3, 1: 5, 2: { 3: "c" } },
				b: null,
			},
			output: {
				a: { 0: 3, 1: 5, 2: { 3: "c" } },
				b: null,
			},
		},

		"works for -Infinity": {
			input: {
				a: Number.NEGATIVE_INFINITY,
			},
			output: {
				a: "-Infinity",
			},
			outputAnnotations: {
				values: {
					a: ["number"],
				},
			},
		},

		"works for arrays": {
			input: {
				a: [1, undefined, 2],
			},
			output: {
				a: [1, null, 2],
			},
			outputAnnotations: {
				values: {
					"a.1": ["undefined"],
				},
			},
		},

		"works for bigint": {
			input: {
				a: BigInt("1021312312412312312313"),
			},
			output: {
				a: "1021312312412312312313",
			},
			outputAnnotations: {
				values: {
					a: ["bigint"],
				},
			},
		},

		"works for Decimal.js": {
			input: () => {
				SuperJSON.registerCustom<Decimal, string>(
					{
						deserialize: (v) => new Decimal(v),
						isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
						serialize: (v) => v.toJSON(),
					},
					"decimal.js",
				);

				return {
					a: new Decimal("100.1"),
				};
			},
			output: {
				a: "100.1",
			},
			outputAnnotations: {
				values: {
					a: [["custom", "decimal.js"]],
				},
			},
		},

		"works for dates": {
			input: {
				meeting: {
					date: new Date(2020, 1, 1),
				},
			},
			output: {
				meeting: {
					date: new Date(2020, 1, 1).toISOString(),
				},
			},
			outputAnnotations: {
				values: {
					"meeting.date": ["Date"],
				},
			},
		},

		"works for Errors": {
			customExpectations: (untransformed: any) => {
				expect(untransformed.e).toBeInstanceOf(Error);
				expect(untransformed.e.message).toBe("epic fail");
				expect(untransformed.e.name).toBe("Error");
			},
			dontExpectEquality: true,
			input: {
				e: new Error("epic fail"),
			},
			output: ({ e }: any) => {
				expect(e.name).toBe("Error");
				expect(e.message).toBe("epic fail");
			},
			outputAnnotations: {
				values: {
					e: ["Error"],
				},
			},
		},

		"works for Infinity": {
			input: {
				a: Number.POSITIVE_INFINITY,
			},
			output: {
				a: "Infinity",
			},
			outputAnnotations: {
				values: {
					a: ["number"],
				},
			},
		},

		"works for Maps": {
			input: {
				a: new Map([
					[1, "a"],
					[Number.NaN, "b"],
				]),
				b: new Map([["2", "b"]]),
				d: new Map([[true, "true key"]]),
			},

			output: {
				a: [
					[1, "a"],
					["NaN", "b"],
				],
				b: [["2", "b"]],
				d: [[true, "true key"]],
			},

			outputAnnotations: {
				values: {
					a: ["map", { "1.0": ["number"] }],
					b: ["map"],
					d: ["map"],
				},
			},
		},

		"works for Maps with a key that's referentially equal to another field": {
			input: () => {
				const robbyBubble = { id: 5 };
				const highscores = new Map([[robbyBubble, 5000]]);
				return {
					highscores,
					topScorer: robbyBubble,
				} as any;
			},
			output: {
				highscores: [[{ id: 5 }, 5000]],
				topScorer: { id: 5 },
			},
			outputAnnotations: {
				referentialEqualities: {
					topScorer: ["highscores.0.0"],
				},
				values: {
					highscores: ["map"],
				},
			},
		},

		"works for Maps with two keys that serialize to the same string but have a different reference":
			{
				input: new Map([
					[/a/g, "foo"],
					[/a/g, "bar"],
				]),
				output: [
					["/a/g", "foo"],
					["/a/g", "bar"],
				],
				outputAnnotations: {
					values: [
						"map",
						{
							"0.0": ["regexp"],
							"1.0": ["regexp"],
						},
					],
				},
			},

		"works for maps with non-uniform keys": {
			input: {
				map: new Map<string | number, number>([
					[1, 1],
					["1", 1],
				]),
			},
			output: {
				map: [
					[1, 1],
					["1", 1],
				],
			},
			outputAnnotations: {
				values: {
					map: ["map"],
				},
			},
		},

		"works for NaN": {
			input: {
				a: Number.NaN,
			},
			output: {
				a: "NaN",
			},
			outputAnnotations: {
				values: {
					a: ["number"],
				},
			},
		},
		"works for objects": {
			input: {
				a: { 1: 5, 2: { 3: "c" } },
				b: null,
			},
			output: {
				a: { 1: 5, 2: { 3: "c" } },
				b: null,
			},
		},

		"works for paths containing backslashes": {
			input: {
				"a\\.1": {
					b: new Set([1, 2]),
				},
			},
			output: {
				"a\\.1": {
					b: [1, 2],
				},
			},
			outputAnnotations: {
				values: {
					"a\\\\.1.b": ["set"],
				},
			},
		},

		"works for paths containing dots": {
			input: {
				"a.1": {
					b: new Set([1, 2]),
				},
			},
			output: {
				"a.1": {
					b: [1, 2],
				},
			},
			outputAnnotations: {
				values: {
					"a\\.1.b": ["set"],
				},
			},
		},

		"works for referentially equal maps": {
			customExpectations: (value) => {
				expect(value.a).toBe(value.b);
			},
			input: () => {
				const map = new Map([[1, 1]]);
				return {
					a: map,
					b: map,
				};
			},
			output: {
				a: [[1, 1]],
				b: [[1, 1]],
			},
			outputAnnotations: {
				referentialEqualities: {
					a: ["b"],
				},
				values: {
					a: ["map"],
					b: ["map"],
				},
			},
		},

		"works for referentially equal values in different maps and sets": {
			input: () => {
				const user = { id: 2 };

				return {
					workspaces: new Map([
						[1, { users: new Set([user]) }],
						[2, { users: new Set([user]) }],
					]),
				};
			},
			output: {
				workspaces: [
					[1, { users: [{ id: 2 }] }],
					[2, { users: [{ id: 2 }] }],
				],
			},
			outputAnnotations: {
				referentialEqualities: {
					"workspaces.0.1.users.0": ["workspaces.1.1.users.0"],
				},
				values: {
					workspaces: [
						"map",
						{
							"0.1.users": ["set"],
							"1.1.users": ["set"],
						},
					],
				},
			},
		},

		"works for referentially equal values inside a set": {
			customExpectations: (value) => {
				expect(value.users.values().next().value).toBe(value.userOfTheMonth);
			},
			input: () => {
				const user = { id: 2 };
				return {
					userOfTheMonth: user,
					users: new Set([user]),
				};
			},
			output: {
				userOfTheMonth: { id: 2 },
				users: [{ id: 2 }],
			},
			outputAnnotations: {
				referentialEqualities: {
					userOfTheMonth: ["users.0"],
				},
				values: {
					users: ["set"],
				},
			},
		},

		"works for regex": {
			input: {
				a: /hello/g,
			},
			output: {
				a: "/hello/g",
			},
			outputAnnotations: {
				values: {
					a: ["regexp"],
				},
			},
		},

		"works for Sets": {
			input: {
				a: new Set([1, undefined, 2]),
			},
			output: {
				a: [1, null, 2],
			},
			outputAnnotations: {
				values: {
					a: ["set", { 1: ["undefined"] }],
				},
			},
		},

		"works for self-referencing objects": {
			input: () => {
				const a = { children: [] as any[], role: "parent" };
				const b = { parents: [a], role: "child" };
				a.children.push(b);
				return a;
			},
			output: {
				children: [
					{
						parents: [null],
						role: "child",
					},
				],
				role: "parent",
			},
			outputAnnotations: {
				referentialEqualities: [["children.0.parents.0"]],
			},
		},

		"works for symbols": {
			input: () => {
				const parent = Symbol("Parent");
				const child = Symbol("Child");
				SuperJSON.registerSymbol(parent, "1");
				SuperJSON.registerSymbol(child, "2");

				const a = { role: parent };
				const b = { role: child };

				return { a, b };
			},
			output: {
				a: { role: "Parent" },
				b: { role: "Child" },
			},
			outputAnnotations: {
				values: {
					"a.role": [["symbol", "1"]],
					"b.role": [["symbol", "2"]],
				},
			},
			skipOnNode10: true,
		},

		"works for top-level Sets": {
			input: new Set([1, undefined, 2]),
			output: [1, null, 2],
			outputAnnotations: {
				values: ["set", { 1: ["undefined"] }],
			},
		},

		"works for undefined, issue #48": {
			input: undefined,
			output: null,
			outputAnnotations: { values: ["undefined"] },
		},

		"works for unknown": {
			input: () => {
				type Freak = {
					name: string;
					age: unknown;
				};

				const person: Freak = {
					age: 1,
					name: "@ftonato",
				};

				return person;
			},
			output: {
				age: 1,
				name: "@ftonato",
			},
			outputAnnotations: undefined,
		},

		"works with custom allowedProps": {
			customExpectations(value) {
				expect(value.password).toBeUndefined();
				expect(value.username).toBe("bongocat");
			},
			dontExpectEquality: true,
			input: () => {
				class User {
					username: string;
					password: string;
					constructor(username: string, password: string) {
						this.username = username;
						this.password = password;
					}
				}
				SuperJSON.registerClass(User, { allowProps: ["username"] });
				return new User("bongocat", "supersecurepassword");
			},
			output: {
				username: "bongocat",
			},
			outputAnnotations: {
				values: [["class", "User"]],
			},
		},

		"works with typed arrays": {
			input: {
				a: new Int8Array([1, 2]),
				b: new Uint8ClampedArray(3),
			},
			output: {
				a: [1, 2],
				b: [0, 0, 0],
			},
			outputAnnotations: {
				values: {
					a: [["typed-array", "Int8Array"]],
					b: [["typed-array", "Uint8ClampedArray"]],
				},
			},
		},
		"works with URL": {
			input: {
				a: new URL("https://example.com/"),
				b: new URL("https://github.com/blitz-js/superjson"),
			},
			output: {
				a: "https://example.com/",
				b: "https://github.com/blitz-js/superjson",
			},
			outputAnnotations: {
				values: {
					a: ["URL"],
					b: ["URL"],
				},
			},
		},
	};

	function deepFreeze(object: any, alreadySeenObjects = new Set()) {
		if (isPrimitive(object)) {
			return;
		}

		if (isTypedArray(object)) {
			return;
		}

		if (alreadySeenObjects.has(object)) {
			return;
		}
		alreadySeenObjects.add(object);

		if (isPlainObject(object)) {
			for (const o of Object.values(object)) {
				deepFreeze(o, alreadySeenObjects);
			}
		}

		if (isSet(object)) {
			for (const o of object) {
				deepFreeze(o, alreadySeenObjects);
			}
		}

		if (isArray(object)) {
			for (const o of object) {
				deepFreeze(o, alreadySeenObjects);
			}
		}

		if (isMap(object)) {
			object.forEach((value, key) => {
				deepFreeze(key, alreadySeenObjects);
				deepFreeze(value, alreadySeenObjects);
			});
		}

		Object.freeze(object);
	}

	for (const [
		testName,
		{
			input,
			output: expectedOutput,
			outputAnnotations: expectedOutputAnnotations,
			customExpectations,
			skipOnNode10,
			dontExpectEquality,
			only,
		},
	] of Object.entries(cases)) {
		let testFunc = test;

		if (skipOnNode10 && isNode10) {
			testFunc = test.skip as TestAPI;
		}

		if (only) {
			testFunc = test.only as TestAPI;
		}

		testFunc(testName, () => {
			const inputValue = typeof input === "function" ? input() : input;

			// let's make sure SuperJSON doesn't mutate our input!
			deepFreeze(inputValue);
			const { json, meta } = SuperJSON.serialize(inputValue);

			if (typeof expectedOutput === "function") {
				expectedOutput(json);
			} else {
				expect(json).toEqual(expectedOutput);
			}
			expect(meta).toEqual(expectedOutputAnnotations);

			const untransformed = SuperJSON.deserialize(
				JSON.parse(JSON.stringify({ json, meta })),
			);
			if (!dontExpectEquality) {
				expect(untransformed).toEqual(inputValue);
			}
			customExpectations?.(untransformed);
		});
	}

	describe("when serializing custom class instances", () => {
		it("revives them to their original class", () => {
			class Train {
				topSpeed: number;
				color: "red" | "blue" | "yellow";
				brand: string;
				constructor(
					topSpeed: number,
					color: "red" | "blue" | "yellow",
					brand: string,
				) {
					this.topSpeed = topSpeed;
					this.color = color;
					this.brand = brand;
				}

				brag() {
					return `I'm a ${this.brand} in freakin' ${this.color} and I go ${this.topSpeed} km/h, isn't that bonkers?`;
				}
			}

			SuperJSON.registerClass(Train);

			const { json, meta } = SuperJSON.serialize({
				s7: new Train(100, "yellow", "Bombardier") as any,
			});

			expect(json).toEqual({
				s7: {
					brand: "Bombardier",
					color: "yellow",
					topSpeed: 100,
				},
			});

			expect(meta).toEqual({
				values: {
					s7: [["class", "Train"]],
				},
			});

			const deserialized: any = SuperJSON.deserialize(
				JSON.parse(JSON.stringify({ json, meta })),
			);
			expect(deserialized.s7).toBeInstanceOf(Train);
			expect(typeof deserialized.s7.brag()).toBe("string");
		});

		describe("with accessor attributes", () => {
			it("works", () => {
				class Currency {
					private valueInUsd: number;
					constructor(valueInUsd: number) {
						this.valueInUsd = valueInUsd;
					}

					get inUSD() {
						return this.valueInUsd;
					}
				}

				SuperJSON.registerClass(Currency);

				const { json, meta } = SuperJSON.serialize({
					price: new Currency(100) as any,
				});

				expect(json).toEqual({
					price: {
						valueInUsd: 100,
					},
				});

				const result: any = SuperJSON.parse(JSON.stringify({ json, meta }));

				const price: Currency = result.price;

				expect(price.inUSD).toBe(100);
			});
		});
	});

	describe("when given a non-SuperJSON object", () => {
		it.todo("has undefined behaviour");
	});

	test("regression #65: BigInt on Safari v13", () => {
		const oldBigInt = global.BigInt;
		// @ts-expect-error
		global.BigInt = undefined;

		const input = {
			a: oldBigInt("1000"),
		};

		const superJSONed = SuperJSON.serialize(input);
		expect(superJSONed).toEqual({
			json: {
				a: "1000",
			},
			meta: {
				values: {
					a: ["bigint"],
				},
			},
		});

		const deserialised = SuperJSON.deserialize(
			JSON.parse(JSON.stringify(superJSONed)),
		);
		expect(deserialised).toEqual({
			a: "1000",
		});

		global.BigInt = oldBigInt;
	});

	test("regression #80: Custom error serialisation isnt overriden", () => {
		class CustomError extends Error {
			readonly customProperty: number;
			constructor(customProperty: number) {
				super("I'm a custom error");
				this.customProperty = customProperty;

				Object.setPrototypeOf(this, CustomError.prototype);
			}
		}

		expect(new CustomError(10)).toBeInstanceOf(CustomError);

		SuperJSON.registerClass(CustomError);

		const { error } = SuperJSON.deserialize(
			SuperJSON.serialize({
				error: new CustomError(10),
			}),
		) as any;

		expect(error).toBeInstanceOf(CustomError);
		expect(error.customProperty).toEqual(10);
	});
});

describe("allowErrorProps(...) (#91)", () => {
	it("works with simple prop values", () => {
		const errorWithAdditionalProps: Error & any = new Error(
			"I have additional props 😄",
		);
		errorWithAdditionalProps.code = "P2002";
		errorWithAdditionalProps.meta = "👾";

		// same as allowErrorProps("code", "meta")
		SuperJSON.allowErrorProps("code");
		SuperJSON.allowErrorProps("meta");

		const errorAfterTransition: any = SuperJSON.parse(
			SuperJSON.stringify(errorWithAdditionalProps),
		);

		expect(errorAfterTransition).toBeInstanceOf(Error);
		expect(errorAfterTransition.message).toEqual("I have additional props 😄");
		expect(errorAfterTransition.code).toEqual("P2002");
		expect(errorAfterTransition.meta).toEqual("👾");
	});

	it("works with complex prop values", () => {
		const errorWithAdditionalProps: any = new Error(
			"I have additional props 😄",
		);
		errorWithAdditionalProps.map = new Map();

		SuperJSON.allowErrorProps("map");

		console.log(SuperJSON.stringify(errorWithAdditionalProps));

		const errorAfterTransition: any = SuperJSON.parse(
			SuperJSON.stringify(errorWithAdditionalProps),
		);

		expect(errorAfterTransition.map).toBeInstanceOf(Map);
	});
});

test("regression #83: negative zero", () => {
	const input = -0;

	const stringified = SuperJSON.stringify(input);
	expect(stringified).toMatchInlineSnapshot(
		`"{\"json\":\"-0\",\"meta\":{\"values\":[\"number\"]}}"`,
	);

	const parsed: number = SuperJSON.parse(stringified);

	expect(1 / parsed).toBe(Number.NEGATIVE_INFINITY);
});

test("regression https://github.com/blitz-js/babel-plugin-superjson-next/issues/63: Nested BigInt", () => {
	const serialized = SuperJSON.serialize({
		topics: [
			{
				post_count: BigInt("22"),
			},
		],
	});

	expect(() => JSON.stringify(serialized)).not.toThrow();

	expect(typeof (serialized.json as any).topics[0].post_count).toBe("string");
	expect(serialized.json).toEqual({
		topics: [
			{
				post_count: "22",
			},
		],
	});

	SuperJSON.deserialize(serialized);
	expect(typeof (serialized.json as any).topics[0].post_count).toBe("string");
});

test("performance regression", () => {
	const data: any[] = [];
	for (let i = 0; i < 100; i++) {
		const nested1: any[] = [];
		const nested2: any[] = [];
		for (let j = 0; j < 10; j++) {
			nested1[j] = {
				createdAt: new Date(),
				innerNested: {
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				updatedAt: new Date(),
			};
			nested2[j] = {
				createdAt: new Date(),
				innerNested: {
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				updatedAt: new Date(),
			};
		}
		const object = {
			createdAt: new Date(),
			nested1,
			nested2,
			updatedAt: new Date(),
		};
		data.push(object);
	}

	const t1 = Date.now();
	SuperJSON.serialize(data);
	const t2 = Date.now();
	const duration = t2 - t1;
	expect(duration).toBeLessThan(700);
});

test("regression #95: no undefined", () => {
	const input: unknown[] = [];

	const out = SuperJSON.serialize(input);
	expect(out).not.toHaveProperty("meta");

	const parsed: number = SuperJSON.deserialize(out);

	expect(parsed).toEqual(input);
});

test("regression #108: Error#stack should not be included by default", () => {
	const input = new Error("Beep boop, you don't wanna see me. I'm an error!");
	expect(input).toHaveProperty("stack");

	const { stack: thatShouldBeUndefined } = SuperJSON.parse(
		SuperJSON.stringify(input),
	) as any;
	expect(thatShouldBeUndefined).toBeUndefined();

	SuperJSON.allowErrorProps("stack");
	const { stack: thatShouldExist } = SuperJSON.parse(
		SuperJSON.stringify(input),
	) as any;
	expect(thatShouldExist).toEqual(input.stack);
});

test("regression: `Object.create(null)` / object without prototype", () => {
	const input: Record<string, unknown> = Object.create(null);
	input.date = new Date();

	const stringified = SuperJSON.stringify(input);
	const parsed: any = SuperJSON.parse(stringified);

	expect(parsed.date).toBeInstanceOf(Date);
});

const prototypePollutionRisk = /This is a prototype pollution risk/;
test.each(["__proto__", "prototype", "constructor"])(
	"serialize prototype pollution: %s",
	(forbidden) => {
		expect(() => {
			SuperJSON.serialize({
				[forbidden]: 1,
			});
		}).toThrowError(prototypePollutionRisk);
	},
);

test("prototype pollution - __proto__", () => {
	expect(() => {
		SuperJSON.parse(
			JSON.stringify({
				json: {
					myValue: 1337,
				},
				meta: {
					referentialEqualities: {
						myValue: ["__proto__.x"],
					},
				},
			}),
		);
	}).toThrowErrorMatchingInlineSnapshot(
		"[Error: __proto__ is not allowed as a property]",
	);
	expect((Object.prototype as any).x).toBeUndefined();
});

test("prototype pollution - prototype", () => {
	expect(() => {
		SuperJSON.parse(
			JSON.stringify({
				json: {
					myValue: 1337,
				},
				meta: {
					referentialEqualities: {
						myValue: ["prototype.x"],
					},
				},
			}),
		);
	}).toThrowErrorMatchingInlineSnapshot(
		"[Error: prototype is not allowed as a property]",
	);
});

test("prototype pollution - constructor", () => {
	expect(() => {
		SuperJSON.parse(
			JSON.stringify({
				json: {
					myValue: 1337,
				},
				meta: {
					referentialEqualities: {
						myValue: ["constructor.prototype.x"],
					},
				},
			}),
		);
	}).toThrowErrorMatchingInlineSnapshot(
		"[Error: prototype is not allowed as a property]",
	);

	expect((Object.prototype as any).x).toBeUndefined();
});

test("superjson instances are independent of one another", () => {
	class Car {}
	const s1 = new SuperJSON();
	s1.registerClass(Car);

	const s2 = new SuperJSON();

	const value = {
		car: new Car(),
	};

	const res1 = s1.serialize(value);
	expect(res1.meta?.values).toEqual({ car: [["class", "Car"]] });
	const res2 = s2.serialize(value);
	expect(res2.json).toEqual(value);
});

test("regression #245: superjson referential equalities only use the top-most parent node", () => {
	type Node = {
		children: Node[];
	};
	const root: Node = {
		children: [],
	};
	const input = {
		a: root,
		b: root,
	};
	const res = SuperJSON.serialize(input);

	expect(res.meta?.referentialEqualities).toHaveProperty(["a"]);

	// saying that a.children is equal to b.children is redundant since its already know that a === b
	expect(res.meta?.referentialEqualities).not.toHaveProperty(["a.children"]);
	expect(res.meta).toMatchInlineSnapshot(`
    {
      "referentialEqualities": {
        "a": [
          "b",
        ],
      },
    }
  `);

	const parsed = SuperJSON.deserialize(res);
	expect(parsed).toEqual(input);
});

test("dedupe=true", () => {
	const instance = new SuperJSON({
		dedupe: true,
	});

	type Node = {
		children: Node[];
	};
	const root: Node = {
		children: [],
	};
	const input = {
		a: root,
		b: root,
	};
	const output = instance.serialize(input);

	const json = output.json as any;

	expect(json.a);

	// This has already been seen and should be deduped
	expect(json.b).toBeNull();

	expect(json).toMatchInlineSnapshot(`
    {
      "a": {
        "children": [],
      },
      "b": null,
    }
  `);

	expect(instance.deserialize(output)).toEqual(input);
});

test("dedupe=true on a large complicated schema", () => {
	const content = fs.readFileSync(`${__dirname}/non-deduped-cal.json`, "utf-8");
	const parsed = JSON.parse(content);

	const deserialized = SuperJSON.deserialize(parsed);

	const nondeduped = new SuperJSON({});

	const deduped = new SuperJSON({
		dedupe: true,
	});

	const nondedupedOut = nondeduped.deserialize(
		nondeduped.serialize(deserialized),
	);
	const dedupedOut = deduped.deserialize(deduped.serialize(deserialized));

	expect(nondedupedOut).toEqual(deserialized);
	expect(dedupedOut).toEqual(deserialized);
});
