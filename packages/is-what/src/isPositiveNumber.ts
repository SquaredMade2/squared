import { isNumber } from "./isNumber";

/** Returns whether the payload is a positive number (but not 0) */
export function isPositiveNumber(payload: unknown): payload is number {
	return isNumber(payload) && payload > 0;
}
