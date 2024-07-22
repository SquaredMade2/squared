'use client';

import type { RefObject } from 'react';
import IssueSidebarContainer from '@/components/IssueSidebarContainer';
import TaskCardTop from '../TaskCardTop';
import TaskPageTitle from '../taskPageTitle';
import EventTabs from '../TaskPageActivityTimeline/EventTabs';
import { toggleNavRight } from '../Svg';
import type { SingleTaskDataInterface } from '@/store/task';
import LoadingBar from '../LoadingBar';
import ButtonIcon from '../ButtonIcon';

const styles = {
  pageWrapper:
    ' w-full mdlg:w-full flex space-around scrollbar-thin-transparent overflow-auto overflow-x-hidden',
  contents: 'overflow-auto scrollbar-thin-transparent h-[calc(100vh-5rem)]',

  sideNavWrapper: 'absolute z-20 md:top-5 transition-all duration-300 ease-in-out',
  sideNavBackdrop: 'w-full h-screen absolute top-0 left-0 bg-gray-500 z-10 bg-opacity-40',
  navBackdrop: 'w-full h-screen top-0 left-0 absolute bg-gray-500 z-10 bg-opacity-40',
};
type Props = {
  task: SingleTaskDataInterface;
  render: boolean;
  showBackdrop: boolean;
  toggleSideNav: () => void;
  showSideNav: boolean;
  sideNav: RefObject<HTMLDivElement>;
};
const MailTask: React.FC<Props> = ({
  task,
  render,
  showBackdrop,
  showSideNav,
  toggleSideNav,
  sideNav,
}) => {
  return (
    <>
      {((!render && !task) || !task) && <LoadingBar isLoading={true} />}

      {render && task && (
        <>
          <div className={styles.pageWrapper}>
            {showBackdrop && <div className={styles.sideNavBackdrop} />}
            <div className="w-full h-full p-2 sm:p-5 relative ">
              <div className="flex w-full ">
                <div className="w-full snap-start z-0 overflow-x-hidden ">
                  <div className="flex items-center gap-2 ">
                    <div className=" w-full max850:w-10/12 overflow-hidden">
                      <TaskCardTop />
                    </div>
                    <div className="absolute right-1 sm:right-5 cursor-pointer">
                      <ButtonIcon
                        icon={toggleNavRight({})}
                        handleClick={toggleSideNav}
                        hoverBg="bg-accent"
                      />
                    </div>
                  </div>

                  <div className={styles.contents}>
                    <div className="mr-1">
                      <TaskPageTitle />
                      <EventTabs />
                    </div>
                  </div>
                </div>

                <div
                  className={`${styles.sideNavWrapper} ${
                    showSideNav ? 'right-1 sm:right-5' : '-right-[600px]'
                  }`}
                >
                  <div className="" ref={sideNav}>
                    <IssueSidebarContainer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MailTask;
