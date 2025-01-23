"use client";
import { useTheme } from "next-themes";
import Image from "next/image";

export const SkeletonThree = () => {
	const { resolvedTheme } = useTheme();
	return (
		<div className="h-full w-full sm:w-[100%] mx-auto bg-white dark:bg-background-darkSecondary shadow-2xl dark:shadow-white/40 mt-10 group rounded-md">
			<div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white dark:from-background dark:via-background to-transparent w-full pointer-events-none z-[11]" />
			<Image
				src={`/newTask-${resolvedTheme || 'dark'}.png`}
				width={559}
				height={465}
				alt='new-task'
			/>
		</div>
	);
};
