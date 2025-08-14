import Link from "next/link";
import { useViewStore } from "@/store";
import { formatUrl } from "@/utils/formatting";
import IconBoxDropdown from "./IconBoxDropdown";
import type { TaskListProps } from "./interfaces";
import TaskCardLabels from "./TaskCardLabels";

const TaskList = ({
	highlightText,
	location,
	task,
	user,
	currentWorkspaceUrl,
	taskLabels,
}: TaskListProps) => {
	const { getListOptions } = useViewStore((state) => state);

	const {
		identifier: showIdentifier,
		dueDate: showDueDate,
		avatar: showAvatar,
		labels: showLabels,
		status: showStatus,
		priority: showPriority,
	} = getListOptions().displayProperties;

	return (
		<Link
			className="group/main grid w-full grid-cols-24 items-center border-border border-t border-solid bg-card py-2 hover:bg-accent"
			href={`/${currentWorkspaceUrl}/task/${task?.identifier}/${formatUrl(task.title)}`}
		>
			<div className="col-span-1 min-h-9" />
			<div className="col-span-23 grid grid-cols-10 pr-6 pl-2 lg:pl-0">
				<div className="col-span-10 text-foreground">
					<div className="flex w-full justify-between">
						<div className="flex min-w-0 items-center gap-2 text-base">
							{showPriority && <IconBoxDropdown priority={true} task={task} />}
							{showIdentifier && (
								<span className="xs:hidden min-w-28 shrink-0 cursor-pointer text-muted-foreground sm:hidden md:flex">
									{task.identifier}
								</span>
							)}
							{showStatus && <IconBoxDropdown status={true} task={task} />}
							<span className="min-w-0 truncate">
								{location === "search" && highlightText
									? highlightText(task.title)
									: task.title}
							</span>
						</div>
						<div className="col-span-4 flex items-center justify-end gap-2 lg:pr-5">
							{showLabels && <TaskCardLabels labels={taskLabels} />}
							{showDueDate && <IconBoxDropdown date={true} task={task} />}
							{showAvatar &&
								(user ? (
									<IconBoxDropdown avatar={true} task={task} user={user} />
								) : (
									<IconBoxDropdown task={task} userSearch={true} />
								))}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default TaskList;
