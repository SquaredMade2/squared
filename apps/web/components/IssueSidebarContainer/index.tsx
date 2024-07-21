import React from 'react';
import DesignationsContainer from '@/components/DesignationsContainer';
import IssueSidebarTopRow from '../IssueSidebarTopRow';

const style = {
  container: 'flex flex-col min-h-[320px] w-[300px] text-white bg-popover rounded-lg mt-5',
};

const IssueSidebarContainer = () => {
  return (
    <>
      <div className="w-full">
        <IssueSidebarTopRow />
      </div>
      <div className={style.container}>
        <DesignationsContainer location={'issueSidebar'} />
      </div>
    </>
  );
};

export default IssueSidebarContainer;
