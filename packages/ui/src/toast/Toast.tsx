import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useEscapeKeydown } from "@radix-ui/react-use-escape-keydown";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { usePrevious } from "@radix-ui/react-use-previous";
import { Button } from "@squaredmade/ui/button";
import { cn } from "@squaredmade/ui/cn";
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle,
	X as CloseIcon,
	Info,
	Loader2,
} from "lucide-react";
import React from "react";
import ReactDOM from "react-dom";
import { useIsDocumentHidden } from "./hooks";
import { ToastState } from "./state";

/* -------------------------------------------------------------------------------------------------
 * Types and Interfaces
 * -----------------------------------------------------------------------------------------------*/

/**
 * Defines the available appearance types for toast notifications.
 */
export type ToastTypes =
	| "normal"
	| "action"
	| "success"
	| "info"
	| "warning"
	| "error"
	| "loading"
	| "default";

/**
 * Represents either a Promise or a function that returns a Promise.
 * Used for the promise property in toast notifications to track async operations.
 */
export type PromiseT<Data = unknown> = Promise<Data> | (() => Promise<Data>);

/**
 * Collection of custom icons that can be provided to override the default toast icons.
 */
interface ToastIcons {
	/** Custom icon to display for success toast notifications */
	success?: React.ReactNode;
	/** Custom icon to display for informational toast notifications */
	info?: React.ReactNode;
	/** Custom icon to display for warning toast notifications */
	warning?: React.ReactNode;
	/** Custom icon to display for error toast notifications */
	error?: React.ReactNode;
	/** Custom icon to display for loading toast notifications */
	loading?: React.ReactNode;
	/** Custom icon to display for the toast close button */
	close?: React.ReactNode;
}

/**
 * Represents an action button that can be added to a toast notification.
 */
interface Action {
	/** The content to display on the action button */
	label: React.ReactNode;
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

/**
 * Configuration object for an individual toast notification.
 */
interface ToastT {
	/** Unique identifier for the toast */
	id: number | string;
	/** Primary content of the toast, can be a React node or a function returning a React node */
	title?: (() => React.ReactNode) | React.ReactNode;
	/** Visual appearance type for the toast */
	type?: ToastTypes;
	/** Custom icon to display, overrides the default icon for the selected type */
	icon?: React.ReactNode;
	/** Whether to show a close button on this toast */
	closeButton?: boolean;
	/** Whether this toast can be dismissed by user actions like swiping or clicking close */
	dismissible?: boolean;
	/** Secondary content displayed below the title, can be a React node or a function returning a React node */
	description?: (() => React.ReactNode) | React.ReactNode;
	/** Time in milliseconds before the toast auto-dismisses (0 or Infinity to prevent auto-dismiss) */
	duration?: number;
	/** When true, marks the toast for deletion */
	delete?: boolean;
	/** Primary action button or custom component shown on the toast */
	action?: Action | React.ReactNode;
	/** Secondary/cancel action button or custom component shown on the toast */
	cancel?: Action | React.ReactNode;
	/** Callback fired when the toast is dismissed by user action */
	onDismiss?: (toast: ToastT) => void;
	/** Callback fired when the toast is automatically closed after its duration expires */
	onAutoClose?: (toast: ToastT) => void;
	/** Promise to track for loading/success/error states - used for promise-based toast creation */
	promise?: PromiseT;
}

/**
 * Tracks the height of a toast for animation and positioning calculations.
 */
interface HeightT {
	/** Height of the toast element in pixels */
	height: number;
	/** ID of the toast this height measurement belongs to */
	toastId: number | string;
}

/**
 * Global configuration options that can be applied to all toasts.
 */
interface ToastOptions {
	/** Whether to show close buttons on all toasts */
	closeButton?: boolean;
	/** Default duration in milliseconds before toasts auto-dismiss */
	duration?: number;
	/** Accessibility label for close buttons */
	closeButtonAriaLabel?: string;
}

/**
 * Defines positioning offsets for the toast container.
 * Can be a simple value applied to all sides, or an object with specific values per side.
 */
type Offset =
	| {
			/** Distance from the top edge of the viewport */
			top?: string | number;
			/** Distance from the right edge of the viewport */
			right?: string | number;
			/** Distance from the bottom edge of the viewport */
			bottom?: string | number;
			/** Distance from the left edge of the viewport */
			left?: string | number;
	  }
	| string
	| number;

/**
 * Props for the Toaster component that manages and displays toasts.
 */
interface ToasterProps {
	/** Array of keys used as a keyboard shortcut to focus the toast list */
	hotkey?: (keyof KeyboardEvent | "KeyT")[];
	/** When true, toasts remain expanded by default instead of collapsing */
	expand?: boolean;
	/** Default duration in milliseconds that toasts remain visible */
	duration?: number;
	/** Spacing between toasts in pixels */
	gap?: number;
	/** Maximum number of toasts visible at once */
	visibleToasts?: number;
	/** Whether to show a close button on toasts by default */
	closeButton?: boolean;
	/** Options applied to all toasts */
	toastOptions?: ToastOptions;
	/** Positioning offset from viewport edges */
	offset?: Offset;
	/** Positioning offset for mobile viewport */
	mobileOffset?: Offset;
	/** Custom icon components to override defaults */
	icons?: ToastIcons;
	/** Accessibility label for the toast container */
	containerAriaLabel?: string;
}

/**
 * Props for the internal Toast component that renders individual notifications.
 * These props are typically provided by the parent Toaster component.
 */
interface ToastProps {
	/** The toast configuration object */
	toast: ToastT;
	/** Array of all active toasts */
	toasts: ToastT[];
	/** Position of this toast in the stack (0 is front/top) */
	index: number;
	/** Whether the toast stack is currently expanded */
	expanded: boolean;
	/** Array of height measurements for all toasts */
	heights: HeightT[];
	/** Function to update height measurements */
	setHeights: React.Dispatch<React.SetStateAction<HeightT[]>>;
	/** Function to remove a toast from the stack */
	removeToast: (toast: ToastT) => void;
	/** Spacing between toasts in pixels */
	gap?: number;
	/** Maximum number of toasts visible at once */
	visibleToasts: number;
	/** Whether toasts should be expanded by default */
	expandByDefault: boolean;
	/** Whether to show a close button on this toast */
	closeButton: boolean;
	/** Whether user is currently interacting with a toast */
	interacting: boolean;
	/** Time in milliseconds before auto-dismissing */
	duration?: number;
	/** Custom loading icon */
	loadingIcon?: React.ReactNode;
	/** Custom icons for different toast types */
	icons?: ToastIcons;
	/** Accessibility label for the close button */
	closeButtonAriaLabel?: string;
}

/**
 * Instructions to dismiss a specific toast by ID.
 * Used internally by the toast state management system.
 */
interface ToastToDismiss {
	/** ID of the toast to dismiss */
	id: number | string;
	/** Flag indicating the toast should be dismissed */
	dismiss: boolean;
}

interface CustomCSSProperties extends React.CSSProperties {
	[key: `--offset-${string}`]: string;
	[key: `--mobile-offset-${string}`]: string;
}

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/

// Visible toasts amount
const VISIBLE_TOASTS_AMOUNT = 3;

// Viewport padding
const VIEWPORT_OFFSET = "24px";

// Mobile viewport padding
const MOBILE_VIEWPORT_OFFSET = "16px";

// Default lifetime of a toasts (in ms)
const TOAST_LIFETIME = 4000;

// Default toast width
const TOAST_WIDTH = 356;

// Default gap between toasts
const GAP = 14;

// Threshold to dismiss a toast
const SWIPE_THRESHOLD = 45;

// Equal to exit animation duration
const TIME_BEFORE_UNMOUNT = 400;

/* -------------------------------------------------------------------------------------------------
 * Helper Functions
 * -----------------------------------------------------------------------------------------------*/

/**
 * Gets the appropriate icon asset based on toast type
 */
const getAsset = (type: ToastTypes) => {
	switch (type) {
		case "success":
			return <CheckCircle color="primary" />;

		case "info":
			return <Info />;

		case "warning":
			return <AlertTriangle />;

		case "error":
			return <AlertCircle color="accent" />;

		default:
			return null;
	}
};

/**
 * Helper function to check if an action object has the expected structure
 */
function isAction(action: Action | React.ReactNode): action is Action {
	return (action as Action).label !== undefined;
}

/**
 * Assigns offset values to CSS custom properties for positioning
 */
function assignOffset(
	defaultOffset: ToasterProps["offset"] | undefined,
	mobileOffset: ToasterProps["mobileOffset"] | undefined,
) {
	const styles = {} as CustomCSSProperties;

	[defaultOffset, mobileOffset].forEach((offset, index) => {
		const isMobile = index === 1;
		const prefix = isMobile ? "--mobile-offset" : "--offset";
		const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;

		function assignAll(offset: string | number) {
			for (const key of ["top", "right", "bottom", "left"]) {
				styles[`${prefix}-${key}`] =
					typeof offset === "number" ? `${offset}px` : offset;
			}
		}

		if (typeof offset === "number" || typeof offset === "string") {
			assignAll(offset);
		} else if (typeof offset === "object") {
			for (const key of ["top", "right", "bottom", "left"] as const) {
				// Use a type assertion to let TypeScript know we're using valid keys
				const offsetKey = key as keyof typeof offset;

				if (offset[offsetKey] === undefined) {
					styles[`${prefix}-${key}`] = defaultValue;
				} else {
					const value = offset[offsetKey];
					styles[`${prefix}-${key}`] =
						typeof value === "number" ? `${value}px` : (value as string);
				}
			}
		} else {
			assignAll(defaultValue);
		}
	});

	return styles;
}

/* -------------------------------------------------------------------------------------------------
 * useToasts Hook
 * -----------------------------------------------------------------------------------------------*/

/**
 * Hook for consuming toasts within components
 *
 * This hook provides access to active toasts from the global toast state.
 * Use this hook to retrieve the current list of active toasts within any component.
 */
function useToasts() {
	const [activeToasts, setActiveToasts] = React.useState<ToastT[]>([]);

	React.useEffect(() => {
		return ToastState.subscribe((toast) => {
			if ((toast as ToastToDismiss).dismiss) {
				setTimeout(() => {
					ReactDOM.flushSync(() => {
						setActiveToasts((toasts) =>
							toasts.filter((t) => t.id !== toast.id),
						);
					});
				});
				return;
			}

			// Prevent batching, temp solution.
			setTimeout(() => {
				ReactDOM.flushSync(() => {
					setActiveToasts((toasts) => {
						if (!toast.id) return toasts;
						const toastWithId = toast as ToastT;

						const indexOfExistingToast = toasts.findIndex(
							(t) => t.id === toastWithId.id,
						);

						// Update the toast if it already exists
						if (indexOfExistingToast !== -1) {
							return [
								...toasts.slice(0, indexOfExistingToast),
								{ ...toasts[indexOfExistingToast], ...toast },
								...toasts.slice(indexOfExistingToast + 1),
							];
						}

						return [toastWithId, ...toasts];
					});
				});
			});
		});
	}, []);

	return {
		toasts: activeToasts,
	};
}

/* -------------------------------------------------------------------------------------------------
 * Toast Component
 * -----------------------------------------------------------------------------------------------*/

/**
 * Toast component for displaying individual notification messages
 *
 * The Toast component renders a single notification with optional title, description, icon, and actions.
 * It handles interactions including swiping to dismiss, animation states, and lifecycle management.
 *
 * Key features:
 * - Interactive swipe-to-dismiss functionality
 * - Support for various notification types (success, error, etc.)
 * - Auto-dismiss with configurable duration
 * - Customizable content with title, description and actions
 * - Animated entrance and exit transitions
 *
 * This component is typically used internally by the Toaster component.
 */
const Toast = ({
	toast,
	interacting,
	setHeights,
	visibleToasts,
	heights,
	index,
	toasts,
	expanded,
	removeToast,
	closeButton: closeButtonFromToaster,
	duration: durationFromToaster,
	gap,
	expandByDefault,
	icons,
	closeButtonAriaLabel = "Close toast",
}: ToastProps) => {
	const [swipeDirection, setSwipeDirection] = React.useState<"x" | "y" | null>(
		null,
	);
	const [swipeOutDirection, setSwipeOutDirection] = React.useState<
		"left" | "right" | "up" | "down" | null
	>(null);
	const [mounted, setMounted] = React.useState(false);
	const [removed, setRemoved] = React.useState(false);
	const [swiping, setSwiping] = React.useState(false);
	const [swipeOut, setSwipeOut] = React.useState(false);
	const [isSwiped, setIsSwiped] = React.useState(false);
	const [offsetBeforeRemove, setOffsetBeforeRemove] = React.useState(0);
	const [initialHeight, setInitialHeight] = React.useState(0);
	const remainingTime = React.useRef(
		toast.duration || durationFromToaster || TOAST_LIFETIME,
	);
	const dragStartTime = React.useRef<Date | null>(null);
	const toastRef = React.useRef<HTMLLIElement>(null);
	const isFront = index === 0;
	const isVisible = index + 1 <= visibleToasts;
	const toastType = toast.type;
	const dismissible = toast.dismissible !== false;
	// Height index is used to calculate the offset as it gets updated before the toast array, which means we can calculate the new layout faster.
	const heightIndex = React.useMemo(
		() => heights.findIndex((height) => height.toastId === toast.id) || 0,
		[heights, toast.id],
	);
	const closeButton = React.useMemo(
		() => toast.closeButton ?? closeButtonFromToaster,
		[toast.closeButton, closeButtonFromToaster],
	);
	const duration = React.useMemo(
		() => toast.duration || durationFromToaster || TOAST_LIFETIME,
		[toast.duration, durationFromToaster],
	);
	const [closeTimerStartTime, setCloseTimerStartTime] = React.useState(0);
	const previousCloseTimerStartTime = usePrevious(closeTimerStartTime);
	const closeTimerStartTimeRef = React.useRef(0);
	const offset = React.useRef(0);
	const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null);
	const toastsHeightBefore = React.useMemo(() => {
		return heights.reduce((prev, curr, reducerIndex) => {
			// Calculate offset up until current toast
			if (reducerIndex >= heightIndex) {
				return prev;
			}

			return prev + curr.height;
		}, 0);
	}, [heights, heightIndex]);
	const isDocumentHidden = useIsDocumentHidden();

	const disabled = toastType === "loading";

	offset.current = React.useMemo(
		() => heightIndex * (gap ?? 1) + toastsHeightBefore,
		[heightIndex, toastsHeightBefore],
	);

	React.useEffect(() => {
		remainingTime.current = duration;
	}, [duration]);

	React.useEffect(() => {
		// Trigger enter animation without using CSS animation
		setMounted(true);
	}, []);

	useLayoutEffect(() => {
		const toastNode = toastRef.current;
		if (toastNode) {
			const height = toastNode.getBoundingClientRect().height;
			// Add toast height to heights array after the toast is mounted
			setInitialHeight(height);
			setHeights((h) => [{ toastId: toast.id, height }, ...h]);
			return () =>
				setHeights((h) => h.filter((height) => height.toastId !== toast.id));
		}
	}, [setHeights, toast.id]);

	useLayoutEffect(() => {
		if (!mounted) return;
		// biome-ignore lint/style/noNonNullAssertion: We check mounted state above
		const toastNode = toastRef.current!;
		const originalHeight = toastNode.style.height;
		toastNode.style.height = "auto";
		const newHeight = toastNode.getBoundingClientRect().height;
		toastNode.style.height = originalHeight;

		setInitialHeight(newHeight);

		setHeights((heights) => {
			const alreadyExists = heights.find(
				(height) => height.toastId === toast.id,
			);
			if (!alreadyExists) {
				return [
					{
						toastId: toast.id,
						height: newHeight,
					},
					...heights,
				];
			}
			return heights.map((height) =>
				height.toastId === toast.id ? { ...height, height: newHeight } : height,
			);
		});
	}, [mounted, toast.title, toast.description, setHeights, toast.id]);

	const deleteToast = useCallbackRef(() => {
		// Save the offset for the exit swipe animation
		setRemoved(true);
		setOffsetBeforeRemove(offset.current);
		setHeights((h) => h.filter((height) => height.toastId !== toast.id));

		setTimeout(() => {
			removeToast(toast);
		}, TIME_BEFORE_UNMOUNT);
	});

	React.useEffect(() => {
		if (
			(toast.promise && toastType === "loading") ||
			toast.duration === Number.POSITIVE_INFINITY ||
			toast.type === "loading"
		)
			return;
		let timeoutId: NodeJS.Timeout;

		// Pause the timer on each hover
		const pauseTimer = () => {
			if (previousCloseTimerStartTime < closeTimerStartTime) {
				// Get the elapsed time since the timer started
				const elapsedTime = Date.now() - closeTimerStartTime;

				remainingTime.current = remainingTime.current - elapsedTime;
			}

			setCloseTimerStartTime(Date.now());
		};

		const startTimer = () => {
			// setTimeout(, Infinity) behaves as if the delay is 0.
			// As a result, the toast would be closed immediately, giving the appearance that it was never rendered.
			// See: https://github.com/denysdovhan/wtfjs?tab=readme-ov-file#an-infinite-timeout
			if (remainingTime.current === Number.POSITIVE_INFINITY) return;

			closeTimerStartTimeRef.current = Date.now();

			// Let the toast know it has started
			timeoutId = setTimeout(() => {
				toast.onAutoClose?.(toast);
				deleteToast();
			}, remainingTime.current);
		};

		if (expanded || interacting || isDocumentHidden) {
			pauseTimer();
		} else {
			startTimer();
		}

		return () => clearTimeout(timeoutId);
	}, [expanded, interacting, toast, toastType, isDocumentHidden, deleteToast]);

	React.useEffect(() => {
		if (toast.delete) {
			deleteToast();
		}
	}, [deleteToast, toast.delete]);

	let icon = null;
	if (toastType) {
		if (toast.icon) {
			icon = toast.icon;
		}
		if (icons && toastType in icons) {
			icon = icons[toastType as keyof ToastIcons];
		}
		if (toastType) {
			icon = getAsset(toastType);
		}
	}

	const hasIcon = toast.icon || toastType || toast.promise;
	const getY = () => {
		if (removed && !isFront && !swipeOut && !expanded) return "translateY(40%)";
		if (removed && !isFront && !swipeOut && expanded)
			return "translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%))";
		if (removed && isFront && !swipeOut)
			return "translateY(calc(var(--lift) * -100%))";
		if (mounted && expanded)
			return "translateY(calc(var(--lift) * var(--offset)))";
		if (!(expanded || isFront))
			return "translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)))";
		if (mounted) return "translateY(0)";
		return "translateY(100%)";
	};

	return (
		<li
			// biome-ignore lint/a11y/noNoninteractiveTabindex: This element is interactive
			tabIndex={0}
			ref={toastRef}
			className={cn(
				// Base toast styles
				"break-anywhere absolute right-0 bottom-0 z-[999999] box-border flex w-[var(--width)] translate-y-full transform touch-none items-center gap-1.5 rounded-md border border-border bg-card p-4 text-foreground text-sm opacity-0 shadow-[0px_4px_12px_rgba(0,0,0,0.1)] outline-none transition-[transform_400ms,opacity_400ms,height_400ms,box-shadow_200ms]",

				// Focus styles
				"focus-visible:shadow-[0px_4px_12px_rgba(0,0,0,0.1),0_0_0_2px_rgba(0,0,0,0.2)]",
				disabled && "cursor-not-allowed",

				// Swiping state
				swiping &&
					"before:-translate-y-1/2 before:absolute before:top-1/2 before:right-[-100%] before:left-[-100%] before:z-[-1] before:h-full before:scale-y-[3] before:content-['']",

				// Removed state - general
				removed &&
					"before:absolute before:inset-0 before:scale-y-2 before:content-['']",

				// Expanded state
				expanded &&
					"after:absolute after:bottom-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",

				// Mounted state
				mounted &&
					"translate-y-0 opacity-100 [&>*]:transition-opacity [&>*]:duration-400",

				// Visibility state
				!isVisible && "pointer-events-none opacity-0",

				// Mounted and expanded
				mounted &&
					expanded &&
					"transform-[translateY(calc(var(--lift)*var(--offset)))] h-[var(--initial-height)]",

				// Non-expanded and non-front toast (stacked toasts)
				!(expanded || isFront) &&
					"transform-[translateY(calc(var(--lift-amount)*var(--toasts-before)))] z-[var(--z-index)] h-[var(--front-toast-height)] scale-[calc(1-var(--toasts-before)*0.05)]",
				!(expanded || isFront) && "[&>*]:opacity-0",

				// Removed and front toast without swipe-out
				removed &&
					isFront &&
					!swipeOut &&
					"transform-[translateY(calc(var(--lift)*-100%))] opacity-0",

				// Removed and non-front toast - expanded
				removed &&
					!isFront &&
					!swipeOut &&
					expanded &&
					"transform-[translateY(calc(var(--lift)*var(--offset)+var(--lift)*-100%))] opacity-0",

				// Removed and non-front toast - not expanded
				removed &&
					!isFront &&
					!swipeOut &&
					!expanded &&
					"transform-[translateY(40%)] opacity-0 transition-[transform_500ms,opacity_200ms]",

				// Removed state with additional styling
				removed && "before:h-[calc(var(--initial-height)+20%)]",

				// Swiping transformation
				swiping &&
					"transform-[var(--y)_translateY(var(--swipe-amount-y,0px))_translateX(var(--swipe-amount-x,0px))] transition-none",

				// Swiped state
				isSwiped && "select-none",

				// Swipe out animations
				swipeOut &&
					"animation-duration-200 animation-ease-out animation-fill-forwards",
				swipeOut && swipeOutDirection === "right" && "swipe-out-right",
				swipeOut && swipeOutDirection === "down" && "swipe-out-down",

				// Toast type styling
				toastType === "error" &&
					"bg-destructive/90 text-destructive-foreground",
			)}
			style={
				{
					"--toasts-before": index,
					"--z-index": toasts.length - index,
					"--offset": `${removed ? offsetBeforeRemove : offset.current}px`,
					"--initial-height": expandByDefault ? "auto" : `${initialHeight}px`,
					"--lift": -1,
					"--lift-amount": "calc(var(--lift) * var(--gap))",
					"--y": getY(),
				} as React.CSSProperties
			}
			onDragEnd={() => {
				setSwiping(false);
				setSwipeDirection(null);
				pointerStartRef.current = null;
			}}
			onPointerDown={(event) => {
				if (disabled || !dismissible) return;
				dragStartTime.current = new Date();
				setOffsetBeforeRemove(offset.current);
				// Ensure we maintain correct pointer capture even when going outside of the toast (e.g. when swiping)
				(event.target as HTMLElement).setPointerCapture(event.pointerId);
				if ((event.target as HTMLElement).tagName === "BUTTON") return;
				setSwiping(true);
				pointerStartRef.current = { x: event.clientX, y: event.clientY };
			}}
			onPointerUp={() => {
				if (swipeOut || !dismissible) return;

				pointerStartRef.current = null;
				const swipeAmountX = Number(
					toastRef.current?.style
						.getPropertyValue("--swipe-amount-x")
						.replace("px", "") || 0,
				);
				const swipeAmountY = Number(
					toastRef.current?.style
						.getPropertyValue("--swipe-amount-y")
						.replace("px", "") || 0,
				);
				const timeTaken =
					Date.now() -
					(dragStartTime.current ? dragStartTime.current.getTime() : 0);

				const swipeAmount =
					swipeDirection === "x" ? swipeAmountX : swipeAmountY;
				const velocity = Math.abs(swipeAmount) / timeTaken;

				if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
					setOffsetBeforeRemove(offset.current);

					if (swipeDirection === "x") {
						toastRef.current?.style.setProperty("--swipe-amount-x", "400px");
						setSwipeOutDirection("right");
					} else {
						toastRef.current?.style.setProperty("--swipe-amount-y", "300px");
						setSwipeOutDirection("down");
					}

					toast.onDismiss?.(toast);

					deleteToast();
					setSwipeOut(true);

					return;
				}
				toastRef.current?.style.setProperty("--swipe-amount-x", "0px");
				toastRef.current?.style.setProperty("--swipe-amount-y", "0px");

				setIsSwiped(false);
				setSwiping(false);
				setSwipeDirection(null);
			}}
			onPointerMove={(event) => {
				if (!(pointerStartRef.current && dismissible)) return;
				let isHighlighted = false;

				if (window.getSelection() && window.getSelection() !== null) {
					// biome-ignore lint/style/noNonNullAssertion: We check for null above
					isHighlighted = window.getSelection()!.toString().length > 0;
				}

				if (isHighlighted) return;

				const yDelta = event.clientY - pointerStartRef.current.y;
				const xDelta = event.clientX - pointerStartRef.current.x;

				const swipeDirections = ["bottom", "right"];

				// Determine swipe direction if not already locked
				if (!swipeDirection && (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1)) {
					setSwipeDirection(Math.abs(xDelta) > Math.abs(yDelta) ? "x" : "y");
				}

				const swipeAmount = { x: 0, y: 0 };

				const getDampening = (delta: number) => {
					const factor = Math.abs(delta) / 20;

					return 1 / (1.5 + factor);
				};

				// Only apply swipe in the locked direction
				if (swipeDirection === "y") {
					// Handle vertical swipes
					if (
						swipeDirections.includes("top") ||
						swipeDirections.includes("bottom")
					) {
						if (
							(swipeDirections.includes("top") && yDelta < 0) ||
							(swipeDirections.includes("bottom") && yDelta > 0)
						) {
							swipeAmount.y = yDelta;
						} else {
							// Smoothly transition to dampened movement
							const dampenedDelta = yDelta * getDampening(yDelta);
							// Ensure we don't jump when transitioning to dampened movement
							swipeAmount.y =
								Math.abs(dampenedDelta) < Math.abs(yDelta)
									? dampenedDelta
									: yDelta;
						}
					}
				} else if (swipeDirection === "x") {
					// Handle horizontal swipes
					if (
						swipeDirections.includes("left") ||
						swipeDirections.includes("right")
					) {
						if (
							(swipeDirections.includes("left") && xDelta < 0) ||
							(swipeDirections.includes("right") && xDelta > 0)
						) {
							swipeAmount.x = xDelta;
						} else {
							// Smoothly transition to dampened movement
							const dampenedDelta = xDelta * getDampening(xDelta);
							// Ensure we don't jump when transitioning to dampened movement
							swipeAmount.x =
								Math.abs(dampenedDelta) < Math.abs(xDelta)
									? dampenedDelta
									: xDelta;
						}
					}
				}

				if (Math.abs(swipeAmount.x) > 0 || Math.abs(swipeAmount.y) > 0) {
					setIsSwiped(true);
				}

				// Apply transform using both x and y values
				toastRef.current?.style.setProperty(
					"--swipe-amount-x",
					`${swipeAmount.x}px`,
				);
				toastRef.current?.style.setProperty(
					"--swipe-amount-y",
					`${swipeAmount.y}px`,
				);
			}}
		>
			{/* Close Button */}
			{closeButton && toastType !== "loading" && (
				<button
					aria-label={closeButtonAriaLabel}
					className="absolute top-1 right-1 z-[1] flex transform cursor-pointer items-center justify-center rounded-full p-0 transition-[opacity_100ms,background_200ms,border-color_200ms] focus-visible:shadow-[0px_4px_12px_rgba(0,0,0,0.1),0_0_0_2px_rgba(0,0,0,0.2)] disabled:cursor-not-allowed"
					onClick={
						disabled || !dismissible
							? () => {}
							: () => {
									deleteToast();
									toast.onDismiss?.(toast);
								}
					}
					type="button"
				>
					{icons?.close ?? (
						<CloseIcon
							color="muted"
							strokeWidth={1}
							fill="currentColor"
							size={16}
						/>
					)}
				</button>
			)}

			{/* Toast Icon */}
			{hasIcon && (
				<div className="-ml-1 relative mr-3 flex h-4 w-4 flex-shrink-0 items-center justify-start">
					{toast.promise || (toast.type === "loading" && !toast.icon)
						? toast.icon || (
								<Loader2
									className={cn(
										"animate-spin",
										toastType !== "loading" ? "hidden" : "",
									)}
								/>
							)
						: null}
					{toast.type !== "loading" ? icon : null}
				</div>
			)}

			<div className="flex flex-col gap-0.5">
				{/* Toast Title */}
				<div className="font-medium text-sm leading-normal group-[.toast]:font-semibold">
					{typeof toast.title === "function" ? toast.title() : toast.title}
				</div>
				{/* Toast Description */}
				{toast.description ? (
					<div
						className={cn(
							"font-normal text-xs leading-normal group-[.toast]:text-muted-foreground",
							toastType === "error" &&
								"group-[.toast]:text-destructive-foreground/80",
						)}
					>
						{typeof toast.description === "function"
							? toast.description()
							: toast.description}
					</div>
				) : null}
			</div>
			{React.isValidElement(toast.cancel) ? (
				toast.cancel
			) : toast.cancel && isAction(toast.cancel) ? (
				<Button
					size="sm"
					variant="outline"
					onClick={(event) => {
						// We need to check twice because typescript
						if (!isAction(toast.cancel)) return;
						if (!dismissible) return;
						toast.cancel.onClick?.(event);
						deleteToast();
					}}
					className="h-6 px-2 text-xs"
				>
					{toast.cancel.label}
				</Button>
			) : null}
			{React.isValidElement(toast.action) ? (
				toast.action
			) : toast.action && isAction(toast.action) ? (
				<Button
					onClick={(event) => {
						// We need to check twice because typescript
						if (!isAction(toast.action)) return;
						toast.action.onClick?.(event);
						if (event.defaultPrevented) return;
						deleteToast();
					}}
					className="h-6 px-2 text-xs"
				>
					{toast.action.label}
				</Button>
			) : null}
		</li>
	);
};

/* -------------------------------------------------------------------------------------------------
 * Toaster Component
 * -----------------------------------------------------------------------------------------------*/

/**
 * Toaster component for managing and displaying toast notifications
 *
 * The Toaster component provides a container for displaying toast notifications in a consistent,
 * accessible way. It manages the visibility, positioning, and interaction behavior of toasts.
 *
 * Key features:
 * - Stacked arrangement of multiple toasts
 * - Keyboard support with customizable hotkeys
 * - Responsive positioning for different screen sizes
 * - Accessibility support with appropriate ARIA attributes
 * - Expand/collapse behavior for managing multiple notifications
 *
 * Usage considerations:
 * - Place a single Toaster component at the root of your application
 * - Use the useToasts hook to programmatically trigger toasts from any component
 * - Configure default behavior through props for consistent notifications
 */
const Toaster = React.forwardRef<HTMLElement, ToasterProps>(function Toaster(
	{
		hotkey = ["altKey", "KeyT"],
		expand,
		closeButton,
		offset,
		mobileOffset,
		duration,
		visibleToasts = VISIBLE_TOASTS_AMOUNT,
		toastOptions,
		gap = GAP,
		icons,
		containerAriaLabel = "Notifications",
	},
	forwardedRef,
) {
	const [toasts, setToasts] = React.useState<ToastT[]>([]);
	const [heights, setHeights] = React.useState<HeightT[]>([]);
	const [expanded, setExpanded] = React.useState(false);
	const [interacting, setInteracting] = React.useState(false);
	const toasterRef = React.useRef<HTMLElement>(null);
	const composedRefs = useComposedRefs(toasterRef, forwardedRef);

	const listRef = React.useRef<HTMLOListElement>(null);
	const hotkeyLabel = hotkey
		.join("+")
		.replace(/Key/g, "")
		.replace(/Digit/g, "");
	const lastFocusedElementRef = React.useRef<HTMLElement>(null);
	const isFocusWithinRef = React.useRef(false);

	// Mark Toaster as mounted on component mount
	React.useEffect(() => {
		ToastState.markToasterMounted();

		return () => {
			// Mark Toaster as unmounted on component unmount
			ToastState.markToasterUnmounted();
		};
	}, []);

	const removeToast = useCallbackRef((toastToRemove: ToastT) => {
		setToasts((toasts) => {
			if (!toasts.find((toast) => toast.id === toastToRemove.id)?.delete) {
				ToastState.dismiss(toastToRemove.id);
			}

			return toasts.filter(({ id }) => id !== toastToRemove.id);
		});
	});

	React.useEffect(() => {
		return ToastState.subscribe((toast) => {
			if ((toast as ToastToDismiss).dismiss) {
				// Prevent batching of other state updates
				requestAnimationFrame(() => {
					setToasts((toasts) =>
						toasts.map((t) => (t.id === toast.id ? { ...t, delete: true } : t)),
					);
				});
				return;
			}

			// Prevent batching, temp solution.
			setTimeout(() => {
				ReactDOM.flushSync(() => {
					setToasts((toasts) => {
						if (!toast.id) return toasts;
						const toastWithId = toast as ToastT;

						const indexOfExistingToast = toasts.findIndex(
							(t) => t.id === toastWithId.id,
						);

						// Update the toast if it already exists
						if (indexOfExistingToast !== -1) {
							return [
								...toasts.slice(0, indexOfExistingToast),
								{ ...toasts[indexOfExistingToast], ...toast },
								...toasts.slice(indexOfExistingToast + 1),
							];
						}

						return [toastWithId, ...toasts];
					});
				});
			});
		});
	}, [toasts]);

	React.useEffect(() => {
		// Ensure expanded is always false when no toasts are present / only one left
		if (toasts.length <= 1) {
			setExpanded(false);
		}
	}, [toasts]);

	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const isHotkeyPressed = hotkey.every((key) => {
				if (key === "KeyT") return event.code === "KeyT";
				return event[key];
			});

			if (isHotkeyPressed) {
				setExpanded(true);
				listRef.current?.focus();
			}
		};
		document.addEventListener("keydown", handleKeyDown);

		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [hotkey]);

	useEscapeKeydown(() => {
		if (
			document.activeElement === listRef.current ||
			listRef.current?.contains(document.activeElement as Node)
		) {
			setExpanded(false);
		}
	});

	useLayoutEffect(() => {
		if (listRef.current) {
			return () => {
				if (lastFocusedElementRef.current) {
					lastFocusedElementRef.current.focus({ preventScroll: true });
					lastFocusedElementRef.current = null;
					isFocusWithinRef.current = false;
				}
			};
		}
	}, [listRef.current]);

	const lifted = expanded && toasts.length > 1 && !expand;

	return (
		// Remove item from normal navigation flow, only available via hotkey
		<section
			ref={composedRefs}
			aria-label={`${containerAriaLabel} ${hotkeyLabel}`}
			tabIndex={-1}
			aria-live="polite"
			aria-relevant="additions text"
			aria-atomic="false"
			suppressHydrationWarning={true}
		>
			<ol
				tabIndex={-1}
				ref={listRef}
				className={cn(
					// Base toaster styles
					"fixed right-[var(--offset-right)] bottom-[var(--offset-bottom)] z-[999999999] m-0 box-border w-[var(--width)] list-none p-0 outline-none transition-transform duration-400 ease-in",

					// Conditional classes
					lifted && "-translate-y-2 transform md:transform-none",

					// Mobile responsive styles
					"max-sm:right-[var(--mobile-offset-right)] max-sm:left-[var(--mobile-offset-left)] max-sm:w-full",
					lifted && "-translate-y-2 md:transform-none",
				)}
				style={
					{
						"--front-toast-height": `${heights[0]?.height || 0}px`,
						"--width": `${TOAST_WIDTH}px`,
						"--gap": `${gap}px`,
						"--toast-icon-margin-start": "-3px",
						"--toast-icon-margin-end": "4px",
						"--toast-svg-margin-start": "-1px",
						"--toast-svg-margin-end": "0px",
						"--toast-button-margin-start": "auto",
						"--toast-button-margin-end": "0",
						"--toast-close-button-start": "0",
						"--toast-close-button-end": "unset",
						"--toast-close-button-transform": "translate(-35%, -35%)",
						...assignOffset(offset, mobileOffset),
					} as React.CSSProperties
				}
				onBlur={(event) => {
					if (
						isFocusWithinRef.current &&
						!event.currentTarget.contains(event.relatedTarget)
					) {
						isFocusWithinRef.current = false;
						if (lastFocusedElementRef.current) {
							lastFocusedElementRef.current.focus({
								preventScroll: true,
							});
							lastFocusedElementRef.current = null;
						}
					}
				}}
				onFocus={(event) => {
					const isNotDismissible =
						event.target instanceof HTMLElement &&
						event.target.dataset.dismissible === "false";

					if (isNotDismissible) return;

					if (!isFocusWithinRef.current) {
						isFocusWithinRef.current = true;
						lastFocusedElementRef.current = event.relatedTarget as HTMLElement;
					}
				}}
				onMouseEnter={() => setExpanded(true)}
				onMouseMove={() => setExpanded(true)}
				onMouseLeave={() => {
					// Avoid setting expanded to false when interacting with a toast, e.g. swiping
					if (!interacting) {
						setExpanded(false);
					}
				}}
				onDragEnd={() => setExpanded(false)}
				onPointerDown={(event) => {
					const isNotDismissible =
						event.target instanceof HTMLElement &&
						event.target.dataset.dismissible === "false";

					if (isNotDismissible) return;
					setInteracting(true);
				}}
				onPointerUp={() => setInteracting(false)}
			>
				{toasts.map((toast, index) => (
					<Toast
						key={toast.id}
						icons={icons}
						index={index}
						toast={toast}
						duration={toastOptions?.duration ?? duration}
						visibleToasts={visibleToasts}
						closeButton={Boolean(toastOptions?.closeButton ?? closeButton)}
						interacting={interacting}
						closeButtonAriaLabel={toastOptions?.closeButtonAriaLabel}
						removeToast={removeToast}
						toasts={toasts}
						heights={heights}
						setHeights={setHeights}
						expandByDefault={Boolean(expand)}
						gap={gap}
						expanded={expanded}
					/>
				))}
			</ol>
		</section>
	);
});

export { Toaster, useToasts };
export type { Action, ToastToDismiss, ToastT };
