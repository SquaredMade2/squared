import type { Task } from '@/store/taskData/taskData.interfaces';

export interface RightClickMenuProps {
  x: number;
  y: number;
  task: Task;
  handleDeleteTaskCard(task: Task): void;
  setShowRenameModal?: (argunment: boolean) => void;
}

export type Color = {
  hover: string;
  color: string;
};
