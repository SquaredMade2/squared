import { getType } from "./getType";
import type { PlainObject } from "./isPlainObject";

/**
 * Returns whether the payload is an any kind of object (including special classes or objects with
 * different prototypes)
 */
export function isAnyObject(payload: unknown): payload is PlainObject {
	return getType(payload) === "Object";
}
