import React from "react";
import { LabelColor } from "../LabelDropdownButton";
import type { TaskCardLabelsProps } from "./TaskCardLabels.interfaces";

function TaskCardLabels({ labels, view }: TaskCardLabelsProps) {
	return (
		<div
			className={`flex items-center text-muted-foreground text-xs ${
				view === "grid" ? "flex-wrap" : "mr-5"
			}`}
		>
			{labels.map((el) => (
				<div
					className="flex items-center p-1 mr-1 mb-1 border border-border rounded"
					key={el.id}
				>
					<LabelColor label={el} />
					<span className="ml-1">{el.name}</span>
				</div>
			))}
		</div>
	);
}

export default TaskCardLabels;
