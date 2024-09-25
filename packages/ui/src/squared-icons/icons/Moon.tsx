
    import * as React from 'react';
    import type {FC} from 'react';

    interface MoonProps {
      className?: string;
      size?: number;
      color?: string;
      strokeWidth?: number;
      absoluteStrokeWidth?: boolean;
    }
    
  export const Moon: FC<MoonProps> = ({
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
        <title>Moon</title>
          
  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />

        </svg>
      );
    };
    