import type { Assignee } from '@/store/taskData/taskData.interfaces';
import type { Dispatch, SetStateAction } from 'react';

export interface AssigneeDropdownProps {
  taskId: string;
  location: string;
  setShowAssigneeDropdown: Dispatch<SetStateAction<boolean>>;
  handleAssigneeChange: (taskId: string, user: Assignee) => void;
}
