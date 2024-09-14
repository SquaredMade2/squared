"use client";
import { useState, type FC } from "react";
import { Tag } from "lucide-react";
import type { LabelSubContextMenuProps } from "./interfaces";
import {
	ContextMenuCheckboxItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "../ui/context-menu";
import { useTaskStore } from "@/storeZ";
import { LabelColor } from "../LabelDropdownButton";
import { useWorkspaceStore } from "@/storeZ";
import type { Label } from "@repo/db";

const LabelSubContextMenu: FC<LabelSubContextMenuProps> = ({ task }) => {
	const { currentWorkspace, workspaceLabels, getWorkspaceLabels } =
		useWorkspaceStore((state) => state);

	const [labels, setLabels] = useState<Label[]>(
		workspaceLabels.filter((label) => task.labels.includes(label.id)),
	);
	const { updateTask } = useTaskStore((state) => state);

	if (!workspaceLabels) {
		currentWorkspace && getWorkspaceLabels(currentWorkspace.id);
	}

	const handleLabelChange = (label: Label, checked: boolean) => {
		// Calculate the updated labels before setting the state
		const updatedLabels = checked
			? [...labels, label]
			: labels.filter((l) => l.id !== label.id);

		setLabels(updatedLabels); // Update the state
		updateTask(task.id, { labels: updatedLabels.map((l) => l.id) }); // Update the task
	};

	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>
				<div className="mr-2">
					<Tag className="cursor-pointer size-4" />
				</div>
				Label
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				{workspaceLabels.map((label) => {
					return (
						<ContextMenuCheckboxItem
							key={label.id}
							checked={labels.some((l) => l.id === label.id)}
							onCheckedChange={(checked) => handleLabelChange(label, checked)}
						>
							<div className="mr-2">
								<LabelColor label={label} />
							</div>
							{label.name}
						</ContextMenuCheckboxItem>
					);
				})}
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default LabelSubContextMenu;
