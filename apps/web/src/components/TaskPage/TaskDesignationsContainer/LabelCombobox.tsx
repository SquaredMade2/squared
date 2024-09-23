import { useState, useMemo } from "react";
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
import { Plus, Check } from "lucide-react";
import type { ButtonProps } from "./interfaces";
import { useTaskStore, useWorkspaceStore } from "@/store";
import type { Label } from "@repo/db";
import LabelBadge from "../../LabelBadges";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../../ui/tooltip";

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

const LabelCombobox = ({ currentTask }: ButtonProps) => {
	const [open, setOpen] = useState(false);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { updateTask } = useTaskStore((state) => state);
	const taskId = currentTask?.id;

	const allLabels = useMemo(
		() => currentWorkspace?.Labels || [],
		[currentWorkspace],
	);

	const taskLabels = useMemo(
		() => allLabels.filter((label) => currentTask?.labels.includes(label.id)),
		[allLabels, currentTask?.labels],
	);

	const handleSelectLabels = async (selectedLabel: Label) => {
		if (!taskId) return;

		const updatedLabels = taskLabels.some(
			(label) => label.id === selectedLabel.id,
		)
			? taskLabels.filter((label) => label.id !== selectedLabel.id)
			: [...taskLabels, selectedLabel];

		const labelIds = updatedLabels.map((label) => label.id);
		await updateTask(taskId, { labels: labelIds });
	};

	const renderLabels = () => (
		<div className="flex flex-col">
			<div className="mb-2 space-x-1 space-y-1">
				<TooltipProvider>
					{taskLabels.map((label: Label) => (
						<Tooltip key={label.id}>
							<TooltipTrigger>
								<LabelBadge label={label} />
							</TooltipTrigger>
							<TooltipContent>{label.description}</TooltipContent>
						</Tooltip>
					))}
				</TooltipProvider>
			</div>
			<Button variant="ghost">
				<Plus className="size-4 mr-2" />
				<span className="ml-1.5">Add label</span>
			</Button>
		</div>
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>{renderLabels()}</PopoverTrigger>
			<PopoverContent className="w-[170px] p-0" side="left" align="start">
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
	);
};

export default LabelCombobox;
