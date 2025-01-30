import type { FC } from "react";

interface CircleDashedProps {
	className?: string;
	size?: number;
	color?: string;
	strokeWidth?: number;
	absoluteStrokeWidth?: boolean;
}

export const CircleDashed: FC<CircleDashedProps> = ({
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
			<title>CircleDashed</title>

			<path d="M10.1 2.182a10 10 0 0 1 3.8 0" />
			<path d="M13.9 21.818a10 10 0 0 1-3.8 0" />
			<path d="M17.609 3.721a10 10 0 0 1 2.69 2.7" />
			<path d="M2.182 13.9a10 10 0 0 1 0-3.8" />
			<path d="M20.279 17.609a10 10 0 0 1-2.7 2.69" />
			<path d="M21.818 10.1a10 10 0 0 1 0 3.8" />
			<path d="M3.721 6.391a10 10 0 0 1 2.7-2.69" />
			<path d="M6.391 20.279a10 10 0 0 1-2.69-2.7" />
		</svg>
	);
};
