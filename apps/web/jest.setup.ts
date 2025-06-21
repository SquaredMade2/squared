import "@testing-library/jest-dom";
import { expect, jest } from "@jest/globals";

Object.defineProperty(window, "sessionStorage", {
	value: {
		clear: jest.fn<() => void>(),
		getItem: jest.fn<(key: string) => string | null>(),
		removeItem: jest.fn<(key: string) => void>(),
		setItem: jest.fn<(key: string, value: string) => void>(),
	},
	writable: true,
});

const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

expect.extend({
	toEqualWithDatePrecision(
		// biome-ignore lint/suspicious/noExplicitAny: Could be anything
		received: any,
		// biome-ignore lint/suspicious/noExplicitAny: Could be anything
		expected: any,
		precision = 0,
	) {
		const pass = this.equals(
			JSON.parse(JSON.stringify(received), (_, value) =>
				typeof value === "string" && dateRegex.test(value)
					? value.slice(0, 19 + precision)
					: value,
			),
			JSON.parse(JSON.stringify(expected), (_, value) =>
				typeof value === "string" && dateRegex.test(value)
					? value.slice(0, 19 + precision)
					: value,
			),
		);

		return {
			message: () =>
				`expected ${this.utils.printReceived(received)} to equal ${this.utils.printExpected(expected)} with date precision of ${precision} decimal places`,
			pass,
		};
	},
});
