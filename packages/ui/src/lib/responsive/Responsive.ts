import type { VariantProps, cva } from "class-variance-authority";

/**
 * Represents the available color shades.
 */
type ColorShade =
	| "50"
	| "100"
	| "200"
	| "300"
	| "400"
	| "500"
	| "600"
	| "700"
	| "800"
	| "900"
	| "950";

/**
 * Represents the base colors available in the design system.
 */
type BaseColor =
	| "primary"
	| "secondary"
	| "accent"
	| "background"
	| "foreground"
	| "zinc"
	| "slate"
	| "stone"
	| "gray"
	| "neutral"
	| "destructive";

/**
 * Represents all available colors, including base colors and their shades.
 */
type Color =
	| BaseColor
	| `${Extract<BaseColor, "zinc" | "slate" | "stone" | "gray" | "neutral">}-${ColorShade}`;

/**
 * Represents the available size values.
 */
type Size =
	| 0
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8
	| 9
	| 10
	| 12
	| 16
	| 20
	| 24
	| 28
	| 32;

/**
 * Represents a value that can be responsive (i.e., different for each breakpoint).
 * @template T The type of the value.
 */
type ResponsiveValue<T> = T | [T, T] | [T, T, T] | [T, T, T, T];

/**
 * Array of breakpoint prefixes used for responsive classes.
 */
const breakpoints = ["", "sm:", "md:", "lg:"];

/**
 * Creates responsive classes based on the given prefix and value.
 */
const createResponsiveClasses = <T extends string | number>(
	prefix: string,
	value: ResponsiveValue<T>,
): string[] => {
	if (Array.isArray(value)) {
		return value
			.map((v, i) => (v !== undefined ? `${breakpoints[i]}${prefix}-${v}` : ""))
			.filter(Boolean);
	}
	return [`${prefix}-${value}`];
};

/**
 * Generates size variants for a given type.
 */
const getSizeVariants = (type: string): Record<Size, string> => {
	return Object.fromEntries(
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 20, 24, 28, 32].map((size) => [
			size,
			`${type}-${size}`,
		]),
	) as Record<Size, string>;
};

/**
 * Generates color variants for a given type.
 */
const getColorVariants = (type: string): Record<Color, string> => {
	const baseColors: Record<BaseColor, string> = {
		primary: `${type}-primary`,
		secondary: `${type}-secondary`,
		accent: `${type}-accent`,
		background: `${type}-background`,
		foreground: `${type}-foreground`,
		zinc: `${type}-zinc`,
		slate: `${type}-slate`,
		stone: `${type}-stone`,
		gray: `${type}-gray`,
		neutral: `${type}-neutral`,
		destructive: `${type}-destructive`,
	};

	const shadeColors: Record<Color, string> = Object.fromEntries(
		["zinc", "slate", "stone", "gray", "neutral"].flatMap((color) =>
			[
				"50",
				"100",
				"200",
				"300",
				"400",
				"500",
				"600",
				"700",
				"800",
				"900",
				"950",
			].map((shade) => [`${color}-${shade}`, `${type}-${color}-${shade}`]),
		),
	) as Record<Color, string>;

	return { ...baseColors, ...shadeColors };
};

/**
 * Generates dimension variants for a given type.
 */
const getDimensionVariants = (type: string): Record<string, string> => {
	const sizeVariants = getSizeVariants(type);
	const fractionVariants: Record<string, string> = {
		"1/2": `${type}-1/2`,
		"1/3": `${type}-1/3`,
		"2/3": `${type}-2/3`,
		"1/4": `${type}-1/4`,
		"2/4": `${type}-2/4`,
		"3/4": `${type}-3/4`,
		"1/5": `${type}-1/5`,
		"2/5": `${type}-2/5`,
		"3/5": `${type}-3/5`,
		"4/5": `${type}-4/5`,
		"1/6": `${type}-1/6`,
		"2/6": `${type}-2/6`,
		"3/6": `${type}-3/6`,
		"4/6": `${type}-4/6`,
		"5/6": `${type}-5/6`,
		"1/12": `${type}-1/12`,
		"2/12": `${type}-2/12`,
		"3/12": `${type}-3/12`,
		"4/12": `${type}-4/12`,
		"5/12": `${type}-5/12`,
		"6/12": `${type}-6/12`,
		"7/12": `${type}-7/12`,
		"8/12": `${type}-8/12`,
		"9/12": `${type}-9/12`,
		"10/12": `${type}-10/12`,
		"11/12": `${type}-11/12`,
	};
	const specialVariants: Record<string, string> = {
		auto: `${type}-auto`,
		full: `${type}-full`,
		screen: `${type}-screen`,
		min: `${type}-min`,
		max: `${type}-max`,
		fit: `${type}-fit`,
	};
	return { ...sizeVariants, ...fractionVariants, ...specialVariants };
};

/**
 * Makes all properties of T responsive.
 */
type ResponsiveProps<T> = {
	[K in keyof T]: ResponsiveValue<T[K]>;
};

/**
 * Creates responsive variants based on the given cva variants and props.
 */
function createResponsiveVariants<T extends Record<string, unknown>>(
	variants: ReturnType<typeof cva>,
	props: ResponsiveProps<T>,
): string {
	const baseProps: Partial<T> = {};
	const responsiveClasses: string[] = [];

	// Get default classes
	const defaultClasses = variants({}).split(" ");

	Object.entries(props).forEach(([key, value]) => {
		if (value !== undefined) {
			if (Array.isArray(value)) {
				value.forEach((v, index) => {
					if (v !== undefined) {
						const variantClasses = variants({ [key]: v }).split(" ");
						const nonDefaultClasses = variantClasses.filter(
							(cls) => !defaultClasses.includes(cls),
						);
						const prefixedClasses = nonDefaultClasses.map((cls) =>
							index === 0 ? cls : `${breakpoints[index]}${cls}`,
						);
						responsiveClasses.push(...prefixedClasses);
					}
				});
			} else {
				baseProps[key as keyof T] = value;
			}
		}
	});

	const baseVariantClasses = variants(baseProps)
		.split(" ")
		.filter((cls) => !defaultClasses.includes(cls));
	const uniqueClasses = Array.from(
		new Set([...defaultClasses, ...baseVariantClasses, ...responsiveClasses]),
	);
	return uniqueClasses.join(" ").trim();
}

/**
 * Creates a responsive component based on the given cva variants.
 */
function createResponsiveComponent<T extends ReturnType<typeof cva>>(
	variants: T,
) {
	type ComponentVariants = VariantProps<T>;
	type ResponsiveComponentProps = ResponsiveProps<ComponentVariants>;

	return {
		createResponsive: (props: ResponsiveComponentProps) =>
			createResponsiveVariants(variants, props),
	};
}

export {
	createResponsiveClasses,
	getSizeVariants,
	getColorVariants,
	getDimensionVariants,
	createResponsiveComponent,
	createResponsiveVariants,
};
export type { Color, ColorShade, Size, ResponsiveValue, ResponsiveProps };
