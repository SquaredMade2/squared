import {
	useModalStore,
	useTeamStore,
	useUserStore,
	useWorkspaceStore,
} from "@/store";
import { useViewStore } from "@/store";
import { cn } from "@/utils/cn";
import { formatPriority, formatStatus, getInitials } from "@/utils/formatting";
import type { Priority, Status } from "@squared/db";
import { CirclePlus, EllipsisVertical } from "lucide-react";
import { usePathname } from "next/navigation";
import { PriorityIcon, StatusIcon } from "../Icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LabelColor } from "./TaskCard/TaskCardLabels";
import type { TaskColumnTitleProps } from "./interfaces";

const TaskColumnTitle = ({
	isListView,
	showTasks,
	title,
	numberOfTasks,
	setShowTasks,
}: TaskColumnTitleProps) => {
	const { setNewIssueData, setShowNewIssue } = useModalStore((state) => state);
	const { displayOptions } = useViewStore((state) => state);
	const { groupTasksBy } = displayOptions;
	const { users } = useUserStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { currentSprint } = useTeamStore((state) => state);
	const path = usePathname();
	const assignee = users.find((u) => u.id === title);
	const label = currentWorkspace?.Labels.find((l) => l.id === title);

	const formatColumnTitle = (title: string) => {
		switch (groupTasksBy) {
			case "Status":
				return formatStatus(title as Status);
			case "Assignee": {
				return assignee ? assignee.name : "Unassigned";
			}
			case "Priority":
				return formatPriority(title as Priority);
			case "Label": {
				return label ? label.name : "No label";
			}
			// case "Parent Issue": {
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
			// case "Parent Issue":
			// 	return "parentId";
			default:
				return "status";
		}
	})();

	const handleClick = (): void => {
		setNewIssueData({
			sprintId: path.includes("sprint") ? (currentSprint?.id ?? null) : null,
			[key]: title,
		});
		setShowNewIssue(true);
	};

	return (
		<div className={isListView ? "" : "min-w-64"}>
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
							{groupTasksBy === "Status" ? (
								<StatusIcon status={title as Status} />
							) : groupTasksBy === "Priority" ? (
								<PriorityIcon priority={title as Priority} />
							) : groupTasksBy === "Assignee" && assignee ? (
								<Avatar className="size-4 text-xxs">
									<AvatarImage src={assignee.avatarUrl ?? ""} />
									<AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
								</Avatar>
							) : groupTasksBy === "Label" && label ? (
								<LabelColor label={label} />
							) : (
								<div />
							)}
							<div className="flex gap-2 items-center">
								<span className="text-sm max-w-36 truncate">
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
								<AvatarImage src={assignee.avatarUrl ?? ""} />
								<AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
							</Avatar>
						) : groupTasksBy === "Label" && label ? (
							<LabelColor label={label} />
						) : (
							<div />
						)}
						<div className="flex gap-2 items-center">
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
