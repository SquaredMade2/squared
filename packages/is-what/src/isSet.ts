import { getType } from "./getType";

/** Returns whether the payload is a Set */
export function isSet(payload: unknown): payload is Set<unknown> {
	return getType(payload) === "Set";
}
