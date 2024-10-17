import { Link } from "next-view-transitions";
import SquaredLogoDark from "./SVG/squared-logo-dark";

export const Logo = () => {
	return (
		<Link
			href="/"
			className="font-normal flex space-x-2 items-center text-sm mr-4 justify-center text-black px-2 py-1 relative z-20"
		>
			<SquaredLogoDark />

			<span className="font-medium text-black dark:text-white">Squared</span>
		</Link>
	);
};
