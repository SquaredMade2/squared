"use client";
import { Menu, X } from "@squaredmade/icons";
import { cn } from "@squaredmade/ui/cn";
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
				"flex w-full items-center justify-between rounded-full bg-background px-2.5 py-1.5 transition duration-200",
				showBackground &&
					"bg-neutral shadow-[0px_-2px_0px_0px_var(--color-neutral-secondary),0px_2px_0px_0px_var(--color-neutral-secondary)] dark:bg-background",
			)}
		>
			<Logo />
			<button type="button" onClick={() => setOpen(!open)}>
				<Menu className="h-6 w-6 text-foreground" />
			</button>
			{open && (
				<div className="fixed inset-0 z-50 flex flex-col items-start justify-start space-y-10 bg-background pt-5 text-xl transition duration-200">
					<div className="flex w-full items-center justify-between px-5">
						<Logo />
						<div className="flex items-center space-x-2">
							<ModeToggle />
							<button type="button" onClick={() => setOpen(!open)}>
								<X className="h-8 w-8 text-foreground" />
							</button>
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
									<span className="block text-[26px] text-foreground">
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
