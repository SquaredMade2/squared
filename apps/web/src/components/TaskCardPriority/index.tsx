import React, { useState, useEffect, type ReactNode } from 'react';
import {
  nullPriority,
  lowPriority,
  mediumPriority,
  highPriority,
  urgentPriority,
} from '@/components/Svg';
import type { TaskCardPriorityProps } from './TaskCardPriority.interfaces';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';

const styles = {
  mainBorder:
    'border border-border mb-2 mt-1 w-6 h-5 flex items-center justify-center p-0.5 rounded',
  main: 'w-5 flex items-center justify-center p-0.5 rounded',
};

const TaskCardPriority = ({ task, border }: TaskCardPriorityProps) => {
  const [svg, setSvg] = useState<ReactNode>();
  const { theme } = useAppSelector((state) => state.userSettings);
  const iconGray = theme === 'dark' ? '#DCD8FE' : '#000';

  useEffect(() => {
    switch (task.priority) {
      case null:
        setSvg(nullPriority({}));
        break;
      case 'Low':
        setSvg(lowPriority(iconGray));
        break;
      case 'Medium':
        setSvg(mediumPriority(iconGray));
        break;
      case 'High':
        setSvg(highPriority(iconGray));
        break;
      case 'Urgent':
        setSvg(urgentPriority(iconGray));
        break;
      default:
        setSvg(nullPriority({}));
    }
  }, [task.priority, iconGray]);
  return (
    <button className={border ? styles.mainBorder : styles.main} type="button">
      {svg}
    </button>
  );
};

export default TaskCardPriority;
