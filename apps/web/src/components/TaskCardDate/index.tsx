import React from 'react';
import type { TaskCardDateProps } from './TaskCardDate.interfaces';

const TaskCardInfo = ({ children, icon }: TaskCardDateProps) => {
  return (
    <div className="flex flex-row gap-2 text-sm">
      <div className="flex justify-center items-center">{icon}</div>
      <span>{children}</span>
    </div>
  );
};

export default TaskCardInfo;
