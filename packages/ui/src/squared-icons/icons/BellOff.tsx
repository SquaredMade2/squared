
    // biome-ignore lint/correctness/noUnusedImports: React is needed to be included 
    import * as React from 'react';
    import type {FC} from 'react';

    interface BellOffProps {
      className?: string;
      size?: number;
      color?: string;
      strokeWidth?: number;
      absoluteStrokeWidth?: boolean;
    }
    
  export const BellOff: FC<BellOffProps> = ({
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
        <title>BellOff</title>
          
  <path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5" />
  <path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7" />
  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  <path d="m2 2 20 20" />

        </svg>
      );
    };
    