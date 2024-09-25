
    import * as React from 'react';
    import type {FC} from 'react';

    interface ExpandProps {
      className?: string;
      size?: number;
      color?: string;
      strokeWidth?: number;
      absoluteStrokeWidth?: boolean;
    }
    
  export const Expand: FC<ExpandProps> = ({
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
        <title>Expand</title>
          
  <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
  <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
  <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
  <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />

        </svg>
      );
    };
    