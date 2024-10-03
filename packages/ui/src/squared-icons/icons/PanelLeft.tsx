// biome-ignore lint/correctness/noUnusedImports: React is needed to be included
import * as React from "react";
import type { FC } from "react";

interface PanelLeftProps {
	className?: string;
	size?: number;
	color?: string;
	strokeWidth?: number;
	absoluteStrokeWidth?: boolean;
}

export const PanelLeft: FC<PanelLeftProps> = ({
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
			<title>PanelLeft</title>

			<rect width="18" height="18" x="3" y="3" rx="2" />
			<path d="M9 3v18" />
		</svg>
	);
};
