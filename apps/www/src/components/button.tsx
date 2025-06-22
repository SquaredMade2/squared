import { cn } from "@squaredmade/ui/cn";
import type React from "react";

export const Button: React.FC<{
	children?: React.ReactNode;
	className?: string;
	variant?: "simple" | "outline" | "primary";
	as?: React.ElementType;
	// biome-ignore lint/suspicious/noExplicitAny: <Came with Template>
	[x: string]: any;
}> = ({
	children,
	className,
	variant = "primary",
	as: Tag = "button",
	...props
}) => {
	let variantClass = "";
	if (variant === "simple") {
		variantClass =
			"bg-transparent hover:bg-neutral-secondary border border-transparent text-foreground transition duration-200 dark:hover:bg-background-nav-bar-hover dark:hover:shadow-xl";
	} else if (variant === "outline") {
		variantClass =
			"bg-white hover:bg-black/90 hover:shadow-xl text-black border border-black hover:text-white transition duration-200";
	} else if (variant === "primary") {
		variantClass =
			"bg-background-dark-secondary hover:bg-neutral-inverted-accent dark:hover:bg-background-nav-bar-hover/90  border border-transparent text-white transition duration-200 shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset]";
	}
	return (
		<Tag
			className={cn(
				"relative z-10 flex items-center justify-center rounded-full px-4 py-2 font-medium text-sm transition duration-200",
				variantClass,
				className,
			)}
			// style={{
			//   boxShadow:
			//     "0px -1px 0px 0px #FFFFFF40 inset, 0px 1px 0px 0px #FFFFFF40 inset",
			// }}
			{...props}
		>
			{/* biome-ignore lint/style/noUnusedTemplateLiteral: Came with template */}
			{children ?? `Get Started`}
		</Tag>
	);
};
