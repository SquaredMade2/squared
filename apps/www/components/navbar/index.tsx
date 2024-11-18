"use client";

import { motion } from "framer-motion";
import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";

const navItems = [
	{
		title: "Pricing",
		link: "/pricing",
	},
	{
		title: "Contact",
		link: "/contact",
	},
	{
		title: "Docs",
		link: "/docs",
	},
];

export function NavBar() {
	return (
		<motion.nav
			initial={{
				y: -80,
			}}
			animate={{
				y: 0,
			}}
			transition={{
				ease: [0.6, 0.05, 0.1, 0.9],
				duration: 0.8,
			}}
			className="fixed max-md:top-4 inset-x-0 z-50 w-[95%] max-w-7xl mx-auto"
		>
			<div className="hidden lg:block w-full">
				<DesktopNavbar navItems={navItems} />
			</div>
			<div className="lg:hidden w-full">
				<MobileNavbar navItems={navItems} />
			</div>
		</motion.nav>
	);
}
