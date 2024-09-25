
    import * as React from 'react';
    import type {FC} from 'react';

    interface BarsStaggeredProps {
      className?: string;
      size?: number;
      color?: string;
      strokeWidth?: number;
      absoluteStrokeWidth?: boolean;
    }
    
  export const BarsStaggered: FC<BarsStaggeredProps> = ({
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
        <title>BarsStaggered</title>
          <path d="M0,3.5c0-.28,.22-.5,.5-.5H18.5c.28,0,.5,.22,.5,.5s-.22,.5-.5,.5H.5c-.28,0-.5-.22-.5-.5Zm18.5,15.5H.5c-.28,0-.5,.22-.5,.5s.22,.5,.5,.5H18.5c.28,0,.5-.22,.5-.5s-.22-.5-.5-.5Zm5-8H5.5c-.28,0-.5,.22-.5,.5s.22,.5,.5,.5H23.5c.28,0,.5-.22,.5-.5s-.22-.5-.5-.5Z"/>
        </svg>
      );
    };
    