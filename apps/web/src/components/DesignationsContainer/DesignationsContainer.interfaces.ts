import type { Task } from "@repo/db";
export interface DesignationsContainerProps {
	newIssueData: Partial<Task>;
	setNewIssueData: (task: Partial<Task>) => void;
}
