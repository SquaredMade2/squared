import { cn } from "@squared/ui/cn";
import type { NODES } from "@squared/ui/primitive";
import {
	type ResponsiveProps,
	createResponsiveComponent,
	getColorVariants,
	getDimensionVariants,
	getSizeVariants,
} from "@squared/ui/responsive";
import { type VariantProps, cva } from "class-variance-authority";
import React from "react";

const boxVariants = cva("", {
	variants: {
		padding: getSizeVariants("p"),
		paddingX: getSizeVariants("px"),
		paddingY: getSizeVariants("py"),
		paddingTop: getSizeVariants("pt"),
		paddingBottom: getSizeVariants("pb"),
		paddingLeft: getSizeVariants("pl"),
		paddingRight: getSizeVariants("pr"),
		top: getSizeVariants("top"),
		bottom: getSizeVariants("bottom"),
		left: getSizeVariants("left"),
		right: getSizeVariants("right"),
		zIndex: getSizeVariants("z"),
		margin: { ...getSizeVariants("m"), auto: "m-auto" },
		marginX: { ...getSizeVariants("mx"), auto: "mx-auto" },
		marginY: { ...getSizeVariants("my"), auto: "my-auto" },
		marginTop: { ...getSizeVariants("mt"), auto: "mt-auto" },
		marginBottom: { ...getSizeVariants("mb"), auto: "mb-auto" },
		marginLeft: { ...getSizeVariants("ml"), auto: "ml-auto" },
		marginRight: { ...getSizeVariants("mr"), auto: "mr-auto" },
		display: {
			block: "block",
			inline: "inline",
			"inline-block": "inline-block",
			flex: "flex",
			"inline-flex": "inline-flex",
			grid: "grid",
			"inline-grid": "inline-grid",
		},
		flexDirection: {
			row: "flex-row",
			"row-reverse": "flex-row-reverse",
			col: "flex-col",
			"col-reverse": "flex-col-reverse",
		},
		flexWrap: {
			nowrap: "flex-nowrap",
			wrap: "flex-wrap",
			"wrap-reverse": "flex-wrap-reverse",
		},
		flexShrink: {
			true: "shrink",
			false: "shrink-0",
		},
		flexGrow: {
			true: "grow",
			false: "grow-0",
		},
		alignItems: {
			start: "items-start",
			end: "items-end",
			center: "items-center",
			baseline: "items-baseline",
			stretch: "items-stretch",
		},
		justifyContent: {
			start: "justify-start",
			end: "justify-end",
			center: "justify-center",
			between: "justify-between",
			around: "justify-around",
			evenly: "justify-evenly",
		},
		textAlign: {
			left: "text-left",
			center: "text-center",
			right: "text-right",
			justify: "text-justify",
		},
		border: {
			true: "border",
			false: "border-0",
		},
		borderTop: {
			true: "border-t",
			false: "border-t-0",
		},
		borderBottom: {
			true: "border-b",
			false: "border-b-0",
		},
		borderLeft: {
			true: "border-l",
			false: "border-l-0",
		},
		borderRight: {
			true: "border-r",
			false: "border-r-0",
		},
		borderColor: getColorVariants("border"),
		borderRadius: {
			none: "rounded-none",
			sm: "rounded-sm",
			md: "rounded-md",
			lg: "rounded-lg",
			xl: "rounded-xl",
			"2xl": "rounded-2xl",
			"3xl": "rounded-3xl",
			full: "rounded-full",
		},
		background: getColorVariants("bg"),
		boxShadow: {
			sm: "shadow-xs",
			md: "shadow-md",
			lg: "shadow-lg",
			xl: "shadow-xl",
			"2xl": "shadow-2xl",
			inner: "shadow-inner",
			none: "shadow-none",
		},
		height: getDimensionVariants("h"),
		width: getDimensionVariants("w"),
		position: {
			static: "static",
			relative: "relative",
			absolute: "absolute",
			fixed: "fixed",
			sticky: "sticky",
		},
		cursor: {
			auto: "cursor-auto",
			default: "cursor-default",
			pointer: "cursor-pointer",
			wait: "cursor-wait",
			text: "cursor-text",
			move: "cursor-move",
			"not-allowed": "cursor-not-allowed",
		},
		pointerEvents: {
			auto: "pointer-events-auto",
			none: "pointer-events-none",
		},
		overflow: {
			auto: "overflow-auto",
			hidden: "overflow-hidden",
			visible: "overflow-visible",
			scroll: "overflow-scroll",
		},
		overflowX: {
			auto: "overflow-x-auto",
			hidden: "overflow-x-hidden",
			visible: "overflow-x-visible",
			scroll: "overflow-x-scroll",
		},
		overflowY: {
			auto: "overflow-y-auto",
			hidden: "overflow-y-hidden",
			visible: "overflow-y-visible",
			scroll: "overflow-y-scroll",
		},
		maxHeight: getDimensionVariants("max-h"),
		minHeight: getDimensionVariants("min-h"),
		maxWidth: getDimensionVariants("max-w"),
		minWidth: getDimensionVariants("min-w"),
		gap: getSizeVariants("gap"),
		gapX: getSizeVariants("gap-x"),
		gapY: getSizeVariants("gap-y"),
		spaceX: getSizeVariants("space-x"),
		spaceY: getSizeVariants("space-y"),
		container: {
			true: "container",
			false: "",
		},
		hidden: {
			true: "hidden",
			false: "",
		},
	},
});

type BoxVariants = VariantProps<typeof boxVariants>;

const { createResponsive: createResponsiveBox } =
	createResponsiveComponent(boxVariants);
interface BoxProps extends ResponsiveProps<BoxVariants> {
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	as?: (typeof NODES)[number];
}

function Box({
	children,
	className = "",
	as = "div",
	style,
	...props
}: BoxProps) {
	const classes = createResponsiveBox(props);
	return React.createElement(
		as,
		{ className: cn(classes, className), style },
		children,
	);
}

export { Box, boxVariants };
export type { BoxProps, BoxVariants };
