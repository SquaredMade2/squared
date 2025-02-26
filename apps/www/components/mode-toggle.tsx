"use client";

import { Moon } from "@squared/icons";
import { IconSunLow } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import * as React from "react";

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
				onClick={() => {
					resolvedTheme === "dark" ? setTheme("light") : setTheme("dark");
				}}
				className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg outline-none hover:bg-gray-50 focus:outline-none focus:ring-0 active:outline-none active:ring-0 dark:hover:bg-background-navBarHover"
			>
				{resolvedTheme === "light" && (
					<motion.div
						key={resolvedTheme}
						initial={{
							x: 40,
							opacity: 0,
						}}
						animate={{
							x: 0,
							opacity: 1,
						}}
						transition={{
							duration: 0.3,
							ease: "easeOut",
						}}
					>
						<IconSunLow className="h-4 w-4 flex-shrink-0 text-neutral-700 dark:text-neutral-500" />
					</motion.div>
				)}

				{resolvedTheme === "dark" && (
					<motion.div
						key={resolvedTheme}
						initial={{
							x: 40,
							opacity: 0,
						}}
						animate={{
							x: 0,
							opacity: 1,
						}}
						transition={{
							ease: "easeOut",
							duration: 0.3,
						}}
					>
						<Moon className="h-4 w-4 flex-shrink-0 text-neutral-700 dark:text-neutral-500" />
					</motion.div>
				)}

				<span className="sr-only">Toggle theme</span>
			</button>
		)
	);
}
