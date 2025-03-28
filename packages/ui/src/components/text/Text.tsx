import { cn } from "@squared/ui/cn";
import {
	type ResponsiveProps,
	createResponsiveComponent,
} from "@squared/ui/responsive";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

export const textVariants = cva(
	"text-base font-normal normal-case text-left text-foreground no-underline leading-normal whitespace-normal flex gap-1 items-center",
	{
		variants: {
			size: {
				xs: "text-xs",
				sm: "text-sm",
				base: "text-base",
				lg: "text-lg",
				xl: "text-xl",
				"2xl": "text-2xl",
				"3xl": "text-3xl",
				"4xl": "text-4xl",
			},
			weight: {
				normal: "font-normal",
				medium: "font-medium",
				semibold: "font-semibold",
				bold: "font-bold",
			},
			transform: {
				normal: "normal-case",
				uppercase: "uppercase",
				lowercase: "lowercase",
				capitalize: "capitalize",
			},
			align: {
				left: "text-left",
				center: "text-center",
				right: "text-right",
				justify: "text-justify",
			},
			color: {
				foreground: "text-foreground",
				card: "text-card-foreground",
				popover: "text-popover-foreground",
				primary: "text-primary",
				secondary: "text-secondary",
				accent: "text-accent-foreground",
				destructive: "text-destructive",
				muted: "text-muted-foreground",
				white: "text-white",
			},
			decoration: {
				none: "no-underline",
				underline: "underline",
				"line-through": "line-through",
			},
			lineHeight: {
				none: "leading-none",
				tight: "leading-tight",
				snug: "leading-snug",
				normal: "leading-normal",
				relaxed: "leading-relaxed",
				loose: "leading-loose",
			},
			whiteSpace: {
				normal: "whitespace-normal",
				nowrap: "whitespace-nowrap",
				pre: "whitespace-pre",
				"pre-line": "whitespace-pre-line",
				"pre-wrap": "whitespace-pre-wrap",
			},
		},
		defaultVariants: {
			size: "base",
			weight: "normal",
			transform: "normal",
			align: "left",
			color: "foreground",
			decoration: "none",
			lineHeight: "normal",
			whiteSpace: "normal",
		},
	},
);

type TextVariants = VariantProps<typeof textVariants>;
type ResponsiveTextProps = ResponsiveProps<TextVariants>;
const { createResponsive } = createResponsiveComponent(textVariants);

export interface TextProps extends ResponsiveTextProps {
	/** Whether to truncate the text with an ellipsis. Defaults to false. */
	truncate?: boolean;
	/** The number of lines to clamp the text to. */
	clamped?: number;
	/** Extra classes to apply to the text */
	className?: string;
	/** The text to be rendered within the component */
	children: React.ReactNode;
}

/**
 * Text component for displaying text with various styles
 *
 * The Text component provides a flexible way to render text with customizable styles. It supports various text properties such as size, weight, color, alignment, and more.
 *
 * Key features:
 * - Customizable text size, weight, and color
 * - Support for text transformation and alignment
 * - Options for truncation and line clamping
 * - Configurable text decoration and line height
 * - White space handling options
 *
 * Usage considerations:
 * - Use for consistent text styling across your application
 * - Combine different props to achieve desired text appearance
 * - Consider accessibility when choosing text sizes and colors
 * - Use truncate or clamped props for handling long text in constrained spaces
 * - Ensure proper contrast between text color and background for readability
 */
export const Text: React.FC<TextProps> = ({
	size,
	weight,
	transform,
	align,
	truncate = false,
	clamped,
	color,
	decoration,
	lineHeight,
	whiteSpace,
	className,
	children,
	...props
}) => {
	const classes = createResponsive({
		size,
		weight,
		transform,
		align,
		color,
		decoration,
		lineHeight,
		whiteSpace,
	});
	return (
		<span
			className={cn(classes, truncate && "truncate", className)}
			style={
				clamped
					? ({
							overflow: "hidden",
							display: "-webkit-box",
							WebkitBoxOrient: "vertical",
							WebkitLineClamp: clamped,
						} as React.CSSProperties)
					: {}
			}
			{...props}
		>
			{children}
		</span>
	);
};
