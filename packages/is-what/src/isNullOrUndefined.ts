import { isNull } from "./isNull";
import {
	/* tree-shaking no-side-effects-when-called */ isOneOf,
} from "./isOneOf";
import { isUndefined } from "./isUndefined";

/** Returns true whether the payload is null or undefined */
export const isNullOrUndefined = isOneOf(isNull, isUndefined);
