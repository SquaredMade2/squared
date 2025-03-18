import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useModalStore, useSprintStore, useViewStore } from "@/store";
import { cn } from "@/utils/cn";
import type { Status } from "@squared/db";
import { CirclePlus, SquarePen } from "@squared/icons";
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
			size={isCollapsed ? "icon" : "default"}
			className={`border-blue-500 shadow-lg hover:shadow-glow ${
				isCollapsed ? "mx-1 px-0" : ""
			}`}
			onClick={handleOpen}
		>
			<SquarePen className={isCollapsed ? "size-4" : "size-5"} />
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

export const GridColumnNewTaskButton = ({
	group,
	isRowGrouped = false,
}: {
	group: string;
	isRowGrouped?: boolean;
}) => {
	const { setNewTaskData, setShowNewTask } = useModalStore((state) => state);
	const { groupTasksBy } = useViewStore((state) => state.displayOptions);
	const { sprint } = useSprintStore((state) => state);
	const path = usePathname();

	const handleClick = () => {
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
				//  return "parentId";
				default:
					return "status";
			}
		})();

		setNewTaskData({
			sprintId: path.includes("sprint") ? (sprint?.id ?? null) : null,
			[key]: group,
		});
		setShowNewTask(true);
	};

	return (
		<div className={cn("w-72 shrink-0", isRowGrouped ? "mt-2" : "")}>
			<Button
				onClick={handleClick}
				variant="outline"
				className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border-dashed"
			>
				<CirclePlus className="size-4 text-muted-foreground" />
				<span className="text-muted-foreground text-sm">New task</span>
			</Button>
		</div>
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
