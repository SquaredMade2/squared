import { getType } from "./getType";

/** Returns whether the payload is a Symbol */
export function isSymbol(payload: unknown): payload is symbol {
	return getType(payload) === "Symbol";
}
