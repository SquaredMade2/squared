import React from 'react';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { rightChevron } from '../Svg';

const styles = {
  pageContainer: 'w-screen h-screen flex bg-background overflow-hidden',
  pageWrapper:
    'min-h-screen w-full mdlg:w-full flex space-around scrollbar-thin overflow-auto  max850:overflow-x-hidden',

  sideNavWrapper: 'relative max850:hidden transition-all duration-300 ease-in-out',
  leftSide: 'w-full snap-start overflow-x-hidden flex flex-col mr-1 max850:mr-1 md:mr-5 xl:mr-10',
  taskStats: 'h-92 mt-5 text-muted-foreground p-5 rounded-lg flex flex-col gap-8 bg-popover',
};

export const LoadingTask = () => {
  return (
    <>
      <div className={styles.pageWrapper}>
        <div className="w-full h-full p-2 md:p-5 xl:px-10">
          <div className="w-full flex relative">
            <div className={styles.leftSide}>
              <div>
                <div className="flex items-center gap-2 mt-1">
                  <LoadingSkeleton width="25px" height="25px" rounded={true} />
                  <p className="text-muted-foreground filter blur-sm blink">It is a long</p>
                  <span className="text-secondary"> {rightChevron()}</span>
                  <p className="text-muted-foreground filter blur-sm blink">consequuntur</p>
                </div>
              </div>
              <div className="h-20 mt-10 pt-2 pl-2">
                <p className="text-muted-foreground filter blur-sm blink">consequuntur</p>
              </div>
              <div className="w-full rounded-lg h-24  bg-popover p-2  ">
                <p className="text-muted-foreground filter blur-sm blink">
                  It is a long established fact that a reader will be distracted
                </p>
              </div>
              <div className="mt-3 flex flex-col gap-5">
                <div className="border-b border-border w-full text-foreground">
                  <div className="flex gap-10">
                    <button type="button" className="px-10 py-2 rounded-t-lg bg-accent">
                      Activities
                    </button>
                    <button type="button" className="px-10 py-2">
                      Comments
                    </button>
                  </div>
                </div>
                <div className="min-h-24 bg-popover p-2 rounded-lg flex flex-col">
                  <div className="flex gap-5 border-b py-2">
                    <p className="text-muted-foreground filter blur-sm blink">25 Jun 2024</p>
                    <LoadingSkeleton width="25px" height="25px" rounded={true} />
                    <p className="text-muted-foreground filter blur-sm blink">Pinak</p>
                    <p className="text-muted-foreground filter blur-sm blink">
                      letters as opposed to using Content
                    </p>
                  </div>
                  <div className="flex gap-5 py-2">
                    <p className="text-muted-foreground filter blur-sm blink">25 Jun 2024</p>
                    <LoadingSkeleton width="25px" height="25px" rounded={true} />
                    <p className="text-muted-foreground filter blur-sm blink">John Doe</p>
                    <p className="text-muted-foreground filter blur-sm blink">
                      letters as opposed to using Content
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.sideNavWrapper}>
              <div className="h-12 bg-popover  px-5 rounded-lg">
                <div className="flex justify-between h-full items-center">
                  <p className="text-muted-foreground filter blur-sm blink">SQU-19</p>
                  <div className="flex gap-2">
                    <span>
                      <LoadingSkeleton width="25px" height="25px" rounded={true} />
                    </span>
                    <span>
                      <LoadingSkeleton width="25px" height="25px" rounded={true} />
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.taskStats}>
                <div className="flex ">
                  <label className=" w-24">Status</label>
                  <div className="flex gap-2">
                    <LoadingSkeleton width="15px" height="15px" rounded={true} />
                    <p className="text-muted-foreground filter blur-sm blink">Todo</p>
                  </div>
                </div>
                <div className="flex">
                  <label className="w-24">Priority</label>
                  <div className="flex gap-2">
                    <LoadingSkeleton width="15px" height="15px" rounded={true} />
                    <p className="text-muted-foreground filter blur-sm blink">No Priority</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <label className="w-24">Labels</label>
                  <div className="flex flex-col gap-2 flex-grow">
                    <div className="flex gap-2 rounded-full border px-2 py-1 w-20">
                      <LoadingSkeleton width="15px" height="15px" rounded={true} />
                      <p className="text-muted-foreground filter blur-sm blink">Bug</p>
                    </div>
                    <div className="flex gap-2 px-2 py-1 rounded-full border border-border">
                      <LoadingSkeleton width="15px" height="15px" rounded={true} />
                      <p className="text-muted-foreground filter blur-sm blink">Improvement</p>
                    </div>
                  </div>
                </div>
                <div className="flex ">
                  <label className="w-24">Due Date</label>
                  <div className="flex items-center px-2 py-1 rounded-full border border-border">
                    <p className="text-muted-foreground filter blur-sm blink">01/07/2023</p>
                  </div>
                </div>
                <div className="flex ">
                  <label className="w-24">Effort</label>
                  <div className="flex gap-2">
                    <LoadingSkeleton width="15px" height="15px" rounded={true} />
                    <p className="text-muted-foreground filter blur-sm blink">Effort</p>
                  </div>
                </div>
                <div className="flex ">
                  <label className="w-24">Assignee</label>
                  <div className="flex gap-2">
                    <LoadingSkeleton width="15px" height="15px" rounded={true} />
                    <p className="text-muted-foreground filter blur-sm blink">Unassigned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
