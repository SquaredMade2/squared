"use client";

import { cn } from "@/lib/utils";
import {
	AnimatePresence,
	motion,
	useMotionValueEvent,
	useScroll,
} from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "../Logo";
import { Button } from "../button";
import { ModeToggle } from "../mode-toggle";
import { NavBarItem } from "./navbar-item";

type Props = {
	navItems: {
		link: string;
		title: string;
		target?: "_blank";
	}[];
};

export const DesktopNavbar = ({ navItems }: Props) => {
	const { scrollY } = useScroll();
	const [showBackground, setShowBackground] = useState(false);

	useMotionValueEvent(scrollY, "change", (value) => {
		setShowBackground(value > 100);
	});

	return (
		<div
			className={cn(
				"w-full flex relative justify-between px-4 py-2 rounded-3xl transition duration-200",
				showBackground && "bg-background/40 backdrop-blur-md shadow-sm",
			)}
		>
			<div className="max-w-7xl flex w-full justify-between mx-auto bg-transparent">
				<AnimatePresence>
					{showBackground && (
						<motion.div
							key="background"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="absolute inset-0 h-full w-full bg-background/50 backdrop-blur-md pointer-events-none rounded-3xl"
						/>
					)}
				</AnimatePresence>
				<div className="flex flex-row gap-2 items-center z-10">
					<Logo />
					<div className="flex items-center gap-1.5">
						{navItems.map((item) => (
							<NavBarItem
								href={item.link}
								key={item.title}
								target={item.target}
							>
								{item.title}
							</NavBarItem>
						))}
					</div>
				</div>
				<div className="flex space-x-2 items-center z-10">
					<ModeToggle />
					<Button
						variant="simple"
						as={Link}
						href={`${process.env.NEXT_PUBLIC_APP_URL}/login`}
					>
						Login
					</Button>
					<Button
						as={Link}
						href={`${process.env.NEXT_PUBLIC_APP_URL}/register`}
					>
						Sign Up
					</Button>
				</div>
			</div>
		</div>
	);
};
