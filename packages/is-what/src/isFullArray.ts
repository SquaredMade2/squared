import { isArray } from "./isArray";

/** Returns whether the payload is a an array with at least 1 item */
export function isFullArray(payload: unknown): payload is unknown[] {
	return isArray(payload) && payload.length > 0;
}
