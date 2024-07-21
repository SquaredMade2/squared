import React from 'react';
import EventTabs from '../TaskPageActivityTimeline/EventTabs';
import TaskPageTitle from '@/components/taskPageTitle/index';
import TaskCardTop from '@/components/TaskCardTop';
import ToggleNavBar from '../ToggleNavBar';
import ButtonIcon from '../ButtonIcon';
import type { TaskPageCenterContainerProps } from './TaskPageCenterContainer.interfaces';
import { toggleNavRight } from '../Svg';
const styles = {
  nav: 'hidden max850:block max850:absolute max850:right-0 cursor-pointer',
  content: 'overflow-auto scrollbar-thin-transparent h-[calc(100vh-5rem)]',
};

const TaskPageCenterContainer = ({ setShowSideNav }: TaskPageCenterContainerProps) => {
  return (
    <div className="w-full snap-start z-0 overflow-x-hidden ">
      <div className="flex items-center gap-2 ">
        <div className=" hidden mdsm:block">
          <ToggleNavBar />
        </div>
        <div className=" w-full max850:w-10/12 overflow-hidden">
          <TaskCardTop />
        </div>
        <span onClick={setShowSideNav} className={styles.nav}>
          <ButtonIcon icon={toggleNavRight({})} hoverBg="bg-accent" />
        </span>
      </div>

      <div className={styles.content}>
        <div className="mr-1 max850:mr-1 md:mr-5 xl:mr-10 ">
          <TaskPageTitle />
          <EventTabs />
        </div>
      </div>
    </div>
  );
};

export default TaskPageCenterContainer;
