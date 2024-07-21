import TaskCard from '@/components/TaskCard';
import type { TaskStatusSectionProps } from './TaskStatusSection.interfaces';

const style = {
  subTitleBgGrid: 'flex flex-col gap-3 z-30 w-full min-h-[135px] h-full overflow-x-hidden',
  subTitleBgList: 'grid grid-rows-[1fr 9fr] rounded-lg bg-card w-full mb-5',
};

const TaskStatusSection = ({
  isListView,
  filteredTasks,
  setShowRenameModal,
  setTaskData,
  showTasks,
}: TaskStatusSectionProps) => {
  const location = 'dashboard';
  const highlightText = (taskTitle: string) => taskTitle;

  return (
    <div className={isListView ? style.subTitleBgList : style.subTitleBgGrid}>
      {showTasks && (
        <TaskCard
          filteredTasks={filteredTasks}
          setShowRenameModal={setShowRenameModal}
          setTaskData={setTaskData}
          location={location}
          highlightText={highlightText}
        />
      )}
    </div>
  );
};
export default TaskStatusSection;
