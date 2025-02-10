import { getType } from "./getType";

/** Returns whether the payload is a string */
export function isString(payload: unknown): payload is string {
	return getType(payload) === "String";
}
