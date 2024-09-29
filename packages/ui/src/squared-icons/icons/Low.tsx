// biome-ignore lint/correctness/noUnusedImports: React is needed to be included
import * as React from 'react';
import type {FC} from 'react';
interface LowProps {
    className?: string;
    size?: number;
    color?: string;
    strokeWidth?: number;
    absoluteStrokeWidth?: boolean;
}
export const Low: FC<LowProps> = () => {
    return (
        <svg
        fill="#6B6F76"
        viewBox="0 0 16 16"
        aria-label="Low Priority"
        width={16}
        height={16}
    >
        <title>Icon</title>
        <rect x="1" y="8" width="3" height="6" rx="1" />
        <rect x="6" y="5" width="3" height="9" rx="1" fillOpacity="0.4" />
        <rect x="11" y="2" width="3" height="12" rx="1" fillOpacity="0.4" />
    </svg>
    )
}