import type { FC } from "react";
interface SquaredIconProps {
	className?: string;
	size?: number;
	color?: string;
	strokeWidth?: number;
	absoluteStrokeWidth?: boolean;
}
export type SquaredIcon = FC<SquaredIconProps>;
