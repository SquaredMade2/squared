import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";
import SquaredLogoDark from "./SVG/squared-logo-dark";

export const Logo = ({ className }: { className?: string }) => {
	return (
		<Link
			href="/"
			className={cn(
				"font-normal flex space-x-2 items-center text-sm mr-4 justify-center text-black px-2 py-1 relative z-20",
				className,
			)}
		>
			<SquaredLogoDark />

			<span className="font-medium text-black dark:text-white">Squared</span>
		</Link>
	);
};
