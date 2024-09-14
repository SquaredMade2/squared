import { useState } from "react";
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
import type { DesignationsContainerProps } from "../DesignationsContainer/DesignationsContainer.interfaces";
import { useWorkspaceStore } from "@/storeZ";
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

const LabelDropdownButton = ({
	newIssueData,
	setNewIssueData,
}: DesignationsContainerProps) => {
	const [open, setOpen] = useState(false);
	const { workspaceLabels } = useWorkspaceStore((state) => state);
	const [taskLabels, setTaskLabels] = useState<Label[]>(workspaceLabels);

	const newIssueLabels = workspaceLabels.filter((label) =>
		newIssueData.labels?.includes(label.id),
	);

	const newIssueLabelButton = () => (
		<Button variant="outline" className="w-[170px] mr-2">
			{newIssueLabels?.length === 0 && (
				<>
					<Tag className="size-4 cursor-pointer" />
					<span className="ml-2 cursor-pointer">Label</span>
				</>
			)}
			{newIssueLabels?.length === 1 && (
				<>
					<LabelColor label={newIssueLabels[0]} />
					<span className="ml-2 cursor-pointer">{newIssueLabels[0].name}</span>
				</>
			)}
			{newIssueLabels && newIssueLabels.length > 1 && (
				<>
					{
						// eslint-disable-next-line array-callback-return
						taskLabels.map((label, i) => {
							const multipleLabels = {
								1: "-mr-[5px]",
								2: "-mr-[5px]",
								3: "-mr-[5px]",
							} as Record<number, string>;

							const selectedMultipleLabels: string = multipleLabels[i + 1];
							if (i <= 2) {
								return (
									<div key={label.id} className={selectedMultipleLabels}>
										<LabelColor label={label} />
									</div>
								);
							}
						})
					}
					<span className="ml-2 cursor-pointer">{`${newIssueLabels.length} labels`}</span>
				</>
			)}
		</Button>
	);

	const handleSelectLabels = async (labelName: Label) => {
		let newLabelsSelected = [];

		newLabelsSelected = newLabelSelection(newIssueLabels, labelName);
		setNewIssueData({
			...newIssueData,
			labels: newLabelsSelected.map((el) => el.id) ?? [],
		});
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

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>{newIssueLabelButton()}</PopoverTrigger>
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

export default LabelDropdownButton;
