import { escapeKey, parsePath } from "./pathstringifier";

describe("parsePath", () => {
	it.each([
		["test.a.b", ["test", "a", "b"]],
		["test\\.a.b", ["test.a", "b"]],
		["test\\\\.a.b", ["test\\.a", "b"]],
		["test\\a.b", ["test\\a", "b"]],
		["test\\\\a.b", ["test\\\\a", "b"]],
	])("parsePath(%p) === %p", (input, expectedOutput) => {
		expect(parsePath(input)).toEqual(expectedOutput);
	});
});

describe("escapeKey", () => {
	it.each([
		["dontescape", "dontescape"],
		["escape.me", "escape\\.me"],
	])("escapeKey(%s) === %s", (input, expectedOutput) => {
		expect(escapeKey(input)).toEqual(expectedOutput);
	});
});
