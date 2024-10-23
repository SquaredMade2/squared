"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { MoonIcon } from "lucide-react";
import { IconSunLow } from "@tabler/icons-react";
import { motion } from "framer-motion";

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
				className="w-10 h-10 flex hover:bg-gray-50 dark:hover:bg-background-navBarHover rounded-lg items-center justify-center outline-none focus:ring-0 focus:outline-none active:ring-0 active:outline-none overflow-hidden"
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
						<IconSunLow className="h-4 w-4 flex-shrink-0  dark:text-neutral-500 text-neutral-700" />
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
						<MoonIcon className="h-4 w-4   flex-shrink-0  dark:text-neutral-500 text-neutral-700" />
					</motion.div>
				)}

				<span className="sr-only">Toggle theme</span>
			</button>
		)
	);
}
