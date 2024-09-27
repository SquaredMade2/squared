import * as React from 'react';
import type {FC} from 'react';
interface FilterInProgressProps {
    className?: string;
    size?: number;
    color?: string;
    strokeWidth?: number;
    absoluteStrokeWidth?: boolean;
  }
export const FilterInProgress: FC<FilterInProgressProps> = () => {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill="none"
        aria-label="In Progress"
        className="color-override"
        viewBox="0 0 14 14"
    >
        <title>Icon</title>
        <rect
            width="12"
            height="12"
            x="1"
            y="1"
            stroke="#F2C94C"
            strokeWidth="2"
            rx="6"
        />
        <path fill="#F2C94C" d="M7 7V3.5a3.5 3.5 0 010 7z" />
    </svg>
    )
}