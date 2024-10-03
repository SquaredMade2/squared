// biome-ignore lint/correctness/noUnusedImports: React is needed to be included
import * as React from "react";
import type { FC } from "react";

interface SlidersVerticalProps {
	className?: string;
	size?: number;
	color?: string;
	strokeWidth?: number;
	absoluteStrokeWidth?: boolean;
}

export const SlidersVertical: FC<SlidersVerticalProps> = ({
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
			<title>SlidersVertical</title>

			<line x1="4" x2="4" y1="21" y2="14" />
			<line x1="4" x2="4" y1="10" y2="3" />
			<line x1="12" x2="12" y1="21" y2="12" />
			<line x1="12" x2="12" y1="8" y2="3" />
			<line x1="20" x2="20" y1="21" y2="16" />
			<line x1="20" x2="20" y1="12" y2="3" />
			<line x1="2" x2="6" y1="14" y2="14" />
			<line x1="10" x2="14" y1="8" y2="8" />
			<line x1="18" x2="22" y1="16" y2="16" />
		</svg>
	);
};
