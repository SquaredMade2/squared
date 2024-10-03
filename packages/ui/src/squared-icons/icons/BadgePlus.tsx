// biome-ignore lint/correctness/noUnusedImports: React is needed to be included
import * as React from "react";
import type { FC } from "react";

interface BadgePlusProps {
	className?: string;
	size?: number;
	color?: string;
	strokeWidth?: number;
	absoluteStrokeWidth?: boolean;
}

export const BadgePlus: FC<BadgePlusProps> = ({
	className = "",
	size = 24,
	color = "currentColor",
	strokeWidth = 2,
	absoluteStrokeWidth = false,
}) => {
	const scale = size / 24;
	const scaledStrokeWidth = absoluteStrokeWidth
		? strokeWidth
		: strokeWidth / scale;

	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			stroke={color}
			strokeWidth={scaledStrokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<title>BadgePlus</title>

			<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
			<line x1="12" x2="12" y1="8" y2="16" />
			<line x1="8" x2="16" y1="12" y2="12" />
		</svg>
	);
};
