import { useUsers } from "@/hooks/useUsers";
import {
	useModalStore,
	useSprintStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import { formatPriority, formatStatus, getInitials } from "@/utils/formatting";
import type { PublicUserData } from "@clerk/types";
import type { Priority, Status } from "@squaredmade/db";
import { CirclePlus, EllipsisVertical } from "@squaredmade/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { Button } from "@squaredmade/ui/button";
import { cn } from "@squaredmade/ui/cn";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { PriorityIcon, StatusIcon } from "../Icons";
import { LabelColor } from "./TaskCard/TaskCardLabels";
import type { TaskColumnTitleProps } from "./interfaces";

const TaskColumnTitle = ({
	isListView,
	showTasks,
	title,
	numberOfTasks,
	setShowTasks,
}: TaskColumnTitleProps) => {
	const { setNewTaskData, setShowNewTask } = useModalStore((state) => state);
	const { displayOptions } = useViewStore((state) => state);
	const { groupTasksBy } = displayOptions;
	const { users } = useUsers();
	const workspace = useWorkspaceStore((state) => state.workspace);
	const { sprint } = useSprintStore((state) => state);
	const path = usePathname();
	const assignee = users?.find((u) => u.userId === title);
	const label = workspace?.labels.find((l) => l.name === title);
	const { groupRowsBy } = displayOptions;
	const isRowGroupingActive = groupRowsBy !== "None";

	const getName = (user?: PublicUserData) => {
		return user?.firstName
			? `${user.firstName} ${user.lastName}`
			: "Unassigned";
	};

	const formatColumnTitle = (title: string) => {
		switch (groupTasksBy) {
			case "Status":
				return formatStatus(title as Status);
			case "Assignee": {
				return getName(assignee);
			}
			case "Priority":
				return formatPriority(title as Priority);
			case "Label": {
				return label ? label.name : "No label";
			}
			// case "Parent Task": {
			// 	const parentTask = tasks.find((t) => t.id === title);
			// 	return parentTask ? parentTask.title : "No parent";
			// }
		}
	};

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

	const handleClick = (): void => {
		setNewTaskData({
			sprintId: path.includes("sprint") ? (sprint?.id ?? null) : null,
			[key]: title,
		});
		setShowNewTask(true);
	};

	return (
		<div
			className={cn(
				isListView ? "sticky top-0 z-10 bg-background" : "min-w-72",
				isListView && "border-border border-b",
				isRowGroupingActive && !isListView && "sticky top-0 z-10 bg-background",
			)}
		>
			<div
				className={cn(
					"flex w-full items-center justify-between font-medium transition-all",
					isListView
						? "rounded-t-lg xs:px-5 py-2 sm:px-5 lg:px-[42px]"
						: "mb-2 h-10 flex-row rounded-lg bg-secondary px-2 font-bold",
					isListView && numberOfTasks === 0 ? "rounded-b-lg" : "",
				)}
			>
				{!isListView ? (
					showTasks && (
						<div
							className={
								isListView
									? "flex items-center text-foreground text-sm"
									: "flex items-center gap-4 pr-8 text-foreground text-sm"
							}
						>
							{groupTasksBy === "Status" ? (
								<StatusIcon status={title as Status} />
							) : groupTasksBy === "Priority" ? (
								<PriorityIcon priority={title as Priority} />
							) : groupTasksBy === "Assignee" && assignee ? (
								<Avatar className="size-4 text-xxs">
									<AvatarImage src={assignee.imageUrl ?? ""} />
									<AvatarFallback>
										{getInitials(getName(assignee))}
									</AvatarFallback>
								</Avatar>
							) : groupTasksBy === "Label" && label ? (
								<LabelColor label={label} />
							) : (
								<div />
							)}
							<div className="flex items-center gap-2">
								<span className="max-w-36 truncate text-sm">
									{formatColumnTitle(title)}
								</span>
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
						{groupTasksBy === "Status" ? (
							<StatusIcon status={title as Status} />
						) : groupTasksBy === "Priority" ? (
							<PriorityIcon priority={title as Priority} />
						) : groupTasksBy === "Assignee" && assignee ? (
							<Avatar className="size-4 text-xxs">
								<AvatarImage src={assignee.imageUrl ?? ""} />
								<AvatarFallback>
									{getInitials(getName(assignee))}
								</AvatarFallback>
							</Avatar>
						) : groupTasksBy === "Label" && label ? (
							<LabelColor label={label} />
						) : (
							<div />
						)}
						<div className="flex items-center gap-2">
							<span>{formatColumnTitle(title)}</span>
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
								<EllipsisVertical className="size-4 cursor-pointer" />
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
