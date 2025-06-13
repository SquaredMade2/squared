"use client";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "@squaredmade/icons";
import * as React from "react";
import { cn } from "src/cn/Cn";
function Accordion({
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
	return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

/**
 * Styled AccordionItem component with default border styling.
 * This is a pre-styled version of AccordionItemPrimitive with visual enhancements.
 */
const AccordionItem = React.forwardRef<
	React.ComponentRef<typeof AccordionPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Item
		ref={ref}
		className={cn("border-b", className)}
		{...props}
	/>
));
AccordionItem.displayName = "AccordionItem";

/**
 * Styled AccordionTrigger component with enhanced visual presentation.
 * Includes a rotating chevron icon that indicates the expanded state,
 * hover effects, and appropriate spacing.
 */
const AccordionTrigger = React.forwardRef<
	React.ComponentRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Trigger className="flex">
		<AccordionPrimitive.Trigger
			ref={ref}
			className={cn(
				"flex flex-1 items-center justify-between py-4 text-left font-medium text-sm transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
				className,
			)}
			{...props}
		>
			{children}
			<ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Trigger>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

/**
 * Styled AccordionContent component with animations and proper spacing.
 * Includes smooth collapse/expand animations and consistent padding.
 */
const AccordionContent = React.forwardRef<
	React.ComponentRef<typeof AccordionPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Content
		ref={ref}
		className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
		{...props}
	>
		<div className={cn("pt-0 pb-4", className)}>{children}</div>
	</AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
