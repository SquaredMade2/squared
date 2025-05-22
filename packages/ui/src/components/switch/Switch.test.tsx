import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Switch } from ".";

describe("given a default Switch", () => {
	afterEach(cleanup);

	let cleanedUp = false;

	function Test() {
		return (
			<Switch
				ref={() => {
					cleanedUp = true;
				}}
			/>
		);
	}

	it("should correctly invoke the cleanup function of a ref callback", () => {
		const rendered = render(<Test />);
		rendered.unmount();
		expect(cleanedUp).toBe(true);
	});
});
