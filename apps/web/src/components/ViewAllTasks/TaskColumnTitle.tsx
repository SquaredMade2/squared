import { CirclePlus, EllipsisVertical } from "lucide-react";
import type { TaskColumnTitleProps } from "./interfaces";
import { cn } from "@/utils/cn";
import { useModalStore, useTaskStore } from "@/store";
import { formatPriority, formatStatus } from "@/utils/formatting";
import { useViewStore } from "@/store";
import type { Priority, Status } from "@repo/db";
import { useUsers } from "@/hooks/useUsers";
// import { StatusIcon } from "../Icons";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const TaskColumnTitle = ({
	isListView,
	showTasks,
	title,
	numberOfTasks,
	setShowTasks,
	sprintId,
}: TaskColumnTitleProps) => {
	const { setNewIssueData, setShowNewIssue } = useModalStore((state) => state);
	const { users } = useUsers();
	const { tasks } = useTaskStore((state) => state);
	const { displayOptions } = useViewStore((state) => state);
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
			case "Parent Issue":
				return "parentId";
			case "No grouping":
				return "status";
			default:
				return "status";
		}
	})();

	const handleClick = (): void => {
		setShowNewIssue(true);
		setNewIssueData({ sprintId: sprintId ?? null, [key]: title });
	};

	const formatTitle = () => {
		switch (groupTasksBy) {
			case "Status":
				return formatStatus(title as Status);
			case "Assignee": {
				const user = users.find((user) => user.id === title);
				return user ? user.name : "Unassigned";
			}
			case "Priority":
				return formatPriority(title as Priority);
			// case "Label":
			// 	return
			case "Parent Issue": {
				const parentTask = tasks.find((t) => t.id === title);
				return parentTask ? parentTask.title : "No parent";
			}
			// case "No grouping":
			// 	return
		}
	};

	return (
		<div className={isListView ? "" : "pr-2 min-w-64"}>
			<div
				className={cn(
					"flex w-full bg-secondary items-center justify-between font-medium transition-all",
					isListView
						? "rounded-t-lg xs:px-5 sm:px-5 lg:px-[42px] py-2"
						: "flex-row rounded-lg px-2 h-10 mb-2 font-bold",
					isListView && numberOfTasks === 0 ? "rounded-b-lg" : "",
				)}
			>
				{!isListView ? (
					showTasks && (
						<div
							className={
								isListView
									? "flex items-center text-foreground text-sm"
									: "flex items-center gap-4 text-foreground text-sm pr-8"
							}
						>
							{/* <StatusIcon status={title} /> */}
							<div className="flex gap-2 items-center">
								<span className="text-sm">{formatTitle()}</span>
								<span className="ml-1 text-muted-foreground">
									{numberOfTasks}
								</span>
							</div>
						</div>
					)
				) : (
					<div
						className={`flex items-center text-foreground text-sm ${isListView && "ml-2 gap-4 pr-8"}`}
					>
						{/* <StatusIcon status={title} /> */}
						<div className="flex gap-2 items-center">
							<span>{formatTitle()}</span>
							<span className="ml-2 text-muted-foreground">
								{numberOfTasks}
							</span>
						</div>
					</div>
				)}
				<div className={cn("flex", isListView && "flex-row items-center")}>
					<Button
						onClick={handleClick}
						variant="ghost"
						size="icon"
						aria-label="Add task to column"
					>
						<CirclePlus className="size-5" />
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Show task visibility modal"
							>
								<EllipsisVertical className="cursor-pointer size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								onClick={() => setShowTasks(!showTasks)}
								className="cursor-pointer"
							>
								{showTasks ? "Hide" : "Unhide"}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
};

export default TaskColumnTitle;
