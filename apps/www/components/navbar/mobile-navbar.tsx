"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
	AnimatePresence,
	motion,
	useMotionValueEvent,
	useScroll,
} from "framer-motion";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "../Logo";
import { ModeToggle } from "../mode-toggle";

export const MobileNavbar = ({
	navItems,
}: {
	navItems: { title: string; link: string }[];
}) => {
	const { scrollY } = useScroll();
	const [showBackground, setShowBackground] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useMotionValueEvent(scrollY, "change", (value) => {
		setShowBackground(value > 100);
	});

	return (
		<div
			className={cn(
				"flex justify-between bg-background/80 backdrop-blur-md items-center w-full rounded-full px-4 py-1.5 transition duration-200",
				showBackground &&
					"bg-background/80 shadow-[0px_-2px_0px_0px_var(--neutral-100),0px_2px_0px_0px_var(--neutral-100)] dark:shadow-[0px_-2px_0px_0px_var(--neutral-800),0px_2px_0px_0px_var(--neutral-800)]",
			)}
		>
			<Logo />
			<div className="flex items-center space-x-2">
				<ModeToggle />
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon">
							<Menu className="h-6 w-6" />
							<span className="sr-only">Toggle menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
						<AnimatePresence>
							{isOpen && (
								<motion.div
									initial={{ x: "100%" }}
									animate={{ x: 0 }}
									exit={{ x: "100%" }}
									transition={{
										type: "tween",
										ease: "easeInOut",
										duration: 0.3,
									}}
									className="h-full bg-background p-6"
								>
									<div className="flex flex-col h-full">
										<div className="flex items-center justify-between mb-8">
											<Logo />
										</div>
										<nav className="flex flex-col gap-4 mb-8">
											{navItems.map((item) => (
												<Link
													key={item.link}
													href={item.link}
													className="text-lg font-medium hover:text-primary transition-colors"
													onClick={() => setIsOpen(false)}
												>
													{item.title}
												</Link>
											))}
										</nav>
										<div className="mt-auto space-y-4">
											<Button className="w-full" asChild>
												<Link
													href={`${process.env.NEXT_PUBLIC_APP_URL}/register`}
													onClick={() => setIsOpen(false)}
												>
													Sign Up
												</Link>
											</Button>
											<Button className="w-full" variant="outline" asChild>
												<Link
													href={`${process.env.NEXT_PUBLIC_APP_URL}/login`}
													onClick={() => setIsOpen(false)}
												>
													Login
												</Link>
											</Button>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
};
