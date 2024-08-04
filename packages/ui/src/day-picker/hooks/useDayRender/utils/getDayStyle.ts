import type { CSSProperties } from "react";

import type { DayPickerContextValue } from "../../../contexts/DayPicker";
import type { ActiveModifiers } from "../../../types/Modifiers";

/** Return the style for the Day element, according to the given active modifiers. */
export function getDayStyle(
	dayPicker: Pick<DayPickerContextValue, "modifiersStyles" | "styles">,
	activeModifiers: ActiveModifiers,
): CSSProperties {
	let style: CSSProperties = {
		...dayPicker.styles.day,
	};
	Object.keys(activeModifiers).forEach((modifier) => {
		style = {
			...style,
			...dayPicker.modifiersStyles?.[modifier],
		};
	});
	return style;
}
