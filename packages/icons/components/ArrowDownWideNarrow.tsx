import type { FC } from "react";

interface ArrowDownWideNarrowProps {
	className?: string;
	size?: number;
	color?: string;
	strokeWidth?: number;
	absoluteStrokeWidth?: boolean;
	onClick?: (e: React.MouseEvent<SVGElement, MouseEvent>) => void;
}

export const ArrowDownWideNarrow: FC<ArrowDownWideNarrowProps> = ({
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
			<title>ArrowDownWideNarrow</title>

			<path d="m3 16 4 4 4-4" />
			<path d="M7 20V4" />
			<path d="M11 4h10" />
			<path d="M11 8h7" />
			<path d="M11 12h4" />
		</svg>
	);
};
