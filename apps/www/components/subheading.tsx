import { cn } from "@/lib/utils";
import type { AnimationProps, MotionProps } from "framer-motion";
import type { HTMLAttributes, JSX, ReactNode } from "react";
import Balancer from "react-wrap-balancer";

export const Subheading = ({
	className,
	as: Tag = "h2",
	children,
}: {
	className?: string;
	as?: keyof JSX.IntrinsicElements;
	children: ReactNode;
} & MotionProps &
	HTMLAttributes<HTMLHeadingElement | AnimationProps>) => {
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
