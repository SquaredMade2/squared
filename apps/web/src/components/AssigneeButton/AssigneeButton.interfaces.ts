import type { Dispatch, SetStateAction } from 'react';

export interface AssigneeButtonProps {
  location: string;
  showAssigneeDropdown: boolean;
  setShowAssigneeDropdown: Dispatch<SetStateAction<boolean>>;
}
