"use client";
import { cn } from "@/lib/utils";
import { Menu, X } from "@squaredmade/icons";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { Link } from "next-view-transitions";
import { useState } from "react";
import { Logo } from "../Logo";
import { Button } from "../button";
import { ModeToggle } from "../mode-toggle";

export const MobileNavbar = ({
	navItems,
}: {
	navItems: { title: string; link: string }[];
}) => {
	const [open, setOpen] = useState(false);

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
				"flex w-full items-center justify-between rounded-full bg-white px-2.5 py-1.5 transition duration-200 dark:bg-neutral-900",
				showBackground &&
					"bg-neutral-50 shadow-[0px_-2px_0px_0px_var(--neutral-100),0px_2px_0px_0px_var(--neutral-100)] dark:bg-neutral-900 dark:shadow-[0px_-2px_0px_0px_var(--neutral-800),0px_2px_0px_0px_var(--neutral-800)]",
			)}
		>
			<Logo />
			<Menu
				className="h-6 w-6 text-black dark:text-white"
				onClick={() => setOpen(!open)}
			/>
			{open && (
				<div className="fixed inset-0 z-50 flex flex-col items-start justify-start space-y-10 bg-white pt-5 text-xl text-zinc-600 transition duration-200 hover:text-zinc-800 dark:bg-black">
					<div className="flex w-full items-center justify-between px-5">
						<Logo />
						<div className="flex items-center space-x-2">
							<ModeToggle />
							<X
								className="h-8 w-8 text-black dark:text-white"
								onClick={() => setOpen(!open)}
							/>
						</div>
					</div>
					<div className="flex flex-col items-start justify-start gap-[14px] px-8">
						{navItems.map((navItem) => (
							<>
								<Link
									key={`link=${navItem.link}`}
									href={navItem.link}
									onClick={() => setOpen(false)}
									className="relative"
								>
									<span className="block text-[26px] text-black dark:text-white">
										{navItem.title}
									</span>
								</Link>
							</>
						))}
					</div>
					<div className="flex w-full flex-row items-start gap-2.5 px-8 py-4 ">
						<Button
							as={Link}
							href={`${process.env.NEXT_PUBLIC_APP_URL}/sign-up`}
						>
							Sign Up
						</Button>
						<Button
							variant="simple"
							as={Link}
							href={`${process.env.NEXT_PUBLIC_APP_URL}/sign-in`}
						>
							Login
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};
