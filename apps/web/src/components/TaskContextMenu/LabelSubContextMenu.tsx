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

const LabelSubContextMenu: FC<LabelSubContextMenuProps> = ({ task }) => {
	const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);

	const [labels, setLabels] = useState<string[]>(task.labels);
	const { updateTask } = useTaskStore((state) => state);

	const renderLabelIcon = (label: string) => {
		switch (label) {
			case "Bug":
				return <LabelColor name={"Bug"} />;
			case "Feature":
				return <LabelColor name={"Feature"} />;
			case "Improvement":
				return <LabelColor name={"Improvement"} />;
			case "Red":
				return <LabelColor name={"Red"} />;
			case "Test":
				return <LabelColor name={"Test"} />;
			default:
				return null;
		}
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
				{currentWorkspace?.workspaceLabels.map((label) => {
					return (
						<ContextMenuCheckboxItem
							key={label}
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
							<div className="mr-2">{renderLabelIcon(label)}</div>
							{label}
						</ContextMenuCheckboxItem>
					);
				})}
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default LabelSubContextMenu;
