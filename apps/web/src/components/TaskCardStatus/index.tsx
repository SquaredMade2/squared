import React, { useState, useEffect, type ReactNode } from "react";
import { filterInProgress } from "@/components/Svg";
import type { TaskCardStatusProps } from "@/app/interfaces/Tasks.interfaces";
import {
	Circle,
	CircleCheckBig,
	CircleDashed,
	CircleFadingPlus,
	CircleX,
} from "lucide-react";

const TaskCardStatus = ({ task }: TaskCardStatusProps) => {
	const [svg, setSvg] = useState<ReactNode>();

	useEffect(() => {
		switch (task.status) {
			case "backlog":
				setSvg(<CircleDashed className="size-4" />);
				break;
			case "todo":
				setSvg(<Circle className="size-4" />);
				break;
			case "inProgress":
				setSvg(filterInProgress);
				break;
			case "inReview":
				setSvg(<CircleFadingPlus className="size-4 text-green-400" />);
				break;
			case "done":
				setSvg(<CircleCheckBig className="size-4 text-[#7394FF]" />);
				break;
			default:
				setSvg(<Circle className="size-4" />);
		}
	}, [task.status]);
	return (
		<button type="button" className="mx-1">
			{svg}
		</button>
	);
};

export default TaskCardStatus;
