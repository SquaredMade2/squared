import { getType } from "./getType";

/** Returns whether the payload is a Promise */
export function isPromise(payload: unknown): payload is Promise<unknown> {
	return getType(payload) === "Promise";
}
