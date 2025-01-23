
    // biome-ignore lint/correctness/noUnusedImports: React is needed to be included 
    import * as React from 'react';
    import type {FC} from 'react';

    interface MessageCircleMoreProps {
      className?: string;
      size?: number;
      color?: string;
      strokeWidth?: number;
      absoluteStrokeWidth?: boolean;
    }
    
  export const MessageCircleMore: FC<MessageCircleMoreProps> = ({
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
        <title>MessageCircleMore</title>
          
  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  <path d="M8 12h.01" />
  <path d="M12 12h.01" />
  <path d="M16 12h.01" />

        </svg>
      );
    };
    