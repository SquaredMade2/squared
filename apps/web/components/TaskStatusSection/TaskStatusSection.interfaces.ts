import type { Task } from '@/store/taskData/taskData.interfaces';

export interface TaskStatusSectionProps {
  isListView: boolean;
  filteredTasks: Task[];
  setShowRenameModal?: (value: boolean) => void;
  setTaskData?: (taskData: Task) => void;
  showTasks: boolean;
}
