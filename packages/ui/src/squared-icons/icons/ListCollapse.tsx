
    import * as React from 'react';
    import type {FC} from 'react';

    interface ListCollapseProps {
      className?: string;
      size?: number;
      color?: string;
      strokeWidth?: number;
      absoluteStrokeWidth?: boolean;
    }
    
  export const ListCollapse: FC<ListCollapseProps> = ({
      className = "",
      size = 24,
      color = 'currentColor',
      strokeWidth = 2,
      absoluteStrokeWidth = false,
    }) => {
      const scale = size / 24;
      const scaledStrokeWidth = absoluteStrokeWidth ? strokeWidth : strokeWidth / scale;
    
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
        <title>ListCollapse</title>
          
  <path d="m3 10 2.5-2.5L3 5" />
  <path d="m3 19 2.5-2.5L3 14" />
  <path d="M10 6h11" />
  <path d="M10 12h11" />
  <path d="M10 18h11" />

        </svg>
      );
    };
    