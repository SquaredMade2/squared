import { Card, CardContent } from "@squaredmade/ui/card";
import Link from "next/link";
import { useViewStore } from "@/store";
import { formatUrl, truncateString } from "@/utils/formatting";
import IconBoxDropdown from "./IconBoxDropdown";
import type { TaskGridProps } from "./interfaces";
import TaskCardLabels from "./TaskCardLabels";

const TaskGrid = ({
	task,
	user,
	taskLabels,
	currentWorkspaceUrl,
	isSubtask = false,
	isDisabled = false,
}: TaskGridProps) => {
	const { getGridOptions } = useViewStore((state) => state);

	const {
		identifier: showIdentifier,
		dueDate: showDueDate,
		avatar: showAvatar,
		labels: showLabels,
		priority: showPriority,
	} = getGridOptions().displayProperties;

	return (
		<Link
			className="cursor-pointer"
			href={`/${currentWorkspaceUrl}/task/${task?.identifier}/${formatUrl(task.title)}`}
		>
			<Card className={`w-full ${isSubtask ? "bg-secondary/30" : ""}`}>
				<CardContent className="space-y-4 p-4">
					<div className="flex h-[20px] w-full cursor-pointer justify-between">
						{showIdentifier ? (
							<p className="text-muted-foreground text-xs">{task.identifier}</p>
						) : (
							<div />
						)}
						{showAvatar &&
							(user ? (
								<IconBoxDropdown avatar={true} task={task} user={user} />
							) : (
								<IconBoxDropdown task={task} userSearch={true} />
							))}
					</div>

					<div className="flex w-full items-center gap-2 pr-8 text-sm">
						<IconBoxDropdown status={true} task={task} />
						{truncateString(task.title, 70)}
					</div>
					<div className="-my-1 flex w-full flex-wrap items-center gap-1">
						{showDueDate && task.dueDate && (
							<IconBoxDropdown date={true} task={task} />
						)}

						{showPriority && <IconBoxDropdown priority={true} task={task} />}

						{showLabels && <TaskCardLabels labels={taskLabels} />}
					</div>
					{isDisabled && (
						<span className="inline-block w-full text-end text-muted-foreground">
							BLOCKED
						</span>
					)}
				</CardContent>
			</Card>
		</Link>
	);
};

export default TaskGrid;
