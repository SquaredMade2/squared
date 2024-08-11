"use client";

import type { RefObject } from "react";
import IssueSidebarContainer from "@/components/IssueSidebarContainer";
import TaskPageCenterContainer from "../TaskPageCenterContainer";
import type { SingleTaskDataInterface } from "@/store/task";
import { LoadingTask } from "../LoadingTask";

type Props = {
  task: SingleTaskDataInterface;
  render: boolean;
  showBackdrop: boolean;
  toggleSideNav: () => void;
  showSideNav: boolean;
  svgRef: RefObject<HTMLElement>;
  sideNav: RefObject<HTMLDivElement>;
};

const DefaultTask: React.FC<Props> = ({
  task,
  render,
  showBackdrop,
  showSideNav,
  toggleSideNav,
  svgRef,
  sideNav,
}) => {
  return (
    <>
      {((!render && !task) || !task) && <LoadingTask />}
      {render && task && (
        <>
          <div className="w-full mdlg:w-full flex space-around scrollbar-thin-transparent overflow-auto max850:overflow-x-hidden">
            {showBackdrop && (
              <div
                className={`absolute w-full h-screen bg-gray-500 bg-opacity-40 z-10 ${
                  showSideNav ? "max850:block hidden" : "mdsm:block hidden"
                }`}
              />
            )}
            <div className="w-full h-full p-2 md:p-5 xl:px-10">
              <div className="flex w-full relative">
                <TaskPageCenterContainer
                  setShowSideNav={toggleSideNav}
                  svgRef={svgRef}
                />
                <div
                  className={`relative ml-1 max850:absolute transition-all duration-300 ease-in-out ${
                    showSideNav
                      ? "z-20 max850:-right-0"
                      : "max850:-right-[500px]"
                  }`}
                >
                  <div ref={sideNav}>
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

export default DefaultTask;
