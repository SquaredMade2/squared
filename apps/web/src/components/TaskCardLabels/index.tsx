import React from 'react';
import { LabelColor } from '@/components/LabelButton';
import type { TaskCardLabelsProps } from './TaskCardLabels.interfaces';

function TaskCardLabels({ task, view }: TaskCardLabelsProps) {
  return (
    <div
      className={`flex items-center text-muted-foreground text-xs ${
        view === 'grid' ? 'flex-wrap' : 'mr-5'
      }`}
    >
      {task.labels.map((el) => (
        <div className="flex items-center p-1 mr-1 mb-1 border border-border rounded" key={el}>
          <LabelColor name={el} />
          <span className="ml-1">{el}</span>
        </div>
      ))}
    </div>
  );
}

export default TaskCardLabels;
