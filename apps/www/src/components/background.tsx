"use client";
import { cn } from "@squaredmade/ui/cn";
import { motion } from "framer-motion";
import { useId } from "react";

export const Background = () => {
	return (
		<div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
			<div className="pointer-events-none absolute inset-0 h-full w-full bg-background [mask-image:radial-gradient(ellipse_at_center,transparent,white)]" />
			{Array.from({ length: 6 }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <Came with template>
				// biome-ignore lint/style/useTemplate: <Came with template>
				<div className="flex" key={"grid-column" + index}>
					{Array.from({ length: 10 }).map((__, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <Came with template>
						// biome-ignore lint/style/noUnusedTemplateLiteral: <Came with template>
						// biome-ignore lint/style/useTemplate: <Came with template>
						<GridBlock key={`grid-row` + i} />
					))}
				</div>
			))}
		</div>
	);
};

const GridBlock = () => {
	return (
		<div className="flex w-60 flex-col items-start justify-center">
			<div className="flex items-center justify-center">
				<Dot />
				<SVG />
				{/* <Dot /> */}
			</div>
			<SVGVertical className="ml-3" />
		</div>
	);
};

const Dot = () => {
	return (
		<div className="flex h-6 w-6 items-center justify-center rounded-full bg-background dark:bg-neutral">
			<div className="h-2 w-2 rounded-full bg-neutral-accent" />
		</div>
	);
};

const SVGVertical = ({ className }: { className?: string }) => {
	const width = 1;
	const height = 140;

	const id = useId();
	return (
		<motion.svg
			className={cn("text-neutral-secondary", className)}
			fill="none"
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			width={width}
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Vertical Line</title>
			<path d="M0.5 0.5V479" stroke="currentColor" strokeWidth={2} />
			<motion.path
				d="M0.5 0.5V479"
				stroke={`url(#gradient-${id})`}
				strokeWidth={2}
			/>

			<defs>
				<motion.linearGradient
					animate={{ x1: 2, x2: 2, y1: 400, y2: 600 }}
					gradientUnits="userSpaceOnUse"
					id={`gradient-${id}`}
					initial={{ x1: 2, x2: 2, y1: -200, y2: -100 }}
					transition={{
						delay: Math.floor(Math.random() * 6) + 2,
						duration: Math.random() * 2 + 5,
						repeat: Number.POSITIVE_INFINITY,
					}}
				>
					<motion.stop offset="0%" stopColor="transparent" />
					<motion.stop offset="50%" stopColor="var(--color-neutral-accent)" />
					<motion.stop offset="100%" stopColor="transparent" />
				</motion.linearGradient>
			</defs>
		</motion.svg>
	);
};

const SVG = ({ className }: { className?: string }) => {
	const width = 300;
	const height = 1;

	const id = useId();
	return (
		<motion.svg
			className={cn("text-neutral-secondary", className)}
			fill="none"
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			width={width}
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>SVG</title>
			<path d="M0.5 0.5H479" stroke="currentColor" />
			<motion.path
				d="M0.5 0.5H479"
				stroke={`url(#gradient-${id})`}
				strokeWidth={1}
			/>

			<defs>
				<motion.linearGradient
					animate={{ x1: 400, x2: 600, y1: 0, y2: 0 }}
					gradientUnits="userSpaceOnUse"
					id={`gradient-${id}`}
					initial={{ x1: -200, x2: -100, y1: 0, y2: 0 }}
					transition={{
						delay: Math.floor(Math.random() * 6) + 2,
						duration: Math.random() * 2 + 10,
						repeat: Number.POSITIVE_INFINITY,
					}}
				>
					<motion.stop offset="0%" stopColor="transparent" />
					<motion.stop offset="50%" stopColor="var(--color-neutral-accent)" />
					<motion.stop offset="100%" stopColor="transparent" />
				</motion.linearGradient>
			</defs>
		</motion.svg>
	);
};
