import { cn } from "@/utils/cn";
import type { Priority, Status } from "@squared/db";
import {
	Archive,
	ArrowDown,
	ArrowRight,
	ArrowUp,
	Circle,
	CircleCheck,
	CircleDot,
	CircleX,
	Eye,
	Hourglass,
	Inbox,
	TriangleAlert,
} from "@squared/icons";

export const PriorityIcon = ({
	priority,
	className,
}: { priority: Priority; className?: string }) => {
	const Icon = () => {
		switch (priority) {
			case "low":
				return (
					<ArrowDown
						className={cn("size-4 shrink-0 text-blue-500", className)}
					/>
				);
			case "medium":
				return (
					<ArrowRight
						className={cn("size-4 shrink-0 text-yellow-500", className)}
					/>
				);
			case "high":
				return (
					<ArrowUp
						className={cn("size-4 shrink-0 text-orange-500", className)}
					/>
				);
			case "urgent":
				return (
					<TriangleAlert
						className={cn("size-4 shrink-0 text-destructive", className)}
					/>
				);
			default:
				return <CircleDot className={cn("size-4 shrink-0", className)} />;
		}
	};
	return <Icon />;
};

export const StatusIcon = ({ status }: { status: Status }) => {
	switch (status) {
		case "backlog":
			return <Inbox className="size-4 shrink-0 text-gray-500" />;
		case "todo":
			return <Circle className="size-4 shrink-0 text-blue-500" />;
		case "inProgress":
			return <Hourglass className="size-4 shrink-0 text-yellow-500" />;
		case "inReview":
			return <Eye className="size-4 shrink-0 text-purple-500" />;
		case "done":
			return <CircleCheck className="size-4 shrink-0 text-green-500" />;
		case "canceled":
			return <CircleX className="size-4 shrink-0 text-red-500" />;
		case "archived":
			return <Archive className="size-4 shrink-0 text-gray-400" />;
		default:
			return null;
	}
};
