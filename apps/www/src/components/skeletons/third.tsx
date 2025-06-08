"use client";
import { useTheme } from "next-themes";
import Image from "next/image";

export const SkeletonThree = () => {
	const { resolvedTheme } = useTheme();
	return (
		<div className="group mx-auto mt-10 h-full w-full rounded-md bg-background shadow-2xl sm:w-[100%] dark:bg-background-dark-secondary dark:shadow-foreground/40">
			<div className="pointer-events-none absolute inset-x-0 bottom-0 z-11 h-40 w-full bg-linear-to-t from-background via-background to-transparent" />
			<Image
				src={`/newTask-${resolvedTheme || "dark"}.png`}
				width={559}
				height={465}
				alt="new-task"
			/>
		</div>
	);
};
