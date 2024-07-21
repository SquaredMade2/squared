import React, { useState } from 'react';
import { settingsIcon } from '@/components/Svg';
import HideTaskStatusDropdown from '@/components/HideTaskSectionDropdown';
import type { HideStatusProps } from './HideStatusProps';

const style = {
  hideStatusBg:
    'border bg-card px-3 py-1 rounded absolute  top-9 right-1 shadow-xs hover:bg-gray-50 hover:shadow active:shadow-xs active:bg-gray-40',
  container: 'relative flex items-center',
};

const HideStatus = ({ toggleShowTasks, showTasks }: HideStatusProps) => {
  const [showHideDropdown, setShowHideDropdown] = useState(false);

  const toggleHideDropdown = (): void => {
    setShowHideDropdown((prevState) => !prevState);
  };

  return (
    <>
      <div className={style.container}>
        <button type="button" onClick={toggleHideDropdown}>
          {settingsIcon()}
        </button>
        {showHideDropdown && (
          <HideTaskStatusDropdown
            toggleHideDropdown={toggleHideDropdown}
            toggleShowTasks={toggleShowTasks}
            showTasks={showTasks}
          />
        )}
      </div>
    </>
  );
};

export default HideStatus;
