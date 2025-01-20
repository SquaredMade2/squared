import { Button } from "@squared/ui/button";
import { useSidebar } from "@squared/ui/sidebar";
import { useModalStore, useSprintStore, useViewStore } from "@/store";
import type { Status } from "@squared/db";
import { SquarePen } from "lucide-react";
import { usePathname } from "next/navigation";

export const NewTaskButton = () => {
	const { showNewTask, setShowNewTask, newTaskData, setNewTaskData } =
		useModalStore((state) => state);
	const { state: sidebarState } = useSidebar();
	const titleArr: { status: Status } = { status: "todo" };

	const handleOpen = () => {
		setShowNewTask(true);
		setNewTaskData({
			...newTaskData,
			status: titleArr.status,
		});
	};

	const isCollapsed = sidebarState === "collapsed";

	return (
		<Button
			variant="outline"
			className={`shadow-lg border-blue-500 hover:shadow-glow ${
				isCollapsed ? "px-0" : ""
			}`}
			onClick={handleOpen}
		>
			<SquarePen className="size-5" />
			{!isCollapsed && (
				<>
					<span className="px-2 w-auto">
						{Object.keys(newTaskData).length > 0 && !showNewTask
							? "Resume editing"
							: "New Task"}
					</span>
					{Object.keys(newTaskData).length > 0 && !showNewTask && (
						<div className="w-1.5 h-1.5 rounded-md bg-accent border-border ml-2" />
					)}
				</>
			)}
		</Button>
	);
};

export const GridColumnNewTaskButton = ({ group }: { group: string }) => {
	const { setShowNewTask, newTaskData, setNewTaskData } = useModalStore(
		(state) => state,
	);
	const { displayOptions } = useViewStore((state) => state);
	const { sprint } = useSprintStore((state) => state);
	const path = usePathname();
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
			// case "Parent Task":
			// 	return "parentId";
			default:
				return "status";
		}
	})();

	const handleOpen = () => {
		setShowNewTask(true);
		setNewTaskData({
			...newTaskData,
			sprintId: path.includes("sprint") ? (sprint?.id ?? null) : null,
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

export const NoTasksNewTaskButton = () => {
	const { setShowNewTask } = useModalStore((state) => state);

	const handleOpen = () => {
		setShowNewTask(true);
	};

	return (
		<Button onClick={() => handleOpen()} variant="secondary">
			+ Add your first task
		</Button>
	);
};
