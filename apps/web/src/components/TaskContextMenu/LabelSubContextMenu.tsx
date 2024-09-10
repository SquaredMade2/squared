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

	const [labels, setLabels] = useState<Label[]>(task.labels);
	const { updateTask } = useTaskStore((state) => state);
	if (!workspaceLabels) {
		currentWorkspace && getWorkspaceLabels(currentWorkspace.id);
	}

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
							checked={labels.includes(label)}
							onCheckedChange={(checked) => {
								if (checked) {
									setLabels([...labels, label]);
								} else {
									setLabels(labels.filter((l) => l !== label));
								}
								updateTask(task.id, { labels });
							}}
						>
							<div className="mr-2">{<LabelColor label={label} />}</div>
							{label.name}
						</ContextMenuCheckboxItem>
					);
				})}
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default LabelSubContextMenu;
