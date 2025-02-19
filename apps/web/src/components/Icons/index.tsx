import { cn } from "@/utils/cn";
import { Priority, Status } from "@squared/db";
import {
	AlertTriangle,
	Archive,
	ArrowDown,
	ArrowRight,
	ArrowUp,
	CheckCircle2,
	Circle,
	CircleDot,
	Copy,
	Eye,
	HourglassIcon,
	Inbox,
	XCircle,
} from "lucide-react";

export const PriorityIcon = ({
	priority,
	className,
}: { priority: Priority; className?: string }) => {
	const Icon = () => {
		switch (priority) {
			case Priority.low:
				return (
					<ArrowDown
						className={cn("size-4 shrink-0 text-blue-500", className)}
					/>
				);
			case Priority.medium:
				return (
					<ArrowRight
						className={cn("size-4 shrink-0 text-yellow-500", className)}
					/>
				);
			case Priority.high:
				return (
					<ArrowUp
						className={cn("size-4 shrink-0 text-orange-500", className)}
					/>
				);
			case Priority.urgent:
				return (
					<AlertTriangle
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
		case Status.backlog:
			return <Inbox className="size-4 shrink-0 text-gray-500" />;
		case Status.todo:
			return <Circle className="size-4 shrink-0 text-blue-500" />;
		case Status.inProgress:
			return <HourglassIcon className="size-4 shrink-0 text-yellow-500" />;
		case Status.inReview:
			return <Eye className="size-4 shrink-0 text-purple-500" />;
		case Status.done:
			return <CheckCircle2 className="size-4 shrink-0 text-green-500" />;
		case Status.canceled:
			return <XCircle className="size-4 shrink-0 text-red-500" />;
		case Status.archived:
			return <Archive className="size-4 shrink-0 text-gray-400" />;
		case Status.duplicated:
			return <Copy className="size-4 shrink-0 text-indigo-500" />;
		default:
			return null;
	}
};
