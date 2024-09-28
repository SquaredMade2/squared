import { Calendar, UserSearch } from "lucide-react";

import { formatUrl, getInitials, truncateString } from "@/utils/formatting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useViewStore } from "@/store";
import TaskCardLabels from "./TaskCardLabels";
import type { TaskGridProps } from "./interfaces";
import { PriorityIcon, StatusIcon } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import LabelBadge from "@/components/LabelBadges";

const TaskGrid = ({
	teamIdentifier,
	task,
	user,
	currentTeam,
	taskLabels,
}: TaskGridProps) => {
	const { showDateTime, showPriority, showLabels } = useViewStore(
		(state) => state,
	);
	return (
		<Link
			href={`/${currentTeam?.name}/task/${task?.identifier}/${formatUrl(task.title)}`}
			className="cursor-pointer"
		>
			<Card className="w-80">
				<CardContent className="p-4 space-y-4">
					<div className="flex justify-between h-[20px] w-full">
						<p className="text-xs text-muted-foreground">{teamIdentifier}</p>
						{task.assigneeName ? (
							<Avatar className="size-6">
								<AvatarImage src={user?.avatarUrl ?? undefined} />
								<AvatarFallback className="text-xxs">
									{getInitials(task.assigneeName)}
								</AvatarFallback>
							</Avatar>
						) : (
							<UserSearch className="size-6 text-[#9597AD]" />
						)}
					</div>
					<div className="text-sm pr-8 w-full flex items-center">
						<Button
							variant="ghost"
							size="sm"
							className="mx-1 p-0 flex-shrink-0"
						>
							<StatusIcon status={task.status} />
						</Button>
						{truncateString(task.title, 70)}
					</div>
					<div className="flex flex-wrap w-full items-center gap-1">
						{showDateTime && (
							<div className="flex items-center gap-2 text-sm bg-background border border-border rounded-md w-fit p-1">
								<Calendar className="size-4" />
								{task.dueDate
									? formatDate(new Date(task.dueDate), "MMM dd")
									: "No Date Set"}
							</div>
						)}

						{showPriority && (
							<div className="bg-background border border-border rounded-md p-1">
								<PriorityIcon priority={task.priority} />
							</div>
						)}
						{showLabels &&
							taskLabels.map((label) => (
								<div key={label.id} className="label-badge flex-shrink">
									<LabelBadge label={label} />
								</div>
							))}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};

export default TaskGrid;
