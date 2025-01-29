import { cn } from "@/lib/utils";
import type { AnimationProps, MotionProps } from "framer-motion";
import type React from "react";
import Balancer from "react-wrap-balancer";

import type { JSX } from "react";

export const Heading = ({
	className,
	as: Tag = "h2",
	children,
	size = "md",
}: {
	className?: string;
	as?: keyof JSX.IntrinsicElements;
	children: React.ReactNode;
	size?: "sm" | "md" | "xl" | "2xl";
} & MotionProps &
	React.HTMLAttributes<HTMLHeadingElement | AnimationProps>) => {
	const sizeVariants = {
		sm: "text-xl md:text-2xl md:leading-snug",
		md: "text-3xl md:text-5xl md:leading-tight",
		xl: "text-4xl md:text-6xl md:leading-none",
		"2xl": "text-5xl md:text-7xl md:leading-none",
	};
	return (
		<Tag
			className={cn(
				"text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight",
				"font-medium",
				"text-black dark:text-white",
				sizeVariants[size],
				className,
			)}
		>
			<Balancer>{children}</Balancer>
		</Tag>
	);
};
