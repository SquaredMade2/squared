import { isAnyObject } from "./isAnyObject";
import type { PlainObject } from "./isPlainObject";

/**
 * Returns whether the payload is an object like a type passed in < >
 *
 * Usage: isObjectLike<{id: any}>(payload) // will make sure it's an object and has an `id` prop.
 *
 * @template T This must be passed in < >
 */
export function isObjectLike<T extends PlainObject>(
	payload: unknown,
): payload is T {
	return isAnyObject(payload);
}
