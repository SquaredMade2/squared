"use client";

import {
	ContextMenuCheckboxItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { client } from "@/lib/client";
import { useTaskStore, useWorkspaceStore } from "@/store";
import type { Label } from "@squared/db";
import { useMutation } from "@tanstack/react-query";
import { Tag } from "lucide-react";
import { useState } from "react";
import { LabelColor } from "../TaskCardLabels";
import type { ContextMenuProps } from "./interfaces";

const LabelSubContextMenu = ({ task }: ContextMenuProps) => {
	const workspace = useWorkspaceStore((state) => state.workspace);
	const { updateTask } = useTaskStore((state) => state);

	const [labels, setLabels] = useState<Label[]>(
		workspace?.labels.filter((label) =>
			task.labels.map((l) => l.name).includes(label.name),
		) || [],
	);

	const { mutate: updateLabels } = useMutation({
		mutationKey: ["updateTaskLabels", task.id],
		mutationFn: async (updatedLabels: Label[]) => {
			const res = await client.task.updateLabels.$post({
				taskId: task.id,
				labels: updatedLabels,
			});
			const updatedTask = await res.json();
			updateTask(updatedTask);
			return updatedTask;
		},
	});

	const handleLabelChange = (label: Label, checked: boolean) => {
		const updatedLabels = checked
			? [...labels, label]
			: labels.filter((l) => l !== label);

		setLabels(updatedLabels);
		updateLabels(updatedLabels);
	};

	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>
				<div className="mr-2">
					<Tag className="size-4 cursor-pointer" />
				</div>
				Label
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				{workspace?.labels.map((label) => {
					return (
						<ContextMenuCheckboxItem
							key={label.name}
							checked={labels.some((l) => l === label)}
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
