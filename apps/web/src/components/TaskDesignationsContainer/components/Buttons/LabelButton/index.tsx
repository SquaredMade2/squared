import { useState, useEffect } from "react";
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
import type { ButtonProps } from "@/components/TaskDesignationsContainer/Button.interfaces";
import { useTaskStore, useWorkspaceStore, useActivityStore } from "@/storeZ";
import type { Label } from "@repo/db";

export const labelStyle: Record<string, string> = {
	Bug: "bg-[#EB5757]",
	Feature: "bg-[#BB87FC]",
	Improvement: "bg-[#4EA7FC]",
	Red: "bg-[#DB6E1F]",
	Test: "bg-[#95A2B3]",
};

export const LabelColor = ({ label }: { label: Label }) => {
	const { color } = label;
	const validatedColor = color.startsWith("#") ? color : `#${color}`;
	return (
		<div
			className="w-3 h-3 rounded-lg"
			style={{ backgroundColor: validatedColor }}
		/>
	);
};

const LabelButton = ({ currentTask }: ButtonProps) => {
	const [open, setOpen] = useState(false);
	const { currentWorkspace, workspaceLabels, getWorkspaceLabels } =
		useWorkspaceStore((state) => state);
	const [taskLabels, setTaskLabels] = useState<Label[]>(workspaceLabels);
	const { updateTask } = useTaskStore((state) => state);
	const { getTaskEvents } = useActivityStore((state) => state);
	const taskId = currentTask?.id;

	useEffect(() => {
		const fetchLabels = async () => {
			if (currentWorkspace) {
				const labels = await getWorkspaceLabels(currentWorkspace.id);
				setTaskLabels(labels);
			}
		};
		fetchLabels();
	}, [currentWorkspace]);

	const issueSidebarButton = () => (
		<div>
			{taskLabels?.map((label: Label) => (
				<Button variant="outline" key={label.id} className="mb-1 rounded-full">
					<LabelColor label={label} />
					<span className="ml-3 cursor-pointer">{label.name}</span>
				</Button>
			))}
			<Button variant="ghost">
				<span className="w-3 cursor-pointer">
					<Plus className="size-4 cursor-pointer mr-2" />
				</span>
				<span className="ml-1.5 cursor-pointer">Add label</span>
			</Button>
		</div>
	);

	const handleSelectLabels = async (labelName: Label) => {
		let newLabelsSelected = [];

		if (taskLabels) {
			newLabelsSelected = newLabelSelection(taskLabels, labelName);
			if (taskId === undefined) return;
			const labelIds = newLabelsSelected.map((label) => label.id);
			await updateTask(taskId, { labels: labelIds });
			await getTaskEvents(taskId);
		}
	};

	const newLabelSelection = (
		currentLabels: Label[] | undefined,
		label: Label,
	) => {
		let newSelection = [];
		if (currentLabels === undefined) {
			newSelection = [label];
		} else if (currentLabels.length === 0) {
			newSelection = [label];
		} else {
			const nameFound = currentLabels.find((current) => current === label);
			if (nameFound) {
				newSelection = currentLabels.filter((current) => current !== label);
			} else {
				newSelection = [...currentLabels, label];
			}
		}
		return newSelection;
	};

	if (!workspaceLabels) {
		currentWorkspace && getWorkspaceLabels(currentWorkspace.id);
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>{issueSidebarButton()}</PopoverTrigger>
			<PopoverContent className="w-[170px] p-0" side="left" align="start">
				<Command>
					<CommandInput placeholder="Search labels..." />
					<CommandList>
						<CommandEmpty>No label found.</CommandEmpty>
						<CommandGroup>
							{workspaceLabels.map((label) => (
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
									{taskLabels.length !== 0 && taskLabels.includes(label) && (
										<Check className="size-4" />
									)}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default LabelButton;
