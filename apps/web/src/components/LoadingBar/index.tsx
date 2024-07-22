import type { FC } from 'react';
import './LoadingBar.css';

interface LoadingBarProps {
  isLoading: boolean;
}

const LoadingBar: FC<LoadingBarProps> = ({ isLoading }) => {
  return (
    <div className={`w-full h-1 bg-transparent z-50 ${isLoading ? 'visible' : 'invisible'}`}>
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1/2 bg-[#6e79d6] snake-animation" />
      </div>
    </div>
  );
};

export default LoadingBar;
