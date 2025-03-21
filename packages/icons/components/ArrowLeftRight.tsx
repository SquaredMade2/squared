import type { FC } from "react";

interface ArrowLeftRightProps {
	className?: string;
	size?: number;
	color?: string;
	strokeWidth?: number;
	absoluteStrokeWidth?: boolean;
	onClick?: (e: React.MouseEvent<SVGElement, MouseEvent>) => void;
}

export const ArrowLeftRight: FC<ArrowLeftRightProps> = ({
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
			<title>ArrowLeftRight</title>

			<path d="M8 3 4 7l4 4" />
			<path d="M4 7h16" />
			<path d="m16 21 4-4-4-4" />
			<path d="M20 17H4" />
		</svg>
	);
};
