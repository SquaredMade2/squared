import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Status } from "@repo/db";
import { useModalStore, useTeamStore, useViewStore } from "@/store";

export const NewIssueButton = () => {
	const { showNewIssue, setShowNewIssue, newIssueData, setNewIssueData } =
		useModalStore((state) => state);
	const titleArr: { status: Status } = { status: "todo" };

	const handleOpen = () => {
		setShowNewIssue(true);
		setNewIssueData({
			...newIssueData,
			status: titleArr.status,
		});
	};

	return (
		<Button
			variant="outline"
			className="shadow-lg border-blue-500 hover:shadow-glow"
			onClick={handleOpen}
		>
			<span>
				<SquarePen className="size-5" />
			</span>
			<span className="px-2 w-auto">
				{Object.keys(newIssueData).length > 0 && !showNewIssue
					? "Resume editing"
					: "New Issue"}
			</span>
			{Object.keys(newIssueData).length > 0 && !showNewIssue && (
				<div className="w-1.5 h-1.5 rounded-md bg-accent border-border ml-2" />
			)}
		</Button>
	);
};

export const GridColumnNewIssueButton = ({ group }: { group: string }) => {
	const { setShowNewIssue, newIssueData, setNewIssueData } = useModalStore(
		(state) => state,
	);
	const { displayOptions } = useViewStore((state) => state);
	const { currentSprint } = useTeamStore((state) => state);
	const { groupTasksBy } = displayOptions;

	const key = (() => {
		switch (groupTasksBy) {
			case "Status":
				return "status";
			case "Assignee":
				return "assigneeId";
			case "Priority":
				return "priority";
			case "Label":
				return "labels";
			// case "Parent Issue":
			// 	return "parentId";
			default:
				return "status";
		}
	})();

	const handleOpen = () => {
		setShowNewIssue(true);
		setNewIssueData({
			...newIssueData,
			sprintId: currentSprint?.id ?? null,
			[key]: group,
		});
	};
	return (
		<Button
			onClick={() => handleOpen()}
			variant={"outline"}
			className="w-full"
			aria-label="Create new task"
		>
			<SquarePen className="size-5" />
		</Button>
	);
};

export const NoTasksNewIssueButton = () => {
	const { setShowNewIssue } = useModalStore((state) => state);

	const handleOpen = () => {
		setShowNewIssue(true);
	};

	return (
		<Button onClick={() => handleOpen()} variant="secondary">
			+ Add your first task
		</Button>
	);
};
