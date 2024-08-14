import type React from "react";
import { useState } from "react";
import format from "date-fns/format";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import TaskCardPriority from "@/components/TaskCardPriority";
import TaskCardStatus from "@/components/TaskCardStatus";
import { truncateString } from "@/utils/formatting";
import type {
  AssigneeParams,
  HandleAssigneeChange,
} from "@/app/interfaces/Tasks.interfaces";
import ProfileImage from "@/components/ProfileImage";
import { getAllTasks, setAssignee } from "@/store/taskData/thunks";
import { AssigneeDropdown } from "@/components/AssigneeDropdown";
import TaskCardLabels from "@/components/TaskCardLabels";
import type { TaskCardTitleProps } from "./TaskCardTitle.interfaces";
import { UserSearch } from "lucide-react";

// Leave task and handleOpenDeleteCard in until delete function is added
const TaskCardTitle = ({
  taskTitle,
  task,
  isShown,
  highlightText,
  location,
}: TaskCardTitleProps) => {
  const { view } = useAppSelector((state) => state.userSettings);
  const dispatch = useAppDispatch();

  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const currentTeam = useAppSelector((state) => state.taskData.currentTeam);
  const { showDateTime, showLabels } = useAppSelector(
    (state) => state.toggleTaskFeatures
  );

  const handleAssigneeIcon: () => React.JSX.Element = () => {
    return task.assignee?.name !== null && task.assignee ? (
      <ProfileImage profileName={task.assignee.name} location={"taskCard"} />
    ) : (
      <UserSearch className="size-5 text-[#9597AD]" />
    );
  };

  const toggleAssigneeDropdown: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setShowAssigneeDropdown(!showAssigneeDropdown);
  };

  const teamIdentifier =
    location === "dashboard" ? currentTeam.identifier : task.team.identifier;

  const assigneeParams: AssigneeParams = (taskId, user) => {
    dispatch(getAllTasks(currentTeam));
    return { taskId: taskId, assignee: { id: user.id, name: user.name } };
  };

  const handleAssigneeChange: HandleAssigneeChange = async (taskId, user) => {
    dispatch(setAssignee(assigneeParams(taskId, user)));
    await dispatch(getAllTasks(currentTeam));
  };

  return (
    <>
      {view === "list" || location === "search" ? (
        <div>
          <div className="flex flex-row justify-between xs:ml-3 sm:ml-3 lg:ml-0 py-1">
            <div className="flex items-center flex-row gap-2 text-base">
              {isShown && (
                <div className="flex items-center">
                  <TaskCardPriority task={task} border={false} />
                  test
                </div>
              )}
              <span className="text-muted-foreground xs:hidden sm:hidden md:flex cursor-pointer">
                {teamIdentifier}
              </span>
              <div className="flex items-center">
                <TaskCardStatus task={task} />
              </div>
              {location === "search" ? (
                <span>{highlightText(taskTitle)}</span>
              ) : (
                <span className="cursor-pointer">{taskTitle}</span>
              )}
            </div>
            <div className="flex flex-row gap-2 pr-2" />
            <div className="flex col-span-4 items-center lg:pr-5 justify-end">
              {showLabels && <TaskCardLabels task={task} view="list" />}
              {showDateTime && (
                <div className="text-muted-foreground md:flex xs:hidden sm:hidden mr-2 mdsm:mr-3">
                  {task.dateCreated
                    ? format(new Date(task.dateCreated), "MMM dd")
                    : "No Date"}
                </div>
              )}
              <button
                type="button"
                onClick={(e) => toggleAssigneeDropdown(e)}
                className="cursor-pointer"
              >
                {handleAssigneeIcon()}
              </button>
              <div className="absolute mr-40 mt-10 cursor-pointer">
                {showAssigneeDropdown && (
                  <AssigneeDropdown
                    taskId={task._id}
                    location="Dashboard"
                    setShowAssigneeDropdown={setShowAssigneeDropdown}
                    handleAssigneeChange={handleAssigneeChange}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start justify-evenly cursor-pointer">
          <div className="flex flex-row justify-between h-[20px] w-full cursor-pointer">
            <div className="flex justify-start items-center">
              <p className="text-xs text-muted-foreground">{teamIdentifier}</p>
            </div>
            <button
              type="button"
              onClick={(e) => toggleAssigneeDropdown(e)}
              className=""
            >
              {handleAssigneeIcon()}
            </button>
          </div>

          <div className="text-sm pr-8 cursor-pointer w-full">
            <span className="cursor-pointer">
              {truncateString(task.title, 70)}
            </span>
          </div>
          <div className="">
            {showAssigneeDropdown && (
              <AssigneeDropdown
                taskId={task._id}
                location={"Grid"}
                setShowAssigneeDropdown={setShowAssigneeDropdown}
                handleAssigneeChange={handleAssigneeChange}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCardTitle;
