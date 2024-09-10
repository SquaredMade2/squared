import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { labelOptions } from "@/constants/designations";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Tag, Check } from "lucide-react";
import type {
	LabelDropdownButtonProps,
	LabelColorProps,
} from "./LabelDropdownButton.interfaces";
import { useModalStore, useTaskStore } from "@/storeZ";
import type { Label } from "@repo/db";

export const labelStyle: Record<string, string> = {
	Bug: "bg-[#EB5757]",
	Feature: "bg-[#BB87FC]",
	Improvement: "bg-[#4EA7FC]",
	Red: "bg-[#DB6E1F]",
	Test: "bg-[#95A2B3]",
};

export const LabelColor = ({ name }: LabelColorProps) => {
	return <div className={`w-3 h-3 rounded-lg ${labelStyle[name]}`} />;
};

const LabelDropdownButton = ({ location }: LabelDropdownButtonProps) => {
	const [open, setOpen] = useState(false);

	const { toast } = useToast();

	const { newIssueData, setNewIssueData } = useModalStore((state) => state);
	const { currentTask, getTask, updateTask } = useTaskStore((state) => state);

	const newIssueLabels = newIssueData.labels;
	const sidebarLabels = currentTask?.labels;
	const taskId = currentTask?.id;

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
					<LabelColor name={newIssueLabels[0]} />
					<span className="ml-2 cursor-pointer">{newIssueLabels[0]}</span>
				</>
			)}
			{newIssueLabels && newIssueLabels.length > 1 && (
				<>
					{
						// eslint-disable-next-line array-callback-return
						newIssueLabels.map((name, i) => {
							const multipleLabels = {
								1: "-mr-[5px]",
								2: "-mr-[5px]",
								3: "-mr-[5px]",
							} as Record<number, string>;

							const selectedMultipleLabels: string = multipleLabels[i + 1];
							if (i <= 2) {
								return (
									<div key={name} className={selectedMultipleLabels}>
										<LabelColor name={name} />
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

	const issueSidebarButton = () => (
		<div>
			{sidebarLabels?.map((name: string) => (
				<Button variant="outline" key={name} className="mb-1 rounded-full">
					<LabelColor name={name} />
					<span className="ml-3 cursor-pointer">{name}</span>
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

	const handleSelectLabels = (labelName: Label) => {
		let newLabelsSelected = [];

		if (location === "newIssue") {
			newLabelsSelected = newLabelSelection(newIssueLabels, labelName);
			setNewIssueData({ ...newIssueData, labels: newLabelsSelected ?? [] });
		}
		if (location === "issueSidebar" && sidebarLabels) {
			newLabelsSelected = newLabelSelection(sidebarLabels, labelName);
			if (taskId === undefined) return;
			updateTask(taskId, { labels: newLabelsSelected });
		}
	};

	const newLabelSelection = (
		currentLabels: Label[] | undefined,
		labelName: Label,
	) => {
		let newSelection = [];
		if (currentLabels === undefined) {
			newSelection = [labelName];
		} else if (currentLabels.length === 0) {
			newSelection = [labelName];
		} else {
			const nameFound = currentLabels.find((current) => current === labelName);
			if (nameFound) {
				newSelection = currentLabels.filter((current) => current !== labelName);
			} else {
				newSelection = [...currentLabels, labelName];
			}
		}
		return newSelection;
	};

	const renderButton = () =>
		location === "newIssue" ? newIssueLabelButton() : issueSidebarButton();

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>{renderButton()}</PopoverTrigger>
			<PopoverContent
				className="w-[170px] p-0"
				side={location === "issueSidebar" ? "left" : "bottom"}
				align="start"
			>
				<Command>
					<CommandInput placeholder="Search labels..." />
					<CommandList>
						<CommandEmpty>No label found.</CommandEmpty>
						<CommandGroup>
							{labelOptions.map((label) => (
								<CommandItem
									key={label}
									value={label}
									onSelect={(label) => handleSelectLabels(label as Label)}
									className="flex justify-between items-center px-2 py-1.5"
								>
									<div className="flex items-center">
										<LabelColor name={label} />
										<span className="ml-2">{label}</span>
									</div>
									{location === "newIssue" &&
										newIssueLabels?.includes(label) && (
											<Check className="size-4" />
										)}
									{location === "issueSidebar" &&
										sidebarLabels &&
										sidebarLabels.includes(label) && (
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
