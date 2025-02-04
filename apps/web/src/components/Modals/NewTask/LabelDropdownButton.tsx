import LabelBadge from "@/components/LabelBadges";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModalStore, useWorkspaceStore } from "@/store";
import type { Label } from "@squared/db";
import { Check, Tag } from "lucide-react";
import { useMemo, useState } from "react";

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
						key={label.name}
						className={`-mr-2.5 ${index > 0 ? "ml-1" : ""}`}
					>
						<LabelColor label={label} />
					</div>
				))}
				<span className="ml-4">{`${newTaskLabels.length} labels`}</span>
			</>
		);
	};

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="mr-2 w-full max-w-full">
					{renderLabelButton()}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-[170px] p-0" side="left" align="start">
				<Command>
					<CommandInput placeholder="Search labels..." />
					<CommandList>
						<CommandEmpty>No label found.</CommandEmpty>
						<CommandGroup>
							{taskLabels.map((label) => (
								<CommandItem
									key={label.name}
									value={label.name}
									onSelect={() => handleSelectLabels(label)}
									className="flex cursor-pointer items-center justify-between px-2 py-1.5"
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
