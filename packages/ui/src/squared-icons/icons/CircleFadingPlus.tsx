
    import * as React from 'react';
    import type {FC} from 'react';

    interface CircleFadingPlusProps {
      className?: string;
      size?: number;
      color?: string;
      strokeWidth?: number;
      absoluteStrokeWidth?: boolean;
    }
    
  export const CircleFadingPlus: FC<CircleFadingPlusProps> = ({
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
        <title>CircleFadingPlus</title>
          
  <path d="M12 2a10 10 0 0 1 7.38 16.75" />
  <path d="M12 8v8" />
  <path d="M16 12H8" />
  <path d="M2.5 8.875a10 10 0 0 0-.5 3" />
  <path d="M2.83 16a10 10 0 0 0 2.43 3.4" />
  <path d="M4.636 5.235a10 10 0 0 1 .891-.857" />
  <path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />

        </svg>
      );
    };
    