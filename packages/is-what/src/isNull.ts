import { getType } from "./getType";

/** Returns whether the payload is null */
export function isNull(payload: unknown): payload is null {
	return getType(payload) === "Null";
}
