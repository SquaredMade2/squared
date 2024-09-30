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
import { Tag, Check } from "lucide-react";
import { useModalStore, useWorkspaceStore } from "@/store";
import type { Label } from "@repo/db";
import LabelBadge from "@/components/LabelBadges";

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

export const LabelDropdownButton = () => {
	const [open, setOpen] = useState(false);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { newIssueData, setNewIssueData } = useModalStore((state) => state);

	const taskLabels = useMemo(
		() => currentWorkspace?.Labels || [],
		[currentWorkspace],
	);
	const newIssueLabels = useMemo(
		() => taskLabels.filter((label) => newIssueData.labels?.includes(label.id)),
		[taskLabels, newIssueData.labels],
	);

	const handleSelectLabels = (selectedLabel: Label) => {
		const updatedLabels = newIssueLabels.includes(selectedLabel)
			? newIssueLabels.filter((label) => label.id !== selectedLabel.id)
			: [...newIssueLabels, selectedLabel];

		setNewIssueData({
			...newIssueData,
			labels: updatedLabels.map((label) => label.id),
		});
	};

	const renderLabelButton = () => {
		if (newIssueLabels.length === 0) {
			return (
				<>
					<Tag className="size-4" />
					<span className="ml-2">Label</span>
				</>
			);
		}

		if (newIssueLabels.length === 1) {
			return (
				<>
					<LabelColor label={newIssueLabels[0]} />
					<span className="ml-2">{newIssueLabels[0].name}</span>
				</>
			);
		}

		return (
			<>
				{newIssueLabels.map((label, index) => (
					<div key={label.id} className={`-mr-2.5 ${index > 0 ? "ml-1" : ""}`}>
						<LabelColor label={label} />
					</div>
				))}
				<span className="ml-4">{`${newIssueLabels.length} labels`}</span>
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
									{newIssueLabels.includes(label) && (
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
