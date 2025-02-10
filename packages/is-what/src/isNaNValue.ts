import { getType } from "./getType";

/** Returns whether the payload is literally the value `NaN` (it's `NaN` and also a `number`) */
export function isNaNValue(payload: unknown): payload is typeof NaN {
	return (
		getType(payload) === "Number" && Number.isNaN(payload as unknown as number)
	);
}
