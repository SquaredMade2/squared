import { cn } from "@squaredmade/ui/cn";
import { Link } from "next-view-transitions";
import SquaredLogoDark from "./SVG/squared-logo-dark";

export const Logo = ({ className }: { className?: string }) => {
	return (
		<Link
			href="/"
			className={cn(
				"relative z-20 mr-4 flex items-center justify-center space-x-2 px-2 py-1 font-normal text-sm",
				className,
			)}
		>
			<SquaredLogoDark />

			<span className="font-medium text-foreground">Squared</span>
		</Link>
	);
};
