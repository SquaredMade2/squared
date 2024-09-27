import * as React from 'react';
import type {FC} from 'react';
interface InProgressProps {
	className?: string;
    size?: number;
    color?: string;
    strokeWidth?: number;
    absoluteStrokeWidth?: boolean;
}
export const InProgress: FC<InProgressProps> = () => {
    return (
        <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <title>Icon</title>
        <g clipPath="url(#clip0_1473_20025)">
            <circle cx="8" cy="8" r="7" stroke="#7394FF" strokeWidth="1.5" />
            <path
                d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1V15Z"
                fill="#7394FF"
            />
        </g>
        <defs>
            <clipPath id="clip0_1473_20025">
                <rect width="16" height="16" fill="white" />
            </clipPath>
        </defs>
    </svg>
    )
}