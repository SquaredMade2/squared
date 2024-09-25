
    import * as React from 'react';
    import type {FC} from 'react';

    interface CodeBranchProps {
      className?: string;
      size?: number;
      color?: string;
      strokeWidth?: number;
      absoluteStrokeWidth?: boolean;
    }
    
  export const CodeBranch: FC<CodeBranchProps> = ({
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
        <title>CodeBranch</title>
          
  <line x1="6" x2="6" y1="3" y2="15" />
  <circle cx="18" cy="6" r="3" />
  <circle cx="6" cy="18" r="3" />
  <path d="M18 9a9 9 0 0 1-9 9" />

        </svg>
      );
    };
    