import { Priority, Status } from "@squaredmade/db";
import {
	Archive,
	ArrowDown,
	ArrowRight,
	ArrowUp,
	Circle,
	CircleCheck,
	CircleDot,
	CircleX,
	Copy,
	Eye,
	Hourglass,
	Inbox,
	TriangleAlert,
} from "@squaredmade/icons";
import { cn } from "@squaredmade/ui/cn";

export const PriorityIcon = ({
	priority,
	className,
}: {
	priority: Priority;
	className?: string;
}) => {
	switch (priority) {
		case Priority.low:
			return (
				<ArrowDown className={cn("size-4 shrink-0 text-blue-500", className)} />
			);
		case Priority.medium:
			return (
				<ArrowRight
					className={cn("size-4 shrink-0 text-yellow-500", className)}
				/>
			);
		case Priority.high:
			return (
				<ArrowUp className={cn("size-4 shrink-0 text-orange-500", className)} />
			);
		case Priority.urgent:
			return (
				<TriangleAlert
					className={cn("size-4 shrink-0 text-destructive", className)}
				/>
			);
		default:
			return <CircleDot className={cn("size-4 shrink-0", className)} />;
	}
};

export const StatusIcon = ({ status }: { status: Status }) => {
	switch (status) {
		case Status.backlog:
			return <Inbox className="size-4 shrink-0 text-gray-500" />;
		case Status.todo:
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
		case Status.duplicated:
			return <Copy className="size-4 shrink-0 text-indigo-500" />;
		default:
			return null;
	}
};
