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
import { useUsers } from "@/hooks/useUsers";
import {
	useModalStore,
	useSprintStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import { formatPriority, formatStatus, getInitials } from "@/utils/formatting";
import { PriorityIcon, StatusIcon } from "../Icons";
import type { TaskColumnTitleProps } from "./interfaces";
import { LabelColor } from "./TaskCard/TaskCardLabels";

const TaskColumnTitle = ({
	isListView,
	showTasks,
	title,
	numberOfTasks,
	setShowTasks,
}: TaskColumnTitleProps) => {
	const { setNewTaskData, setShowNewTask } = useModalStore((state) => state);
	const { displayOptions } = useViewStore((state) => state);
	const { groupTasksBy, groupRowsBy } = displayOptions;
	const { users } = useUsers();
	const workspace = useWorkspaceStore((state) => state.workspace);
	const { sprint } = useSprintStore((state) => state);
	const path = usePathname();

	const assignee = users?.find((u) => u.userId === title);
	const label = workspace?.labels.find((l) => l.name === title);
	const isRowGroupingActive = groupRowsBy !== "None";

	const getName = (user?: PublicUserData) => {
		return user?.firstName
			? `${user.firstName} ${user.lastName}`
			: "Unassigned";
	};

	const formatColumnTitle = (t: string) => {
		switch (groupTasksBy) {
			case "status":
				return formatStatus(t as Status);
			case "assignee":
				return getName(assignee);
			case "priority":
				return formatPriority(t as Priority);
			case "label":
				return label ? label.name : "No label";
			default:
				return t;
		}
	};

	const getTaskDataKey = () => {
		switch (groupTasksBy) {
			case "status":
				return "status";
			case "assignee":
				return "assigneeId";
			case "priority":
				return "priority";
			case "label":
				return "labels";
			default:
				return "status";
		}
	};

	const handleClick = (): void => {
		const key = getTaskDataKey();
		setNewTaskData({
			sprintId: path.includes("sprint") ? (sprint?.id ?? null) : null,
			[key]: title,
		});
		setShowNewTask(true);
	};

	const renderIcon = () => {
		if (groupTasksBy === "status") {
			return <StatusIcon status={title as Status} />;
		}

		if (groupTasksBy === "priority") {
			return <PriorityIcon priority={title as Priority} />;
		}

		if (groupTasksBy === "assignee" && assignee) {
			return (
				<Avatar className="size-4 text-xxs">
					<AvatarImage src={assignee.imageUrl ?? ""} />
					<AvatarFallback>{getInitials(getName(assignee))}</AvatarFallback>
				</Avatar>
			);
		}

		if (groupTasksBy === "label" && label) {
			return <LabelColor label={label} />;
		}

		return <div />;
	};

	const renderTitleContent = () => {
		const shouldShowContent = isListView || showTasks;

		if (!shouldShowContent) {
			return null;
		}

		const baseClasses = "flex items-center text-foreground text-sm";
		const listViewClasses = isListView ? "ml-2 gap-4 pr-8" : "gap-4 pr-8";

		return (
			<div className={cn(baseClasses, listViewClasses)}>
				{renderIcon()}
				<div className="flex items-center gap-2">
					<span className={cn(isListView ? "" : "max-w-36 truncate text-sm")}>
						{formatColumnTitle(title)}
					</span>
					<span
						className={cn(
							"text-muted-foreground",
							isListView ? "ml-2" : "ml-1",
						)}
					>
						{numberOfTasks}
					</span>
				</div>
			</div>
		);
	};

	const getContainerClasses = () => {
		const baseClasses = isListView
			? "sticky top-0 z-10 bg-background"
			: "min-w-72";
		const borderClasses = isListView ? "border-border border-b" : "";
		const stickyClasses =
			isRowGroupingActive && !isListView
				? "sticky top-0 z-10 bg-background"
				: "";

		return cn(baseClasses, borderClasses, stickyClasses);
	};

	const getHeaderClasses = () => {
		const baseClasses =
			"flex w-full items-center justify-between font-medium transition-all";

		const layoutClasses = isListView
			? "rounded-t-lg xs:px-5 py-2 sm:px-5 lg:px-[42px]"
			: "mb-2 h-10 flex-row rounded-lg bg-secondary px-2 font-bold";

		const roundedClasses =
			isListView && numberOfTasks === 0 ? "rounded-b-lg" : "";

		return cn(baseClasses, layoutClasses, roundedClasses);
	};

	return (
		<div className={getContainerClasses()}>
			<div className={getHeaderClasses()}>
				{renderTitleContent()}

				<div className={cn("flex", isListView && "flex-row items-center")}>
					<Button
						aria-label="Add task to column"
						onClick={handleClick}
						size="icon"
						variant="ghost"
					>
						<CirclePlus className="size-5" />
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild={true}>
							<Button
								aria-label="Show task visibility modal"
								size="icon"
								variant="ghost"
							>
								<EllipsisVertical className="size-4 cursor-pointer" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() => setShowTasks(!showTasks)}
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
