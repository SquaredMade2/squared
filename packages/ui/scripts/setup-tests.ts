import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import * as axeMatchers from "vitest-axe/matchers";

expect.extend(axeMatchers);

global.ResizeObserver = class ResizeObserver {
	// biome-ignore lint/suspicious/noExplicitAny: This is a mock implementation of the ResizeObserver API for testing purposes.
	cb: any;
	// biome-ignore lint/suspicious/noExplicitAny: This is a mock implementation of the ResizeObserver API for testing purposes.
	constructor(cb: any) {
		this.cb = cb;
	}
	observe() {
		this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
	}
	unobserve() {}
	disconnect() {}
};
