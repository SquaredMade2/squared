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
import type { ButtonProps } from "@/components/TaskDesignationsContainer/interfaces";
import { useTaskStore, useWorkspaceStore } from "@/store";
import type { Label } from "@repo/db";
import LabelBadge from "../LabelBadges";

const LabelColor = ({ color }: { color: string }) => (
	<div
		className="w-3 h-3 rounded-lg"
		style={{ backgroundColor: color.startsWith("#") ? color : `#${color}` }}
	/>
);

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
				{taskLabels.map((label: Label) => (
					<LabelBadge key={label.id} label={label} />
				))}
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
										<LabelColor color={label.color} />
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
