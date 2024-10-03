// biome-ignore lint/correctness/noUnusedImports: React is needed to be included
import * as React from "react";
import type { FC } from "react";

interface GitPullRequestArrowProps {
	className?: string;
	size?: number;
	color?: string;
	strokeWidth?: number;
	absoluteStrokeWidth?: boolean;
}

export const GitPullRequestArrow: FC<GitPullRequestArrowProps> = ({
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
			<title>GitPullRequestArrow</title>

			<circle cx="5" cy="6" r="3" />
			<path d="M5 9v12" />
			<circle cx="19" cy="18" r="3" />
			<path d="m15 9-3-3 3-3" />
			<path d="M12 6h5a2 2 0 0 1 2 2v7" />
		</svg>
	);
};
