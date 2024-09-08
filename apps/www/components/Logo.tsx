"use client";
import { Link } from "next-view-transitions";
import SquaredLogoDark from "./SVG/squared-logo-dark";
import SquaredLogoLight from "./SVG/squared-logo-light";
import React from "react";
import { useTheme } from "next-themes";

export const Logo = () => {
	const { theme } = useTheme();
	return (
		<Link
			href="/"
			className="font-normal flex space-x-2 items-center text-sm mr-4 justify-center text-black px-2 py-1 relative z-20"
		>
			{/* <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm" /> */}
			{theme === "dark" ? <SquaredLogoDark /> : <SquaredLogoLight />}

			<span className="font-medium text-black dark:text-white">Squared</span>
		</Link>
	);
};
