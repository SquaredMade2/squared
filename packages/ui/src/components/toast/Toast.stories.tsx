import { Button } from "@squaredmade/ui/button";
import { Toaster, toast } from "@squaredmade/ui/toast";
import type { Meta } from "@storybook/react";
import { useEffect, useState } from "react";

const meta: Meta<typeof Toaster> = {
	title: "Components/Toast",
	component: Toaster,
	tags: ["autodocs"],
	parameters: {
		controls: { expanded: true },
	},
};

export default meta;

// Basic toast example
export const Basic = () => {
	return (
		<div>
			<Button onClick={() => toast("Hello World!")}>Show Basic Toast</Button>
			<Toaster />
		</div>
	);
};

// All toast types
export const Types = () => {
	return (
		<div>
			<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
				<Button onClick={() => toast("Default toast message")}>Default</Button>
				<Button
					onClick={() => toast.success("Success toast message")}
					variant="secondary"
				>
					Success
				</Button>
				<Button
					onClick={() => toast.error("Error toast message")}
					variant="destructive"
				>
					Error
				</Button>
				<Button onClick={() => toast.info("Info toast message")}>Info</Button>
				<Button onClick={() => toast.warning("Warning toast message")}>
					Warning
				</Button>
				<Button onClick={() => toast.loading("Loading, please wait...")}>
					Loading
				</Button>
			</div>
			<Toaster />
		</div>
	);
};

// Toast with title and description
export const TitleAndDescription = () => {
	return (
		<div>
			<Button
				onClick={() =>
					toast.success("Successfully saved!", {
						description: "Your changes have been saved successfully.",
					})
				}
			>
				Show Success Toast
			</Button>
			<Toaster />
		</div>
	);
};

// Promise integration
export const PromiseToast = () => {
	const mockPromise = () => {
		return new Promise<{ name: string; items: number }>((resolve, reject) => {
			setTimeout(() => {
				Math.random() > 0.3
					? resolve({ name: "John", items: 5 })
					: reject(new Error("Failed to fetch data"));
			}, 2000);
		});
	};

	return (
		<div>
			<Button
				onClick={() =>
					toast.promise(mockPromise(), {
						loading: "Fetching data...",
						success: (data) => `Retrieved ${data.items} items for ${data.name}`,
						error: (err) =>
							err instanceof Error ? `Error: ${err.message}` : "Unknown error",
					})
				}
			>
				Fetch Data
			</Button>
			<Toaster />
		</div>
	);
};

// Toast with actions
export const WithActions = () => {
	return (
		<div>
			<Button
				onClick={() =>
					toast.info("Update Available", {
						description: "A new version is available. Update now?",
						action: {
							label: "Update",
							onClick: () => console.log("Update clicked"),
						},
						cancel: {
							label: "Later",
							onClick: () => console.log("Later clicked"),
						},
					})
				}
			>
				Show Toast with Actions
			</Button>
			<Toaster />
		</div>
	);
};

export const MultipleToasts = () => {
	const showToasts = async () => {
		for (let i = 1; i <= 3; i++) {
			toast(`Toast message ${i}`);
			await new Promise((resolve) => setTimeout(resolve, 800));
		}
	};

	return (
		<div>
			<Button onClick={showToasts}>Show Multiple Toasts</Button>
			<Toaster />
		</div>
	);
};
// Toast durations
export const Duration = () => {
	return (
		<div>
			<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
				<Button onClick={() => toast("Quick toast", { duration: 1000 })}>
					1 second
				</Button>
				<Button onClick={() => toast("Default toast", { duration: 4000 })}>
					4 seconds (default)
				</Button>
				<Button onClick={() => toast("Long toast", { duration: 10000 })}>
					10 seconds
				</Button>
				<Button
					onClick={() =>
						toast("Persistent toast", { duration: Number.POSITIVE_INFINITY })
					}
				>
					Persistent
				</Button>
			</div>
			<Toaster />
		</div>
	);
};

// Close button
export const CloseButton = () => {
	return (
		<div>
			<Button
				onClick={() =>
					toast("Dismissible Toast", {
						description: "Click the X to dismiss this toast",
						closeButton: true,
					})
				}
			>
				Show Toast with Close Button
			</Button>
			<Toaster />
		</div>
	);
};

// Programmatic dismissal
export const ProgrammaticDismissal = () => {
	const [toastId, setToastId] = useState<string | number | null>(null);

	const showToast = () => {
		const id = toast.loading(
			"This toast will be dismissed programmatically...",
			{
				duration: Number.POSITIVE_INFINITY,
			},
		);
		setToastId(id);
	};

	const dismissToast = () => {
		if (toastId) {
			toast.dismiss(toastId);
			setToastId(null);
		}
	};

	return (
		<div>
			<div style={{ display: "flex", gap: "8px" }}>
				<Button
					onClick={showToast}
					disabled={toastId !== null}
					style={{ opacity: toastId !== null ? 0.5 : 1 }}
				>
					Show Toast
				</Button>
				<Button
					onClick={dismissToast}
					disabled={toastId === null}
					style={{ opacity: toastId === null ? 0.5 : 1 }}
				>
					Dismiss Toast
				</Button>
			</div>
			<Toaster />
		</div>
	);
};

// Accessibility example
export const Accessibility = () => {
	const [isMac, setIsMac] = useState(false);

	useEffect(() => {
		// Check if user is on a Mac
		const userAgent = window.navigator.userAgent.toLowerCase();
		setIsMac(/macintosh|mac os x/i.test(userAgent));
	}, []);

	// Formatted hotkey text for display
	const hotkeyText = isMac ? "⌥ + T" : "Alt + T";
	return (
		<div>
			<p>Press {hotkeyText} to focus the toasts (default hotkey)</p>
			<Button
				onClick={() =>
					[1, 2, 3].map(() =>
						toast.info("Accessible Toast", {
							description:
								"This toast is fully accessible with proper ARIA attributes",
							action: {
								label: "OK",
								onClick: () => console.log("Action clicked"),
							},
						}),
					)
				}
			>
				Show Accessible Toasts
			</Button>
			<Toaster
				containerAriaLabel="Notifications"
				toastOptions={{
					closeButtonAriaLabel: "Close notification",
				}}
			/>
		</div>
	);
};
