import { getType } from "./getType";

/** Returns whether the payload is an array */
export function isArray(payload: unknown): payload is unknown[] {
	return getType(payload) === "Array";
}
