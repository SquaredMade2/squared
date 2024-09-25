
    import * as React from 'react';
    import type {FC} from 'react';

    interface MailOpenProps {
      className?: string;
      size?: number;
      color?: string;
      strokeWidth?: number;
      absoluteStrokeWidth?: boolean;
    }
    
  export const MailOpen: FC<MailOpenProps> = ({
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
        <title>MailOpen</title>
          
  <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
  <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />

        </svg>
      );
    };
    