import { isSameMonth } from "date-fns";

import type { ActiveModifiers, Modifiers } from "../../../types/Modifiers";

import { isMatch } from "./isMatch";

/** Return the active modifiers for the given day. */
export function getActiveModifiers(
	day: Date,
	/** The modifiers to match for the given date. */
	modifiers: Modifiers,
	/** The month where the day is displayed, to add the "outside" modifiers.  */
	displayMonth?: Date,
): ActiveModifiers {
	const matchedModifiers = Object.keys(modifiers).reduce(
		(result: string[], key: string): string[] => {
			const modifier = modifiers[key];
			if (isMatch(day, modifier)) {
				result.push(key);
			}
			return result;
		},
		[],
	);
	const activeModifiers: ActiveModifiers = {};
	for (const modifier of matchedModifiers) {
		activeModifiers[modifier] = true;
	}

	if (displayMonth && !isSameMonth(day, displayMonth)) {
		activeModifiers.outside = true;
	}

	return activeModifiers;
}
