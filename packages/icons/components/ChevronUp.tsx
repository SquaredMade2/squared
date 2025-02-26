import type { FC } from "react";

interface ChevronUpProps {
	className?: string;
	size?: number;
	color?: string;
	strokeWidth?: number;
	absoluteStrokeWidth?: boolean;
	onClick?: (e: React.MouseEvent<SVGElement, MouseEvent>) => void;
}

export const ChevronUp: FC<ChevronUpProps> = ({
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
			<title>ChevronUp</title>

			<path d="m18 15-6-6-6 6" />
		</svg>
	);
};
