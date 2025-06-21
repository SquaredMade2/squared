import { expect, test } from "vitest";
import {
	isArray,
	isBoolean,
	isDate,
	isNull,
	isNumber,
	isPlainObject,
	isPrimitive,
	isRegExp,
	isString,
	isSymbol,
	isTypedArray,
	isUndefined,
	isURL,
} from "./is.js";

test("Basic true tests", () => {
	expect(isUndefined(undefined)).toBe(true);
	expect(isNull(null)).toBe(true);

	expect(isArray([])).toBe(true);
	expect(isArray([])).toBe(true);
	expect(isString("")).toBe(true);
	expect(isString("_")).toBe(true);

	expect(isBoolean(true)).toBe(true);
	expect(isBoolean(false)).toBe(true);
	// biome-ignore lint/performance/useTopLevelRegex: This is a test
	expect(isRegExp(/./)).toBe(true);
	expect(isRegExp(/./gi)).toBe(true);
	expect(isNumber(0)).toBe(true);
	expect(isNumber(1)).toBe(true);
	expect(isDate(new Date())).toBe(true);
	expect(isSymbol(Symbol())).toBe(true);
	expect(isTypedArray(new Uint8Array())).toBe(true);
	expect(isURL(new URL("https://example.com"))).toBe(true);
	expect(isPlainObject({})).toBe(true);

	expect(isPlainObject(new Object())).toBe(true);
});

test("Basic false tests", () => {
	expect(isNumber(Number.NaN)).toBe(false);
	expect(isDate(new Date("_"))).toBe(false);
	expect(isDate(Number.NaN)).toBe(false);
	expect(isUndefined(Number.NaN)).toBe(false);
	expect(isNull(Number.NaN)).toBe(false);

	expect(isArray(Number.NaN)).toBe(false);
	expect(isString(Number.NaN)).toBe(false);

	expect(isBoolean(Number.NaN)).toBe(false);
	expect(isRegExp(Number.NaN)).toBe(false);
	expect(isSymbol(Number.NaN)).toBe(false);

	expect(isTypedArray([])).toBe(false);

	expect(isURL("https://example.com")).toBe(false);

	expect(isPlainObject(null)).toBe(false);
	expect(isPlainObject([])).toBe(false);
	expect(isPlainObject(Object.prototype)).toBe(false);
	expect(isPlainObject(Object.create(Array.prototype))).toBe(false);
});

test("Primitive tests", () => {
	expect(isPrimitive(0)).toBe(true);
	expect(isPrimitive("")).toBe(true);
	expect(isPrimitive("str")).toBe(true);
	expect(isPrimitive(Symbol("symbol"))).toBe(true);
	expect(isPrimitive(true)).toBe(true);
	expect(isPrimitive(false)).toBe(true);
	expect(isPrimitive(null)).toBe(true);
	expect(isPrimitive(undefined)).toBe(true);

	expect(isPrimitive(Number.NaN)).toBe(false);
	expect(isPrimitive([])).toBe(false);
	expect(isPrimitive([])).toBe(false);
	expect(isPrimitive({})).toBe(false);

	expect(isPrimitive(new Object())).toBe(false);
	expect(isPrimitive(new Date())).toBe(false);
	expect(isPrimitive(() => null)).toBe(false);
});

test("Date exception", () => {
	expect(isDate(new Date("_"))).toBe(false);
});

test("Regression: null-prototype object", () => {
	expect(isPlainObject(Object.create(null))).toBe(true);
	expect(isPrimitive(Object.create(null))).toBe(false);
});
