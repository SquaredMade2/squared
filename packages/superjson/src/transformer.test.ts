import SuperJSON from "./index";

it("throws a descriptive error when transforming", () => {
	const instance = new SuperJSON();
	class FunnyNumber {
		constructor(private number: number) {}

		// @ts-ignore
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
