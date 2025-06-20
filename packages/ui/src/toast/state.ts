import React from "react";
import type { ToastToDismiss } from ".";
import type { PromiseT, ToastT, ToastTypes } from "./Toast";

/**
 * Counter to generate unique IDs for toasts when not explicitly provided
 */
let toastsCounter = 1;

/**
 * Type definition for toast titles
 * Allows for both static React nodes and functions that return React nodes
 */
type TitleT = (() => React.ReactNode) | React.ReactNode;

/**
 * Extended promise result type for complex toast results
 * Can be either a direct result object or a function that takes data and returns a result
 *
 * @template Data - The type of data that the promise resolves with
 */
type PromiseTExtendedResult<Data = unknown> =
	| PromiseIExtendedResult
	| ((data: Data) => PromiseIExtendedResult | Promise<PromiseIExtendedResult>);

/**
 * Promise result type for toast content
 * Can be a string, React node, or a function that takes data and returns content
 *
 * @template Data - The type of data that the promise resolves with
 */
type PromiseTResult<Data = unknown> =
	| string
	| React.ReactNode
	| ((
			data: Data,
	  ) => React.ReactNode | string | Promise<React.ReactNode | string>);

/**
 * Promise external toast type without description
 * Used to allow overriding all properties except description
 */
type PromiseExternalToast = Omit<ExternalToast, "description">;

/**
 * Configuration for toast notifications that display promise states
 */
type PromiseData<ToastData = unknown> = PromiseExternalToast & {
	/**
	 * Content to display while the promise is loading
	 */
	loading?: string | React.ReactNode;
	/**
	 * Content to display when the promise resolves successfully
	 */
	success?: PromiseTResult<ToastData> | PromiseTExtendedResult<ToastData>;
	/**
	 * Content to display when the promise rejects
	 */
	error?: PromiseTResult | PromiseTExtendedResult;
	/**
	 * Additional description content
	 */
	description?: PromiseTResult;
	/**
	 * Function to execute after the promise settles
	 */
	finally?: () => void | Promise<void>;
};

/**
 * External toast configuration type
 * Represents the user-facing API for creating toasts with optional ID
 */
type ExternalToast = Omit<
	ToastT,
	"id" | "type" | "title" | "jsx" | "delete" | "promise"
> & {
	id?: number | string;
};

/**
 * Interface for extended promise results
 * Used to provide additional configuration options along with the message
 *
 * @property {React.ReactNode} message - The main content to display
 */
interface PromiseIExtendedResult extends ExternalToast {
	message: React.ReactNode;
}

/**
 * Observer class for managing toast notifications
 * Implements the observer pattern to allow components to subscribe to toast updates
 */
class Observer {
	/**
	 * List of functions that will be called when a toast is added or dismissed
	 */
	subscribers: Array<(toast: ExternalToast | ToastToDismiss) => void>;

	/**
	 * Collection of all toasts, including those that have been dismissed
	 */
	toasts: Array<ToastT | ToastToDismiss>;

	/**
	 * Set of IDs for toasts that have been dismissed
	 */
	dismissedToasts: Set<string | number>;

	/**
	 * Add a flag to track if a Toaster is mounted
	 */
	isToasterMounted: boolean;

	/**
	 * Creates a new Observer instance and initializes collections
	 */
	constructor() {
		this.subscribers = [];
		this.toasts = [];
		this.dismissedToasts = new Set();
		this.isToasterMounted = false;
	}

	/**
	 * Mark a Toaster as mounted
	 */
	markToasterMounted = () => {
		this.isToasterMounted = true;
	};

	/**
	 * Mark a Toaster as unmounted
	 */
	markToasterUnmounted = () => {
		this.isToasterMounted = false;
	};

	/**
	 * Check if a Toaster is mounted before executing toast functions
	 */
	checkToasterMounted = () => {
		if (!this.isToasterMounted) {
			console.error(
				"No Toaster component is mounted. Please mount a Toaster component before using toast functions.",
			);
			return false;
		}
		return true;
	};

	/**
	 * Registers a subscriber function to be called when toasts are added or dismissed
	 */
	subscribe = (subscriber: (toast: ExternalToast | ToastToDismiss) => void) => {
		this.subscribers.push(subscriber);

		return () => {
			const index = this.subscribers.indexOf(subscriber);
			this.subscribers.splice(index, 1);
		};
	};

	/**
	 * Publishes a toast notification to all subscribers
	 */
	publish = (data: ToastT) => {
		for (const subscriber of this.subscribers) {
			subscriber(data);
		}
	};

	/**
	 * Adds a toast to the collection and publishes it to all subscribers
	 */
	addToast = (data: ToastT) => {
		this.publish(data);
		this.toasts = [...this.toasts, data];
	};

	/**
	 * Creates a new toast or updates an existing one with the same ID
	 */
	create = (
		data: ExternalToast & {
			message?: TitleT;
			type?: ToastTypes;
			promise?: PromiseT;
			jsx?: React.ReactElement;
		},
	) => {
		const { message, ...rest } = data;
		const id =
			typeof data?.id === "number" || (data.id && data.id.length > 0)
				? data.id
				: toastsCounter++;
		const alreadyExists = this.toasts.find((toast) => {
			return toast.id === id;
		});
		const dismissible =
			data.dismissible === undefined ? true : data.dismissible;

		if (this.dismissedToasts.has(id)) {
			this.dismissedToasts.delete(id);
		}

		if (alreadyExists) {
			this.toasts = this.toasts.map((toast) => {
				if (toast.id === id) {
					this.publish({ ...toast, ...data, id, title: message });
					return {
						...toast,
						...data,
						id,
						dismissible,
						title: message,
					};
				}

				return toast;
			});
		} else {
			this.addToast({ title: message, ...rest, dismissible, id });
		}

		return id;
	};

	/**
	 * Dismisses a toast by ID or all toasts if no ID is provided
	 */
	dismiss = (id?: number | string) => {
		if (id) {
			this.dismissedToasts.add(id);
			requestAnimationFrame(() => {
				for (const subscriber of this.subscribers) {
					subscriber({ id, dismiss: true });
				}
			});
		} else {
			for (const toast of this.toasts) {
				for (const subscriber of this.subscribers) {
					subscriber({ id: toast.id, dismiss: true });
				}
			}
		}

		return id;
	};

	message = (message: TitleT | React.ReactNode, data?: ExternalToast) => {
		return this.create({ ...data, message });
	};

	error = (message: TitleT | React.ReactNode, data?: ExternalToast) => {
		return this.create({ ...data, message, type: "error" });
	};

	success = (message: TitleT | React.ReactNode, data?: ExternalToast) => {
		return this.create({ ...data, type: "success", message });
	};

	info = (message: TitleT | React.ReactNode, data?: ExternalToast) => {
		return this.create({ ...data, type: "info", message });
	};

	warning = (message: TitleT | React.ReactNode, data?: ExternalToast) => {
		return this.create({ ...data, type: "warning", message });
	};

	loading = (message: TitleT | React.ReactNode, data?: ExternalToast) => {
		return this.create({ ...data, type: "loading", message });
	};

	/**
	 * Creates a toast that updates based on the state of a promise
	 */
	promise = <ToastData>(
		promise: PromiseT<ToastData>,
		data?: PromiseData<ToastData>,
	) => {
		if (!data) {
			// Nothing to show
			return;
		}

		let id: string | number | undefined;
		if (data.loading !== undefined) {
			id = this.create({
				...data,
				promise,
				type: "loading",
				message: data.loading,
				description:
					typeof data.description !== "function" ? data.description : undefined,
			});
		}

		const p = Promise.resolve(
			promise instanceof Function ? promise() : promise,
		);

		let shouldDismiss = id !== undefined;
		let result: ["resolve", ToastData] | ["reject", unknown];

		const originalPromise = p
			.then(async (response) => {
				result = ["resolve", response];
				const isReactElementResponse = React.isValidElement(response);
				if (isReactElementResponse) {
					shouldDismiss = false;
					this.create({ id, type: "default", message: response });
				} else if (isHttpResponse(response) && !response.ok) {
					shouldDismiss = false;

					const promiseData =
						typeof data.error === "function"
							? await data.error(
									new Error(`HTTP error! status: ${response.status}`),
								)
							: data.error;

					const description =
						typeof data.description === "function"
							? await data.description(
									new Error(`HTTP error! status: ${response.status}`),
								)
							: data.description;

					const isExtendedResult =
						typeof promiseData === "object" &&
						!React.isValidElement(promiseData);

					const toastSettings: PromiseIExtendedResult = isExtendedResult
						? (promiseData as PromiseIExtendedResult)
						: { message: promiseData };

					this.create({ id, type: "error", description, ...toastSettings });
				} else if (response instanceof Error) {
					shouldDismiss = false;

					const promiseData =
						typeof data.error === "function"
							? await data.error(response)
							: data.error;

					const description =
						typeof data.description === "function"
							? await data.description(response)
							: data.description;

					const isExtendedResult =
						typeof promiseData === "object" &&
						!React.isValidElement(promiseData);

					const toastSettings: PromiseIExtendedResult = isExtendedResult
						? (promiseData as PromiseIExtendedResult)
						: { message: promiseData };

					this.create({ id, type: "error", description, ...toastSettings });
				} else if (data.success !== undefined) {
					shouldDismiss = false;
					const promiseData =
						typeof data.success === "function"
							? await data.success(response)
							: data.success;

					const description =
						typeof data.description === "function"
							? await data.description(response)
							: data.description;

					const isExtendedResult =
						typeof promiseData === "object" &&
						!React.isValidElement(promiseData);

					const toastSettings: PromiseIExtendedResult = isExtendedResult
						? (promiseData as PromiseIExtendedResult)
						: { message: promiseData };

					this.create({ id, type: "success", description, ...toastSettings });
				}
			})
			.catch(async (error) => {
				result = ["reject", error];
				if (data.error !== undefined) {
					shouldDismiss = false;
					const promiseData =
						typeof data.error === "function"
							? await data.error(error)
							: data.error;

					const description =
						typeof data.description === "function"
							? await data.description(error)
							: data.description;

					const isExtendedResult =
						typeof promiseData === "object" &&
						!React.isValidElement(promiseData);

					const toastSettings: PromiseIExtendedResult = isExtendedResult
						? (promiseData as PromiseIExtendedResult)
						: { message: promiseData };

					this.create({ id, type: "error", description, ...toastSettings });
				}
			})
			.finally(() => {
				if (shouldDismiss) {
					// Toast is still in load state (and will be indefinitely — dismiss it)
					this.dismiss(id);
					id = undefined;
				}

				data.finally?.();
			});

		const unwrap = () =>
			new Promise<ToastData>((resolve, reject) =>
				originalPromise
					.then(() =>
						result[0] === "reject" ? reject(result[1]) : resolve(result[1]),
					)
					.catch(reject),
			);

		if (typeof id !== "string" && typeof id !== "number") {
			// cannot Object.assign on undefined
			return { unwrap };
		}
		return Object.assign(id, { unwrap });
	};

	custom = (
		jsx: (id: number | string) => React.ReactElement,
		data?: ExternalToast,
	) => {
		const id = data?.id || toastsCounter++;
		this.create({ jsx: jsx(id), id, ...data });
		return id;
	};

	/**
	 * Gets all toasts that haven't been dismissed
	 */
	getActiveToasts = () => {
		return this.toasts.filter((toast) => !this.dismissedToasts.has(toast.id));
	};
}

/**
 * Singleton instance of the Observer class to manage toast state globally
 */
export const ToastState = new Observer();

/**
 * Basic toast function that creates a default toast
 */
const toastFunction = (message: TitleT, data?: ExternalToast) => {
	// Check if Toaster is mounted before creating a toast
	if (!ToastState.checkToasterMounted()) return;
	const id = data?.id || toastsCounter++;

	ToastState.addToast({
		title: message,
		...data,
		id,
	});
	return id;
};

/**
 * Checks if a value is an HTTP Response object
 */
const isHttpResponse = (data: unknown): data is Response => {
	return (
		Boolean(data) &&
		typeof data === "object" &&
		data !== null &&
		"ok" in data &&
		typeof data.ok === "boolean" &&
		"status" in data &&
		typeof data.status === "number"
	);
};

/**
 * Basic toast function for creating default toasts
 */
const basicToast = toastFunction;

/**
 * Gets all toasts, including dismissed ones
 */
const getHistory = () => ToastState.toasts;

/**
 * Gets only active (non-dismissed) toasts
 */
const getToasts = () => ToastState.getActiveToasts();

/**
 * Main toast API that combines all toast creation methods and utilities
 * We use `Object.assign` to maintain the correct types as we would lose them otherwise
 */
export const toast = Object.assign(
	basicToast,
	{
		success: ToastState.success,
		info: ToastState.info,
		warning: ToastState.warning,
		error: ToastState.error,
		custom: ToastState.custom,
		message: ToastState.message,
		promise: ToastState.promise,
		dismiss: ToastState.dismiss,
		loading: ToastState.loading,
	},
	{ getHistory, getToasts },
);

export type { ExternalToast };
