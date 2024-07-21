import type React from 'react';
import './loadingskeleton.css';

interface LoadingGradientProps {
  width?: string;
  height?: string;
  rounded?: boolean;
}

export const LoadingSkeleton: React.FC<LoadingGradientProps> = ({
  width = '100%',
  height = '5px',
  rounded = false,
}) => {
  return (
    <div className="flex items-center">
      <div
        className="loading-gradient"
        style={{ width, height, borderRadius: rounded ? '50%' : '' }}
      />
    </div>
  );
};
