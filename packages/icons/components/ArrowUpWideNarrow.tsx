import type { FC } from "react";

interface ArrowUpWideNarrowProps {
	className?: string;
	size?: number;
	color?: string;
	strokeWidth?: number;
	absoluteStrokeWidth?: boolean;
}

export const ArrowUpWideNarrow: FC<ArrowUpWideNarrowProps> = ({
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
			<title>ArrowUpWideNarrow</title>

			<path d="m3 8 4-4 4 4" />
			<path d="M7 4v16" />
			<path d="M11 12h10" />
			<path d="M11 16h7" />
			<path d="M11 20h4" />
		</svg>
	);
};
