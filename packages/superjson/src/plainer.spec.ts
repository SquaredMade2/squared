import SuperJSON from "./index.js";
import { walker } from "./plainer.js";

import { expect, test } from "vitest";

test("walker", () => {
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
