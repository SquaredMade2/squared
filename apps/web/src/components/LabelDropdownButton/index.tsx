import { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import type { RootState } from "@/store";
import { setLabels } from "@/store/taskData";
import { labelOptions } from "@/constants/designations";
import { setBackgroundColor } from "../DesignationsContainer";
import LabelDropdown from "@/components/LabelDropdown";
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
// import {
// 	DropdownMenu,
// 	DropdownMenuTrigger,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuRadioGroup,
// } from "../ui/dropdown-menu";

import type {
	LabelDropdownButtonProps,
	LabelColorProps,
} from "./LabelDropdownButton.interfaces";

export const labelStyle: Record<string, string> = {
	Bug: "w-3 h-3 rounded-lg bg-[#EB5757]",
	Feature: "w-3 h-3 rounded-lg bg-[#BB87FC]",
	Improvement: "w-3 h-3 rounded-lg bg-[#4EA7FC]",
	Red: "w-3 h-3 rounded-lg bg-[#DB6E1F]",
	Test: "w-3 h-3 rounded-lg bg-[#95A2B3]",
};

export const LabelColor = ({ name }: LabelColorProps) => {
	return <div className={labelStyle[name]} />;
};

const LabelDropdownButton = ({ location }: LabelDropdownButtonProps) => {
	const [open, setOpen] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const [value, setValue] = useState("");

	const dispatch = useAppDispatch();

	const newIssueLabels = useAppSelector(
		(state: RootState) => state.taskData.labels,
	);
	const newIssuePriority = useAppSelector(
		(state: RootState) => state.taskData.priority,
	);
	const sidebarLabels = useAppSelector(
		(state: RootState) => state.singleTask.data?.labels,
	);
	const taskId = useAppSelector(
		(state: RootState) => state.singleTask?.data?._id,
	);
	const { theme } = useAppSelector((state: RootState) => state.userSettings);

	const handleBackground = () => {
		return theme === "light"
			? "bg-popover hover:bg-popoverHover"
			: "bg-popoverHover hover:bg-popover";
	};

	const newIssueLabelButton = () => (
		<Button variant="outline" className="w-[170px] mr-2">
			{newIssueLabels.length === 0 && (
				<>
					<div>
						<Tag className="size-4 cursor-pointer" />
					</div>
					<span className="text-sm font-semibold text-card-foreground ml-2">
						Label
					</span>
				</>
			)}
			{newIssueLabels.length === 1 && (
				<div className="flex items-center">
					<LabelColor name={newIssueLabels[0]} />
					<span className="text-sm font-semibold text-card-foreground ml-2">
						{newIssueLabels[0]}
					</span>
				</div>
			)}
			{newIssueLabels && newIssueLabels.length > 1 && (
				<div className="flex items-center">
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
					<span className="text-sm font-semibold text-card-foreground ml-2 cursor-pointer">{`${newIssueLabels.length} labels`}</span>
				</div>
			)}
		</Button>
	);

	const issueSidebarButton = () => {
		return (
			<div>
				{sidebarLabels?.map((name: string) => {
					return (
						<button
							type="button"
							key={name}
							className={`inline-flex cursor-pointer items-center border border-border hover:border-border rounded-3xl px-3 py-1 m-1 text-sm ${setBackgroundColor(
								theme,
							)} ${handleBackground()} group`}
							onClick={handleButtonClick}
						>
							<LabelColor name={name} />
							<span className="ml-3 text-sm font-semibold text-card-foreground cursor-pointer group-hover:text-foreground">
								{name}
							</span>
						</button>
					);
				})}
				<button
					type="button"
					className="inline-flex cursor-pointer items-center border border-border hover:border-border rounded-3xl px-3 py-1 my-1 ml-0.5 text-card-foreground text-xs"
					onClick={handleButtonClick}
				>
					<span className="w-3 cursor-pointer">
						<Plus className="size-4 cursor-pointer mr-2" />
					</span>
					<span className="ml-1.5 text-sm font-semibold text-card-foreground cursor-pointer">
						Add label
					</span>
				</button>
			</div>
		);
	};

	const handleSelectLabels = (labelName: string) => {
		let newLabelsSelected = [];
		if (location === "newIssue") {
			newLabelsSelected = newLabelSelection(newIssueLabels, labelName);
			dispatch(setLabels(newLabelsSelected));
		}
		// if (location === "issueSidebar" && sidebarLabels) {
		// 	newLabelsSelected = newLabelSelection(sidebarLabels, labelName);
		// 	if (taskId !== undefined) storeCommonFields(author, taskId);
		// 	logEvent(newLabelsSelected);
		// 	updateItem(newLabelsSelected);
		// }
	};

	const newLabelSelection = (currentLabels: string[], labelName: string) => {
		let newSelection = [];
		if (currentLabels.length === 0) {
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

	const handleButtonClick = () => {
		setShowDropdown(!showDropdown);
	};

	const handleClickAway = () => {
		setShowDropdown(!showDropdown);
	};

	const renderButton = () =>
		location === "newIssue" ? newIssueLabelButton() : issueSidebarButton();

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>{renderButton()}</PopoverTrigger>
			<PopoverContent className="w-[170px] p-0" side="bottom">
				<Command>
					<CommandInput placeholder="Search framework..." />
					<CommandList>
						<CommandEmpty>No label found.</CommandEmpty>
						<CommandGroup>
							{labelOptions.map((label) => (
								<CommandItem
									key={label}
									value={label}
									onSelect={(label) => handleSelectLabels(label)}
									className="flex justify-between items-center px-2 py-1.5"
								>
									<div className="flex items-center">
										<LabelColor name={label} />

										<span className="ml-2">{label}</span>
									</div>
									{newIssueLabels.includes(label) && <Check />}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>

			{/* <div
				className={
					location === "newIssue"
						? "relative"
						: "relative flex flex-row flex-wrap"
				}
			>
				{location === "newIssue" && newIssueLabelButton()}
				{location === "issueSidebar" && issueSidebarButton()}
				{showDropdown && (
					<LabelDropdown
						labelOptions={labelOptions}
						location={location}
						handleButtonClick={handleButtonClick}
						handleClickAway={handleClickAway}
					/>
				)}
			</div> */}
		</Popover>
	);
};

export default LabelDropdownButton;
