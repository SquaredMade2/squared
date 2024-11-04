import type { Priority, Status } from "@squared/db";
import {
	AlertTriangle,
	ArrowDown,
	ArrowRight,
	ArrowUp,
	CircleDot,
	Circle,
	Archive,
	CheckCircle2,
	Eye,
	HourglassIcon,
	Inbox,
	XCircle,
} from "lucide-react";

export const PriorityIcon = ({ priority }: { priority: Priority }) => {
	const Icon = () => {
		switch (priority) {
			case "low":
				return <ArrowDown className="size-4 text-blue-500 shrink-0" />;
			case "medium":
				return <ArrowRight className="size-4 text-yellow-500 shrink-0" />;
			case "high":
				return <ArrowUp className="size-4 text-orange-500 shrink-0" />;
			case "urgent":
				return <AlertTriangle className="size-4 text-destructive shrink-0" />;
			default:
				return <CircleDot className="size-4 shrink-0" />;
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
