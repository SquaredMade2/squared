import SuperJSON from "./index";
import { walker } from "./plainer";

it("walker", () => {
	expect(
		walker(
			{
				a: new Map([[Number.NaN, null]]),
				b: /test/g,
			},
			new Map(),
			new SuperJSON(),
			false,
		),
	).toEqual({
		transformedValue: {
			a: [["NaN", null]],
			b: "/test/g",
		},
		annotations: {
			a: [
				"map",
				{
					"0.0": ["number"],
				},
			],
			b: ["regexp"],
		},
	});
});
