"use client";

import { LabelColor } from "@/components/ViewAllTasks/TaskCard/TaskCardLabels";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { taskService } from "@/lib/services";
import { useTaskStore, useUserStore, useWorkspaceStore } from "@/store";
import { TODO } from "@squared/context";
import type { Label } from "@squared/db";
import { Check, Plus, Tag } from "lucide-react";
import { useMemo, useState } from "react";
import LabelBadge from "../../LabelBadges";

const LabelColor = ({ label }: { label: Label }) => {
	const { color } = label;
	const validatedColor = color.startsWith("#") ? color : `#${color}`;
	return (
		<div
			className="w-3 h-3 rounded-lg"
			style={{ backgroundColor: validatedColor }}
		/>
	);
};

const LabelCombobox = () => {
	const [open, setOpen] = useState(false);
	const workspace = useWorkspaceStore((state) => state.workspace);
	const user = useUserStore((store) => store.user);
	const { currentTask, setCurrentTask, updateTask } = useTaskStore(
		(state) => state,
	);

	if (!currentTask) return null;

	const { id: taskId, labels } = currentTask;

	const allLabels = useMemo(() => workspace?.Labels || [], [workspace]);

	const taskLabels = useMemo(
		() => allLabels.filter((label) => labels.includes(label.id)),
		[allLabels, labels],
	);

	const handleSelectLabels = async (selectedLabel: Label) => {
		if (!taskId) return;

		const updatedLabels = taskLabels.some(
			(label) => label.id === selectedLabel.id,
		)
			? taskLabels.filter((label) => label.id !== selectedLabel.id)
			: [...taskLabels, selectedLabel];

		const labelIds = updatedLabels.map((label) => label.id);
		updateTask(
			await taskService.updateTask(TODO, {
				id: taskId,
				updaterId: user?.id || "",
				labels: labelIds,
			}),
		);
		setCurrentTask({ ...currentTask, labels: labelIds });
		setOpen(false);
	};

	const renderLabelButton = () => {
		if (taskLabels.length === 0)
			return (
				<>
					<Tag className="size-4" />
					<span className="ml-2">Label</span>
				</>
			);
		if (taskLabels.length === 1)
			return (
				<>
					<LabelColor label={taskLabels[0]} />
					<span className="ml-2">{taskLabels[0].name}</span>
				</>
			);
		return (
			<div className="flex items-center">
				{taskLabels.map((label, index) => (
					<div key={label.id} className={`-mr-2.5 ${index > 0 ? "ml-1" : ""}`}>
						<LabelColor label={label} />
					</div>
				))}
				<span className="ml-4">{`${taskLabels.length} labels`}</span>
			</div>
		);
	};

	return (
		<div className="md:w-full">
			<div className="hidden md:block w-full">
				<div className="mb-5 space-x-2 space-y-1">
					<TooltipProvider>
						{taskLabels.map((label: Label) => (
							<Tooltip key={label.id}>
								<TooltipTrigger asChild>
									<span>
										<LabelBadge label={label} />
									</span>
								</TooltipTrigger>
								<TooltipContent>{label.description}</TooltipContent>
							</Tooltip>
						))}
					</TooltipProvider>
				</div>
			</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className="md:w-full justify-start w-fit h-8 md:h-10"
					>
						<>
							<div className="hidden md:flex">
								<Plus className="size-4 mr-2" />
								<span className="ml-1.5">Add label</span>
							</div>
							<div className="md:hidden">{renderLabelButton()}</div>
						</>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-[200px] p-0"
					side="right"
					align="start"
					sideOffset={5}
				>
					<Command>
						<CommandInput placeholder="Search labels..." />
						<CommandList>
							<CommandEmpty>No label found.</CommandEmpty>
							<CommandGroup>
								{allLabels.map((label) => (
									<CommandItem
										key={label.id}
										value={label.name}
										onSelect={() => handleSelectLabels(label)}
										className="flex justify-between items-center px-2 py-1.5"
									>
										<div className="flex items-center">
											<LabelColor label={label} />
											<span className="ml-2">{label.name}</span>
										</div>
										{taskLabels.some(
											(taskLabel) => taskLabel.id === label.id,
										) && <Check className="size-4" />}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default LabelCombobox;
