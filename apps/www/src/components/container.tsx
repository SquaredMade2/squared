import { cn } from "@squaredmade/ui/cn";

export const Container = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className={cn("mx-auto max-w-7xl px-4 ", className)}>{children}</div>
	);
};
