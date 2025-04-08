import { cn } from "@squaredmade/ui/cn";
import type { AnimationProps, MotionProps } from "framer-motion";
import type React from "react";
import Balancer from "react-wrap-balancer";

import type { JSX } from "react";

export const Subheading = ({
	className,
	as: Tag = "h2",
	children,
}: {
	className?: string;
	as?: keyof JSX.IntrinsicElements;
	children: React.ReactNode;
} & MotionProps &
	React.HTMLAttributes<HTMLHeadingElement | AnimationProps>) => {
	return (
		<Tag
			className={cn(
				"mx-auto my-4 max-w-4xl text-left text-sm md:text-base",
				"text-center font-normal text-muted-foreground",
				className,
			)}
		>
			<Balancer>{children}</Balancer>
		</Tag>
	);
};
