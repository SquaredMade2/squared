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
					"bg-neutral-50 shadow-[0px_-2px_0px_0px_var(--neutral-100),0px_2px_0px_0px_var(--neutral-100)] dark:bg-background-darkSecondary dark:shadow-[0px_-2px_0px_0px_var(--neutral-800),0px_2px_0px_0px_var(--neutral-800)]",
			)}
		>
			<AnimatePresence>
				{showBackground && (
					<motion.div
						key={String(showBackground)}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							duration: 1,
						}}
						className="pointer-events-none absolute inset-0 h-full w-full rounded-3xl bg-neutral-100 [mask-image:linear-gradient(to_bottom,white,transparent,white)] dark:bg-background-darkSecondary"
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
					variant="simple"
					as={Link}
					href={`${process.env.NEXT_PUBLIC_APP_URL}/sign-in`}
				>
					Login
				</Button>
				<Button as={Link} href={`${process.env.NEXT_PUBLIC_APP_URL}/sign-up`}>
					Sign Up
				</Button>
			</div>
		</div>
	);
};
