import type { Task } from '@/store/taskData/taskData.interfaces';

export interface TaskCardTitleProps {
  taskTitle: string;
  task: Task;
  isShown: boolean;
  highlightText: (taskTitle: string) => string | React.ReactNode;
  location: string;
}
