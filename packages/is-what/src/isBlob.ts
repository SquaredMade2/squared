import { getType } from "./getType";

/** Returns whether the payload is a Blob */
export function isBlob(payload: unknown): payload is Blob {
	return getType(payload) === "Blob";
}
