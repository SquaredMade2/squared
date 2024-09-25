
    import * as React from 'react';
    import type {FC} from 'react';

    interface AlignCenterProps {
      className?: string;
      size?: number;
      color?: string;
      strokeWidth?: number;
      absoluteStrokeWidth?: boolean;
    }
    
  export const AlignCenter: FC<AlignCenterProps> = ({
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
        <title>AlignCenter</title>
          
  <line x1="21" x2="3" y1="6" y2="6" />
  <line x1="17" x2="7" y1="12" y2="12" />
  <line x1="19" x2="5" y1="18" y2="18" />

        </svg>
      );
    };
    