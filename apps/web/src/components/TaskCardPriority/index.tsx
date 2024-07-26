import React, { useState, useEffect, type ReactNode } from "react";
import { high, medium, low } from "@/components/Svg";
import type { TaskCardPriorityProps } from "./TaskCardPriority.interfaces";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { CircleAlert, Ellipsis } from "lucide-react";

const styles = {
  mainBorder:
    "border border-border mb-2 mt-1 w-6 h-5 flex items-center justify-center p-0.5 rounded",
  main: "w-5 flex items-center justify-center p-0.5 rounded",
};

const TaskCardPriority = ({ task, border }: TaskCardPriorityProps) => {
  const [svg, setSvg] = useState<ReactNode>();
  const { theme } = useAppSelector((state) => state.userSettings);
  const iconGray = theme === "dark" ? "#DCD8FE" : "#000";

  useEffect(() => {
    switch (task.priority) {
      case null:
        setSvg(<Ellipsis className="size-4" />);
        break;
      case "Low":
        setSvg(low);
        break;
      case "Medium":
        setSvg(medium);
        break;
      case "High":
        setSvg(high);
        break;
      case "Urgent":
        setSvg(<CircleAlert className="size-4 fill-destructive" />);
        break;
      default:
        setSvg(<Ellipsis className="size-4" />);
    }
  }, [task.priority, iconGray]);
  return (
    <button className={border ? styles.mainBorder : styles.main} type="button">
      {svg}
    </button>
  );
};

export default TaskCardPriority;
