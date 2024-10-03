// biome-ignore lint/correctness/noUnusedImports: React is needed to be included
import * as React from "react";
import type { FC } from "react";

interface MoveRightProps {
	className?: string;
	size?: number;
	color?: string;
	strokeWidth?: number;
	absoluteStrokeWidth?: boolean;
}

export const MoveRight: FC<MoveRightProps> = ({
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
			<title>MoveRight</title>

			<path d="M18 8L22 12L18 16" />
			<path d="M2 12H22" />
		</svg>
	);
};
