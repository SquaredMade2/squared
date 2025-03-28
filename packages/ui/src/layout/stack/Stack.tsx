import type { BoxVariants } from "@squared/ui/box";
import { cn } from "@squared/ui/cn";
import {
	type ResponsiveProps,
	createResponsiveComponent,
	getSizeVariants,
} from "@squared/ui/responsive";
import { type VariantProps, cva } from "class-variance-authority";

const stackVariants = cva("flex flex-col", {
	variants: {
		gap: getSizeVariants("gap"),
	},
	defaultVariants: {
		gap: 1,
	},
});

type StackVariants = VariantProps<typeof stackVariants>;
type ResponsiveStackProps = ResponsiveProps<StackVariants>;

const { createResponsive } = createResponsiveComponent(stackVariants);

interface StackProps extends ResponsiveStackProps {
	children: React.ReactNode;
	className?: BoxVariants;
}

const Stack = ({ children, gap, className }: StackProps) => {
	const classes = createResponsive({ gap });
	return <div className={cn(classes, className)}>{children}</div>;
};

export { Stack, stackVariants };
export type { StackProps };
