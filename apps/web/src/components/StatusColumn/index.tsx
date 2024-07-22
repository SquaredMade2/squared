import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskStatusSection from '@/components/TaskStatusSection';
import TaskColumnTitle from '@/components/TaskColumnTitle';
import type { RootState } from '@/store';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import type { Task } from '@/store/taskData/taskData.interfaces';
import type { HideStatusProps } from '../HideStatus/HideStatusProps';
import type { StatusColumnProps } from './StatusColumn.interfaces';
import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskStatusSection from '@/components/TaskStatusSection';
import TaskColumnTitle from '@/components/TaskColumnTitle';
import type { RootState } from '@/store';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import type { Task } from '@/store/taskData/taskData.interfaces';
import type { HideStatusProps } from '../HideStatus/HideStatusProps';
import type { StatusColumnProps } from './StatusColumn.interfaces';

const StatusColumn = ({
  columnType,
  title,
  setShowRenameModal,
  setTaskData,
  tasks,
}: StatusColumnProps) => {
  const [showTasks, setShowTasks] = useState(true);
  const view = useAppSelector((state: RootState) => state.userSettings.view);
  const numberOfTasks = tasks.filter((task: Task) => task.status === title).length;
  const isListView = view === 'list';

  const toggleShowTasks: HideStatusProps['toggleShowTasks'] = () => {
    setShowTasks((prevState) => !prevState);
  };

  return (
    <div
      className={`flex-col						
			${view === 'grid' && columnType === 'Canceled' ? 'ml-[15px] ' : ''}
			${view === 'grid' && columnType === 'Backlog' ? 'mr-[15px] ' : ''}
			${view === 'grid' && columnType === 'In Progress' ? 'mx-[15px] ' : ''}
			${view === 'grid' && columnType === 'Todo' ? 'mx-[15px] ' : ''}
			${view === 'grid' && columnType === 'Done' ? 'mx-[15px] ' : ''}`}
    >
      <TaskColumnTitle
        isListView={isListView}
        showTasks={showTasks}
        numberOfTasks={numberOfTasks}
        title={title}
        toggleShowTasks={toggleShowTasks}
      />
      <Droppable droppableId={columnType}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
						${snapshot.isDraggingOver ? ' h-full' : ''}${
              snapshot.isDraggingOver && view === 'grid'
                ? ''
                : `overflow-y-auto ${view === 'grid' && 'h-[85vh]'}`
            } 
						`}
          >
            <TaskStatusSection
              key={columnType}
              isListView={isListView}
              filteredTasks={tasks}
              showTasks={showTasks}
              setShowRenameModal={setShowRenameModal}
              setTaskData={setTaskData}
            />

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default StatusColumn;
