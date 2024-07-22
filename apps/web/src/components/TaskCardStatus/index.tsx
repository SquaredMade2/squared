import React, { useState, useEffect, type ReactNode } from 'react';
import {
  todoIcon,
  filterBacklog,
  filterInProgress,
  filterDone,
  filterCancelled,
} from '@/components/Svg';
import type { TaskCardStatusProps } from '@/app/interfaces/Tasks.interfaces';

const TaskCardStatus = ({ task }: TaskCardStatusProps) => {
  const [svg, setSvg] = useState<ReactNode>();

  useEffect(() => {
    switch (task.status) {
      case 'Todo':
        setSvg(todoIcon({}));
        break;
      case 'In Progress':
        setSvg(filterInProgress);
        break;
      case 'Backlog':
        setSvg(filterBacklog);
        break;
      case 'Done':
        setSvg(filterDone);
        break;
      case 'Canceled':
        setSvg(filterCancelled);
        break;
      default:
        setSvg(todoIcon({}));
    }
  }, [task.status]);
  return (
    <button type="button" className="mx-1">
      {svg}
    </button>
  );
};

export default TaskCardStatus;
