import React, { useState, useEffect, type ReactNode } from "react";
import { high, medium, low } from "@/components/Svg";
import type { TaskCardPriorityProps } from "./TaskCardPriority.interfaces";
import { Ellipsis } from "lucide-react";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
const TaskCardPriority = ({ task, border }: TaskCardPriorityProps) => {
	const [svg, setSvg] = useState<ReactNode>();
	const { theme } = useTheme();
	const iconGray = theme === "dark" ? "#DCD8FE" : "#000";

	useEffect(() => {
		switch (task.priority) {
			case null:
				setSvg(<Ellipsis className="size-4" />);
				break;
			case "low":
				setSvg(low);
				break;
			case "medium":
				setSvg(medium);
				break;
			case "high":
				setSvg(high);
				break;
			case "urgent":
				setSvg(
					<FontAwesomeIcon
						className="text-muted-foreground"
						icon={faExclamation}
					/>,
				);
				break;
			default:
				setSvg(<Ellipsis className="size-4" />);
		}
	}, [task.priority, iconGray]);
	return (
		<button
			className={
				border
					? "border border-border mb-2 mt-1 w-6 h-5 flex items-center justify-center p-0.5 rounded"
					: "w-5 flex items-center justify-center p-0.5 rounded"
			}
			type="button"
		>
			{svg}
		</button>
	);
};

export default TaskCardPriority;
