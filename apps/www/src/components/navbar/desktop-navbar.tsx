"use client";

import { cn } from "@squaredmade/ui/cn";
import {
	AnimatePresence,
	motion,
	useMotionValueEvent,
	useScroll,
} from "framer-motion";
import { Link } from "next-view-transitions";
import { useState } from "react";
import { config } from "@/config";
import { Button } from "../button";
import { Logo } from "../Logo";
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
		if (value > 100) {
			setShowBackground(true);
		} else {
			setShowBackground(false);
		}
	});
	return (
		<div
			className={cn(
				"relative flex w-full justify-between rounded-3xl bg-transparent px-4 py-2 transition duration-200",
				showBackground &&
					"bg-neutral shadow-[0px_-2px_0px_0px_var(--color-neutral-secondary),0px_2px_0px_0px_var(--color-neutral-secondary)] dark:bg-background-dark-secondary",
			)}
		>
			<AnimatePresence>
				{showBackground && (
					<motion.div
						animate={{ opacity: 1 }}
						className="pointer-events-none absolute inset-0 h-full w-full rounded-3xl bg-neutral-secondary [mask-image:linear-gradient(to_bottom,white,transparent,white)] dark:bg-background-dark-secondary"
						initial={{ opacity: 0 }}
						key={String(showBackground)}
						transition={{
							duration: 1,
						}}
					/>
				)}
			</AnimatePresence>
			<div className="flex flex-row items-center gap-2">
				<Logo />
				<div className="flex items-center gap-1.5">
					{navItems.map((item) => (
						<NavBarItem href={item.link} key={item.title} target={item.target}>
							{item.title}
						</NavBarItem>
					))}
				</div>
			</div>
			<div className="flex items-center space-x-2">
				<ModeToggle />
				<Button
					as={Link}
					href={`${config.NEXT_PUBLIC_APP_URL}/sign-in`}
					variant="simple"
				>
					Login
				</Button>
				<Button as={Link} href={`${config.NEXT_PUBLIC_APP_URL}/sign-up`}>
					Sign Up
				</Button>
			</div>
		</div>
	);
};
