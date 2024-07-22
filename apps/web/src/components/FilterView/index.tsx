'use client';
import { useEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useSelector } from 'react-redux';
import StatusColumn from '@/components/StatusColumn';
import type { FilterViewProps } from './FilterView.interfaces';
import type { RootState } from '@/store';
import type { Task } from '@/store/taskData/taskData.interfaces';

const styles = {
  homeBg: 'flex flex-col w-[calc(100%-0px)] h-screen bg-skin-fillHome overflow-auto',
  subTitleContainer: 'flex flex-row h-[inherit] px-6 overflow-x overflow-y-hidden mb-4',
  subTitleContainerList: 'flex flex-col w-full h-[inherit] overflow-auto',
  taskSubtitlesCon: 'flex h-[100px] items-center border-t border-border gap-[18px]',
};
// eslint-disable-next-line no-unused-vars
const FilterView = ({ handleDragEnd }: FilterViewProps) => {
  const view = useSelector((state: RootState) => state.userSettings.view);
  const filteredTaskList = useSelector((state: RootState) => state.filterPage.filteredTaskList);
  // eslint-disable-next-line no-unused-vars
  const [uniqueColumns, setUniqueColumns] = useState<string[]>([]);
  useEffect(() => {
    const columns = filteredTaskList?.map((element) => {
      return element.status;
    });
    setUniqueColumns(Array.from(new Set(columns)));
  }, [filteredTaskList]);

  const taskList = useSelector((state: RootState) => state.taskData.taskList);

  const filteredTasks = () => {
    try {
      return uniqueColumns?.map((status) => {
        const filteredTask = filteredTaskList?.filter((task) => {
          return task.status === status;
        });
        const matchedTasks = taskList.filter((task: Task) =>
          filteredTask.some((filteredTask) => filteredTask._id.toString() === task._id),
        );

        return (
          <StatusColumn key={status} columnType={status} title={status} tasks={matchedTasks} />
        );
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          className={` h-[100%]  ${
            view === 'list' ? 'w-full' : 'w-[fit-content] overflow-x-scroll overflow-y-hidden '
          }`}
        >
          <div
            className={view === 'list' ? styles.subTitleContainerList : styles.subTitleContainer}
          >
            {filteredTasks()}
          </div>
        </div>
      </DragDropContext>
    </>
  );
};

export default FilterView;
