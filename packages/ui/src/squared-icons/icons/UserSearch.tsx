// biome-ignore lint/correctness/noUnusedImports: React is needed to be included
import * as React from "react";
import type { FC } from "react";

interface UserSearchProps {
	className?: string;
	size?: number;
	color?: string;
	strokeWidth?: number;
	absoluteStrokeWidth?: boolean;
}

export const UserSearch: FC<UserSearchProps> = ({
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
			<title>UserSearch</title>

			<circle cx="10" cy="7" r="4" />
			<path d="M10.3 15H7a4 4 0 0 0-4 4v2" />
			<circle cx="17" cy="17" r="3" />
			<path d="m21 21-1.9-1.9" />
		</svg>
	);
};
