import { cn } from "@/lib/utils";
import type { AnimationProps, MotionProps } from "framer-motion";
import type React from "react";
import Balancer from "react-wrap-balancer";

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
				"text-sm md:text-base  max-w-4xl text-left my-4 mx-auto",
				"text-muted-foreground text-center font-normal",
				className,
			)}
		>
			<Balancer>{children}</Balancer>
		</Tag>
	);
};
