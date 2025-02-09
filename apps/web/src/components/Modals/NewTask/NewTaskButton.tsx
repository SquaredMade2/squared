import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useModalStore, useSprintStore, useViewStore } from "@/store";
import type { Status } from "@squared/db";
import { SquarePen } from "@squared/icons";
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
			className={`border-blue-500 shadow-lg hover:shadow-glow ${
				isCollapsed ? "px-0" : ""
			}`}
			onClick={handleOpen}
		>
			<SquarePen className="size-5" />
			{!isCollapsed && (
				<>
					<span className="w-auto px-2">
						{Object.keys(newTaskData).length > 0 && !showNewTask
							? "Resume editing"
							: "New Task"}
					</span>
					{Object.keys(newTaskData).length > 0 && !showNewTask && (
						<div className="ml-2 h-1.5 w-1.5 rounded-md border-border bg-accent" />
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
