import React from "react";
import EventTabs from "../TaskPageActivityTimeline/EventTabs";
import TaskPageTitle from "@/components/taskPageTitle/index";
import TaskCardTop from "@/components/TaskCardTop";
import ToggleNavBar from "../ToggleNavBar";
import ButtonIcon from "../ButtonIcon";
import type { TaskPageCenterContainerProps } from "./TaskPageCenterContainer.interfaces";
import { PanelRight } from "lucide-react";

const TaskPageCenterContainer = ({
  setShowSideNav,
}: TaskPageCenterContainerProps) => {
  return (
    <div className="w-full snap-start z-0 overflow-x-hidden ">
      <div className="flex items-center gap-2 ">
        <div className=" hidden mdsm:block">
          <ToggleNavBar />
        </div>
        <div className=" w-full max850:w-10/12 overflow-hidden">
          <TaskCardTop />
        </div>
        <span
          onClick={setShowSideNav}
          className="hidden max850:block max850:absolute max850:right-0 cursor-pointer"
        >
          <ButtonIcon
            icon={<PanelRight className="text-[#6B6F76] size-5" />}
            hoverBg="bg-accent"
          />
        </span>
      </div>

      <div className="overflow-auto scrollbar-thin-transparent h-[calc(100vh-5rem)]">
        <div className="mr-1 max850:mr-1 md:mr-5 xl:mr-10 ">
          <TaskPageTitle />
          <EventTabs />
        </div>
      </div>
    </div>
  );
};

export default TaskPageCenterContainer;
