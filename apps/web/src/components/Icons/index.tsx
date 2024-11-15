import { cn } from "@/utils/cn";
import type { Priority, Status } from "@squared/db";
import {
	AlertTriangle,
	Archive,
	ArrowDown,
	ArrowRight,
	ArrowUp,
	CheckCircle2,
	Circle,
	CircleDot,
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
			case "low":
				return (
					<ArrowDown
						className={cn("size-4 text-blue-500 shrink-0", className)}
					/>
				);
			case "medium":
				return (
					<ArrowRight
						className={cn("size-4 text-yellow-500 shrink-0", className)}
					/>
				);
			case "high":
				return (
					<ArrowUp
						className={cn("size-4 text-orange-500 shrink-0", className)}
					/>
				);
			case "urgent":
				return (
					<AlertTriangle
						className={cn("size-4 text-destructive shrink-0", className)}
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
			return <HourglassIcon className="size-4 shrink-0 text-yellow-500" />;
		case "inReview":
			return <Eye className="size-4 shrink-0 text-purple-500" />;
		case "done":
			return <CheckCircle2 className="size-4 shrink-0 text-green-500" />;
		case "canceled":
			return <XCircle className="size-4 shrink-0 text-red-500" />;
		case "archived":
			return <Archive className="size-4 shrink-0 text-gray-400" />;
		default:
			return null;
	}
};
