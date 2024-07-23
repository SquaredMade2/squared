import { style } from "./TaskSubtitle.styles";
import { setShowTaskForm } from "@/store/showTaskForm";
import { setShowNewIssue } from "@/store/showNewIssue";
import { setStatus } from "@/store/taskData";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import type { ReactElement } from "react";
import type { TaskSubtitleProps } from "./TaskSubtitle.interfaces";
import { Circle, CircleDashed, CirclePlus, CircleX, Copy } from "lucide-react";
import { filterDone, inProgress } from "../Svg";
const TaskSubtitle = ({ title }: TaskSubtitleProps) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.userSettings.theme);
  const taskList = useAppSelector((state) => state.taskData.taskList);
  const numberOfTasks = taskList.filter((el) => el.status === title).length;

  const showIcon = (name: string): ReactElement | undefined => {
    switch (name) {
      case "Backlog":
        return <CircleDashed className="size-4" />;
      case "Todo":
        return <Circle className="size-4" />;
      case "In Progress":
        return inProgress();
      case "Done":
        return filterDone();
      case "Canceled":
        return <CircleX className="size-4" />;
      case "Duplicate":
        return <Copy className="size-4" />;
    }
  };
  const handleClick = (): void => {
    dispatch(setShowNewIssue(true));
    dispatch(setStatus(title));
  };

  return (
    <div
      className={`${style.subTitleSpacing} ${theme === "dark" ? "bg-card" : "bg-background"}`}
    >
      <span className={style.columnTitle}>
        <div className={style.svg}>{showIcon(title)}</div>
        {title}
        <span className={style.numOfTasks}>{numberOfTasks}</span>
      </span>
      <div className={style.subIconContainer}>
        <button
          type="button"
          className="focus:outline-none cursor:pointer"
          onClick={() => dispatch(setShowTaskForm(true))}
          title="Title"
        >
          <div
            className="focus:outline-none cursor-pointer group"
            onClick={handleClick}
          >
            <CirclePlus className="size-5" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default TaskSubtitle;
