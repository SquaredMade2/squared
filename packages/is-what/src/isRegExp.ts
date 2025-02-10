import { getType } from "./getType";

/** Returns whether the payload is a regular expression (RegExp) */
export function isRegExp(payload: unknown): payload is RegExp {
	return getType(payload) === "RegExp";
}
