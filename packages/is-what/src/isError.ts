import { getType } from "./getType";

/** Returns whether the payload is an Error */
export function isError(payload: unknown): payload is Error {
	return getType(payload) === "Error" || payload instanceof Error;
}
