"use client";

import { Moon } from "@squaredmade/icons";
import { IconSunLow } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import React from "react";

export function ModeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	const [isClient, setIsClient] = React.useState(false);

	React.useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		isClient && (
			// biome-ignore lint/a11y/useButtonType: Came with template
			<button
				className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg outline-hidden hover:bg-neutral focus:outline-hidden focus:ring-0 active:outline-hidden active:ring-0 dark:hover:bg-background-navBarHover"
				onClick={() => {
					resolvedTheme === "dark" ? setTheme("light") : setTheme("dark");
				}}
			>
				{resolvedTheme === "light" && (
					<motion.div
						animate={{
							opacity: 1,
							x: 0,
						}}
						initial={{
							opacity: 0,
							x: 40,
						}}
						key={resolvedTheme}
						transition={{
							duration: 0.3,
							ease: "easeOut",
						}}
					>
						<IconSunLow className="h-4 w-4 shrink-0 text-neutral-inverted-accent" />
					</motion.div>
				)}

				{resolvedTheme === "dark" && (
					<motion.div
						animate={{
							opacity: 1,
							x: 0,
						}}
						initial={{
							opacity: 0,
							x: 40,
						}}
						key={resolvedTheme}
						transition={{
							duration: 0.3,
							ease: "easeOut",
						}}
					>
						<Moon className="h-4 w-4 shrink-0 text-neutral-inverted-accent" />
					</motion.div>
				)}

				<span className="sr-only">Toggle theme</span>
			</button>
		)
	);
}
