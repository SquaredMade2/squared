import type { Dispatch, SetStateAction } from "react";

export interface AssigneeButtonProps {
	showAssigneeDropdown: boolean;
	setShowAssigneeDropdown: Dispatch<SetStateAction<boolean>>;
}
