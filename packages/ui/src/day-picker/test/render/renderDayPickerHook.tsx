import { render } from "@testing-library/react";
import type { DayPickerProps } from "../../DayPicker";

import { FocusContext, type FocusContextValue } from "../../contexts/Focus";
import { RootProvider } from "../../contexts/RootProvider";
import {
	SelectMultipleContext,
	type SelectMultipleContextValue,
} from "../../contexts/SelectMultiple";
import {
	SelectRangeContext,
	type SelectRangeContextValue,
} from "../../contexts/SelectRange";
import {
	SelectSingleContext,
	type SelectSingleContextValue,
} from "../../contexts/SelectSingle";

/** Render a DayPicker hook inside the {@link RootProvider}. */
export type RenderHookResult<TResult> = {
	current: TResult;
};
export function renderDayPickerHook<TResult>(
	hook: () => TResult,
	dayPickerProps?: DayPickerProps,
	/** Pass the mocked contexts. */
	contexts?: {
		single: SelectSingleContextValue;
		multiple: SelectMultipleContextValue;
		range: SelectRangeContextValue;
		focus: FocusContextValue;
	},
): RenderHookResult<TResult> {
	const returnVal = { current: undefined as TResult };
	function Test(): JSX.Element {
		const hookResult: TResult = hook();
		returnVal.current = hookResult;
		return <></>;
	}
	render(
		<RootProvider {...dayPickerProps}>
			{contexts ? (
				<SelectSingleContext.Provider value={contexts.single}>
					<SelectMultipleContext.Provider value={contexts.multiple}>
						<SelectRangeContext.Provider value={contexts.range}>
							<FocusContext.Provider value={contexts.focus}>
								<Test />
							</FocusContext.Provider>
						</SelectRangeContext.Provider>
					</SelectMultipleContext.Provider>
				</SelectSingleContext.Provider>
			) : (
				<Test />
			)}
		</RootProvider>,
	);
	return returnVal;
}
