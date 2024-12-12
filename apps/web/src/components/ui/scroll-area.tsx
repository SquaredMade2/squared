"use client";

import { cn } from "@/utils/cn";
import * as ScrollAreaPrimitive from "@repo/ui/scroll-area";
import * as React from "react";

type ScrollAreaProps = React.ComponentPropsWithoutRef<
	typeof ScrollAreaPrimitive.Root
> & {
	viewportRef?: React.RefObject<HTMLDivElement>;
};

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
	({ className, children, viewportRef, ...props }, ref) => {
		// This all basically allows for an optional ref to access the Viewport component ref (for scroll access)
		// while allowing default ref top still be root.
		const internalViewportRef = React.useRef<HTMLDivElement>(null);
		const finalViewportRef = viewportRef || internalViewportRef;
		const setRootRef = (element: HTMLDivElement | null) => {
			if (typeof ref === "function") {
				ref(element);
			} else if (ref) {
				(ref as React.MutableRefObject<HTMLDivElement | null>).current =
					element;
			}
		};

		return (
			<ScrollAreaPrimitive.Root
				ref={setRootRef}
				className={cn("relative overflow-hidden", className)}
				{...props}
			>
				<ScrollAreaPrimitive.Viewport
					ref={finalViewportRef}
					className="h-full w-full rounded-[inherit]"
				>
					{children}
				</ScrollAreaPrimitive.Viewport>
				<ScrollBar />
				<ScrollAreaPrimitive.Corner />
			</ScrollAreaPrimitive.Root>
		);
	},
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
	<ScrollAreaPrimitive.ScrollAreaScrollbar
		ref={ref}
		orientation={orientation}
		className={cn(
			"flex touch-none select-none transition-colors",
			orientation === "vertical" &&
				"h-full w-2.5 border-l border-l-transparent p-[1px]",
			orientation === "horizontal" &&
				"h-2.5 flex-col border-t border-t-transparent p-[1px]",
			className,
		)}
		{...props}
	>
		<ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
	</ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
