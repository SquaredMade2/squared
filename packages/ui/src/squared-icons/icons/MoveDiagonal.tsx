
    // biome-ignore lint/correctness/noUnusedImports: React is needed to be included 
    import * as React from 'react';
    import type {FC} from 'react';

    interface MoveDiagonalProps {
      className?: string;
      size?: number;
      color?: string;
      strokeWidth?: number;
      absoluteStrokeWidth?: boolean;
    }
    
  export const MoveDiagonal: FC<MoveDiagonalProps> = ({
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
        <title>MoveDiagonal</title>
          
  <polyline points="13 5 19 5 19 11" />
  <polyline points="11 19 5 19 5 13" />
  <line x1="19" x2="5" y1="5" y2="19" />

        </svg>
      );
    };
    