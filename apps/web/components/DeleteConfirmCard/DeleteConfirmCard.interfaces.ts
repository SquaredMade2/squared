import type { Task } from '@/store/taskData/taskData.interfaces';

export interface DeleteConfirmCardProps {
  onClose: () => void;
  handleDeleteTaskCard: (task: Task) => void;
  deleteFade: boolean;
  task: Task;
}
