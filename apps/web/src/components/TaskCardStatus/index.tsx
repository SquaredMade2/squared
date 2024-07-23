import React, { useState, useEffect, type ReactNode } from "react";
import {
  filterInProgress,
  filterDone,
} from "@/components/Svg";
import type { TaskCardStatusProps } from "@/app/interfaces/Tasks.interfaces";
import { Circle, CircleDashed, CircleX } from "lucide-react";

const TaskCardStatus = ({ task }: TaskCardStatusProps) => {
  const [svg, setSvg] = useState<ReactNode>();

  useEffect(() => {
    switch (task.status) {
      case "Todo":
        setSvg(<Circle className="size-4" />);
        break;
      case "In Progress":
        setSvg(filterInProgress);
        break;
      case "Backlog":
        setSvg(<CircleDashed className="size-4" />);
        break;
      case "Done":
        setSvg(filterDone);
        break;
      case "Canceled":
        setSvg(<CircleX className="size-4" />);
        break;
      default:
        setSvg(<Circle className="size-4" />);
    }
  }, [task.status]);
  return (
    <button type="button" className="mx-1">
      {svg}
    </button>
  );
};

export default TaskCardStatus;
