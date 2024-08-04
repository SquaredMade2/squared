import TaskCard from "@/components/TaskCard";
import type { TaskStatusSectionProps } from "./TaskStatusSection.interfaces";
import { Button } from "../ui/button";
import { GridColumnNewIssueButton } from "../NewIssueButton";

const style = {
  subTitleBgGrid:
    "flex flex-col gap-2 z-30 w-full min-h-[135px] h-full overflow-x-hidden",
  subTitleBgList: "grid grid-rows-[1fr 9fr] rounded-lg bg-card w-full",
};

const TaskStatusSection = ({
  isListView,
  filteredTasks,
  setShowRenameModal,
  setTaskData,
  showTasks,
  title,
}: TaskStatusSectionProps) => {
  const location = "dashboard";
  const highlightText = (taskTitle: string) => taskTitle;
  return (
    <div
      className={
        (isListView ? style.subTitleBgList : style.subTitleBgGrid) +
          //If column is empty, add padding to the bottom allowing new issues to be dragged within.
          isListView && filteredTasks.length < 1
          ? " pb-1"
          : ""
      }
    >
      {showTasks && (
        <TaskCard
          filteredTasks={filteredTasks}
          setShowRenameModal={setShowRenameModal}
          setTaskData={setTaskData}
          location={location}
          highlightText={highlightText}
        />
      )}
      {!isListView && <GridColumnNewIssueButton status={title} />}
    </div>
  );
};
export default TaskStatusSection;
