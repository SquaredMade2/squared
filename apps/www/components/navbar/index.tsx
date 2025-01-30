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
			className="fixed inset-x-0 top-4 z-50 mx-auto w-[95%] max-w-7xl lg:w-full"
		>
			<div className="hidden w-full lg:block">
				<DesktopNavbar navItems={navItems} />
			</div>
			<div className="flex h-full w-full items-center lg:hidden ">
				<MobileNavbar navItems={navItems} />
			</div>
		</motion.nav>
	);
}
