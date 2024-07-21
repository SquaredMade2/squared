import type { Task } from '@/store/taskData/taskData.interfaces';
import type { Dispatch, SetStateAction } from 'react';

export interface StatusColumnProps {
  columnType: string;
  title: string;
  setShowRenameModal?: Dispatch<SetStateAction<boolean>>;
  setTaskData?: Dispatch<SetStateAction<Task | null>>;
  tasks: Task[];
}
