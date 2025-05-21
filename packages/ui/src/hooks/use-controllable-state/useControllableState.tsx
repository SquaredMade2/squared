import { useLayoutEffect } from "@squaredmade/ui/use-layout-effect";
import * as React from "react";

// Prevent bundlers from trying to optimize the import
const useInsertionEffect: typeof useLayoutEffect =
	// biome-ignore lint/suspicious/noExplicitAny: This is a workaround to avoid the error
	(React as any)[" useInsertionEffect ".trim().toString()] || useLayoutEffect;

/** Function that handles state changes */
type ChangeHandler<T> = (state: T) => void;
/** React's setState dispatch function type */
type SetStateFn<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * Parameters for the useControllableState hook
 */
interface UseControllableStateParams<T> {
	/**
	 * The controlled value. If provided, component is in controlled mode.
	 * If undefined, component is in uncontrolled mode.
	 */
	prop?: T | undefined;
	/** The default value to use in uncontrolled mode */
	defaultProp: T;
	/** Callback fired when the value changes */
	onChange?: ChangeHandler<T>;
	/** Name of the component using this hook (for warning messages) */
	caller?: string;
}

/**
 * Hook for managing state that can be either controlled or uncontrolled
 *
 * Allows components to support both controlled and uncontrolled modes.
 * In controlled mode, the value is provided by the parent component.
 * In uncontrolled mode, the value is managed internally.
 */
export function useControllableState<T>({
	prop,
	defaultProp,
	onChange = () => {},
	caller,
}: UseControllableStateParams<T>): [T, SetStateFn<T>] {
	const [uncontrolledProp, setUncontrolledProp, onChangeRef] =
		useUncontrolledState({
			defaultProp,
			onChange,
		});
	const isControlled = prop !== undefined;
	const value = isControlled ? prop : uncontrolledProp;

	// OK to disable conditionally calling hooks here because they will always run
	// consistently in the same environment. Bundlers should be able to remove the
	// code block entirely in production.
	/* eslint-disable react-hooks/rules-of-hooks */
	if (process.env.NODE_ENV !== "production") {
		const isControlledRef = React.useRef(prop !== undefined);
		React.useEffect(() => {
			const wasControlled = isControlledRef.current;
			if (wasControlled !== isControlled) {
				const from = wasControlled ? "controlled" : "uncontrolled";
				const to = isControlled ? "controlled" : "uncontrolled";
				console.warn(
					`${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
				);
			}
			isControlledRef.current = isControlled;
		}, [isControlled, caller]);
	}
	/* eslint-enable react-hooks/rules-of-hooks */

	const setValue = React.useCallback<SetStateFn<T>>(
		(nextValue) => {
			if (isControlled) {
				const value = isFunction(nextValue) ? nextValue(prop) : nextValue;
				if (value !== prop) {
					onChangeRef.current?.(value);
				}
			} else {
				setUncontrolledProp(nextValue);
			}
		},
		[isControlled, prop, setUncontrolledProp, onChangeRef],
	);

	return [value, setValue];
}

/**
 * Internal hook for managing uncontrolled state
 */
function useUncontrolledState<T>({
	/** The default value for the state */
	defaultProp,
	/** Callback fired when the value changes */
	onChange,
}: Omit<UseControllableStateParams<T>, "prop">): [
	Value: T,
	setValue: React.Dispatch<React.SetStateAction<T>>,
	OnChangeRef: React.RefObject<ChangeHandler<T> | undefined>,
] {
	const [value, setValue] = React.useState(defaultProp);
	const prevValueRef = React.useRef(value);

	const onChangeRef = React.useRef(onChange);
	useInsertionEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	React.useEffect(() => {
		if (prevValueRef.current !== value) {
			onChangeRef.current?.(value);
			prevValueRef.current = value;
		}
	}, [value, prevValueRef]);

	return [value, setValue, onChangeRef];
}

/**
 * Checks if a value is a function
 */
// biome-ignore lint/suspicious/noExplicitAny: A function can be any type
function isFunction(value: unknown): value is (...args: any[]) => any {
	return typeof value === "function";
}
