import { expect, test } from "vitest";
import SuperJSON from "./index.js";

test("throws an descriptive error when transforming", () => {
	const instance = new SuperJSON();
	class FunnyNumber {
		private number: number;
		constructor(number: number) {
			this.number = number;
		}

		get theNumber() {
			return this.number;
		}
	}
	instance.registerClass(FunnyNumber);
	expect(() =>
		instance.deserialize({
			json: instance.serialize({
				number: new FunnyNumber(2137),
			}).json,
			meta: {
				values: [["class", "NotRegistered"]],
			},
		}),
	).toThrowError(
		`Trying to deserialize unknown class 'NotRegistered' - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564`,
	);
});
