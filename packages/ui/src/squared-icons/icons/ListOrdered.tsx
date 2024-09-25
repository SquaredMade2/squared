
    import * as React from 'react';
    import type {FC} from 'react';

    interface ListOrderedProps {
      className?: string;
      size?: number;
      color?: string;
      strokeWidth?: number;
      absoluteStrokeWidth?: boolean;
    }
    
  export const ListOrdered: FC<ListOrderedProps> = ({
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
        <title>ListOrdered</title>
          
  <line x1="10" x2="21" y1="6" y2="6" />
  <line x1="10" x2="21" y1="12" y2="12" />
  <line x1="10" x2="21" y1="18" y2="18" />
  <path d="M4 6h1v4" />
  <path d="M4 10h2" />
  <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />

        </svg>
      );
    };
    