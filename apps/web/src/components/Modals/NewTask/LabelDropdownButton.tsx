import LabelBadge from "@/components/LabelBadges";
import { LabelColor } from "@/components/ViewAllTasks/TaskCard/TaskCardLabels";
import { Button } from "@squared/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@squared/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@squared/ui/popover";
import { useModalStore, useWorkspaceStore } from "@/store";
import type { Label } from "@squared/db";
import { Check, Tag } from "lucide-react";
import { useMemo, useState } from "react";

export const LabelDropdownButton = () => {
	const [open, setOpen] = useState(false);
	const workspace = useWorkspaceStore((state) => state.workspace);
	const { newTaskData, setNewTaskData } = useModalStore((state) => state);

	const taskLabels = useMemo(() => workspace?.Labels || [], [workspace]);
	const newTaskLabels = useMemo(
		() => taskLabels.filter((label) => newTaskData.labels?.includes(label.id)),
		[taskLabels, newTaskData.labels],
	);

	const handleSelectLabels = (selectedLabel: Label) => {
		const updatedLabels = newTaskLabels.includes(selectedLabel)
			? newTaskLabels.filter((label) => label.id !== selectedLabel.id)
			: [...newTaskLabels, selectedLabel];

		setNewTaskData({
			...newTaskData,
			labels: updatedLabels.map((label) => label.id),
		});
	};

	const renderLabelButton = () => {
		if (newTaskLabels.length === 0) {
			return (
				<>
					<Tag className="size-4" />
					<span className="ml-2">Label</span>
				</>
			);
		}

		if (newTaskLabels.length === 1) {
			return (
				<>
					<LabelColor label={newTaskLabels[0]} />
					<span className="ml-2">{newTaskLabels[0].name}</span>
				</>
			);
		}

		return (
			<>
				{newTaskLabels.map((label, index) => (
					<div key={label.id} className={`-mr-2.5 ${index > 0 ? "ml-1" : ""}`}>
						<LabelColor label={label} />
					</div>
				))}
				<span className="ml-4">{`${newTaskLabels.length} labels`}</span>
			</>
		);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" className="max-w-full w-full mr-2">
					{renderLabelButton()}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[170px] p-0" side="left" align="start">
				<Command>
					<CommandInput placeholder="Search labels..." />
					<CommandList>
						<CommandEmpty>No label found.</CommandEmpty>
						<CommandGroup>
							{taskLabels.map((label) => (
								<CommandItem
									key={label.id}
									value={label.name}
									onSelect={() => handleSelectLabels(label)}
									className="flex justify-between items-center px-2 py-1.5 cursor-pointer"
								>
									<LabelBadge label={label} />
									{newTaskLabels.includes(label) && (
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
