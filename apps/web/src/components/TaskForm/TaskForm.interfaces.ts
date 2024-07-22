type TaskItem = {
  taskName: string;
  priority: string | null;
  complexity: string | null;
  date: string;
  time: string;
  tags: string;
  subTaskList: string[];
  status: string;
};

export interface TaskFormProps {
  onDiscard: () => void;
  onSave: (taskItem: TaskItem) => void;
  onClose: () => void;
}
