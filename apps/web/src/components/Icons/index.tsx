import type { Priority } from "@repo/db";
import {
	AlertTriangle,
	ArrowDown,
	ArrowRight,
	ArrowUp,
	CircleDot,
} from "lucide-react";

export const PriorityIcon = ({ priority }: { priority: Priority }) => {
	const Icon = () => {
		switch (priority) {
			case "low":
				return <ArrowDown className="size-4 text-blue-500" />;
			case "medium":
				return <ArrowRight className="size-4 text-yellow-500" />;
			case "high":
				return <ArrowUp className="size-4 text-orange-500" />;
			case "urgent":
				return <AlertTriangle className="size-4 text-destructive" />;
			default:
				return <CircleDot className="size-4" />;
		}
	};
	return <Icon />;
};
