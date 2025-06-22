import type { Label } from "@squaredmade/db";
import { Check, Tag } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";
import { useMemo, useState } from "react";
import LabelBadge from "@/components/LabelBadges";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { LabelColor } from "@/components/ViewAllTasks/TaskCard/TaskCardLabels";
import { useModalStore, useWorkspaceStore } from "@/store";

export const LabelDropdownButton = () => {
	const [open, setOpen] = useState(false);
	const workspace = useWorkspaceStore((state) => state.workspace);
	const { newTaskData, setNewTaskData } = useModalStore((state) => state);

	const taskLabels = useMemo(() => workspace?.labels || [], [workspace]);
	const newTaskLabels = useMemo(
		() => taskLabels.filter((label) => newTaskData.labels?.includes(label)),
		[taskLabels, newTaskData.labels],
	);

	const handleSelectLabels = (selectedLabel: Label) => {
		const updatedLabels = newTaskLabels.includes(selectedLabel)
			? newTaskLabels.filter((label) => label !== selectedLabel)
			: [...newTaskLabels, selectedLabel];

		setNewTaskData({
			...newTaskData,
			labels: updatedLabels.map((label) => label),
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
					<div
						className={`-mr-2.5 ${index > 0 ? "ml-1" : ""}`}
						key={label.name}
					>
						<LabelColor label={label} />
					</div>
				))}
				<span className="ml-4">{`${newTaskLabels.length} labels`}</span>
			</>
		);
	};

	return (
		<DropdownMenu onOpenChange={setOpen} open={open}>
			<DropdownMenuTrigger asChild>
				<Button className="mr-2 w-full max-w-full" variant="outline">
					{renderLabelButton()}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[170px] p-0" side="left">
				<Command>
					<CommandInput placeholder="Search labels..." />
					<CommandList>
						<CommandEmpty>No label found.</CommandEmpty>
						<CommandGroup>
							{taskLabels.map((label) => (
								<CommandItem
									className="flex cursor-pointer items-center justify-between px-2 py-1.5"
									key={label.name}
									onSelect={() => handleSelectLabels(label)}
									value={label.name}
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
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
