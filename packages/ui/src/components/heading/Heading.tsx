import type { BoxVariants } from "@squaredmade/ui/box";
import { cn } from "@squaredmade/ui/cn";
import {
	type ResponsiveProps,
	createResponsiveComponent,
} from "@squaredmade/ui/responsive";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

export const headingVariants = cva("scroll-m-20 tracking-tight", {
	variants: {
		variant: {
			// Semantic variants that set appropriate defaults for each heading level
			h1: "text-4xl font-extrabold text-foreground leading-tight",
			h2: "text-3xl font-bold text-foreground leading-tight",
			h3: "text-2xl font-semibold text-foreground",
			h4: "text-xl font-semibold text-foreground",
			h5: "text-lg font-medium text-foreground",
			h6: "text-base font-medium text-foreground",
			// Special purpose variants
			display: "text-5xl font-extrabold text-foreground leading-tight",
			title: "text-4xl font-bold text-foreground",
			subtitle: "text-2xl font-medium text-foreground/80",
			section: "text-xl font-semibold text-primary",
		},
		color: {
			foreground: "text-foreground",
			card: "text-card-foreground",
			popover: "text-popover-foreground",
			primary: "text-primary-foreground",
			secondary: "text-secondary-foreground",
			accent: "text-accent-foreground",
			destructive: "text-destructive-foreground",
			"n-50": "text-zinc-50",
			"n-100": "text-zinc-100",
			"n-200": "text-zinc-200",
			"n-300": "text-zinc-300",
			"n-400": "text-zinc-400",
			"n-500": "text-zinc-500",
			"n-600": "text-zinc-600",
			"n-700": "text-zinc-700",
			"n-800": "text-zinc-800",
			"n-900": "text-zinc-900",
			"n-950": "text-zinc-950",
		},
	},
	// No default variants - we'll derive them from the heading level
});

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// Special purpose variants beyond standard heading levels
type HeadingVariant =
	| HeadingLevel
	| "display"
	| "title"
	| "subtitle"
	| "section";

type HeadingVariants = VariantProps<typeof headingVariants>;
type ResponsiveHeadingProps = ResponsiveProps<HeadingVariants>;
const { createResponsive } = createResponsiveComponent(headingVariants);

export interface HeadingProps extends Omit<ResponsiveHeadingProps, "variant"> {
	/**
	 * The semantic role and appearance of the heading.
	 * When omitted, defaults to a variant matching the HTML tag.
	 */
	variant?: HeadingVariant;

	/** The HTML tag to use for the heading. Defaults to matching the variant. */
	as?: HeadingLevel;

	/** The text content of the heading. */
	children: React.ReactNode;

	/** Additional classes to apply to the heading. */
	className?: BoxVariants;
}

/**
 * An opinionated heading component for displaying titles and subtitles.
 *
 * The Heading component provides semantic presets that automatically apply appropriate
 * styling based on the heading level or variant, reducing the need to specify individual props.
 */
const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	({ className, as, variant, color, ...props }, ref) => {
		// If no explicit variant is provided, use the heading level as variant
		const finalVariant = variant || as;

		// If no explicit heading level is provided but variant is a heading level, use it
		const finalAs =
			as ||
			(finalVariant && /^h[1-6]$/.test(finalVariant)
				? (finalVariant as HeadingLevel)
				: "h2");

		const Comp = finalAs;

		// Create responsive classes - custom props take precedence over variant defaults
		const classes = createResponsive({
			variant: finalVariant,
			color,
		});

		return <Comp className={cn(classes, className)} ref={ref} {...props} />;
	},
);

Heading.displayName = "Heading";

export { Heading };
