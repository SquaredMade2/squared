import type { User } from "@repo/db";
import type { Dispatch, SetStateAction } from "react";

export interface AssigneeDropdownProps {
	taskId: string;
	location: string;
	setShowAssigneeDropdown: Dispatch<SetStateAction<boolean>>;
	handleAssigneeChange: (taskId: string, user: User) => void;
}
