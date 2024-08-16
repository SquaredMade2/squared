import { type ReactElement, useState } from "react";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { high, medium, low } from "@/components/Svg";
import PriorityDropdown from "@/components/PriorityDropdown";
import { setBackgroundColor } from "../DesignationsContainer";
import type { PriorityButtonProps } from "./PriorityButton.interfaces";
import { CircleAlert, Ellipsis } from "lucide-react";

const PriorityButton = ({ location }: PriorityButtonProps) => {
	const newIssuePriority = useAppSelector((state) => state.taskData.priority);
	const sidebarPriority: string | undefined = useAppSelector((state) => {
		if (location === "issueSidebar") {
			return state.singleTask.data?.priority;
		}
		return undefined;
	});
	const labelsSelected = useAppSelector((state) => state.taskData.labels);
	const { theme } = useAppSelector((state) => state.userSettings);

	const handleBackground = () => {
		return theme === "light"
			? "bg-popover hover:bg-popoverHover"
			: "bg-popoverHover hover:bg-popover";
	};

	const [showDropdown, setShowDropdown] = useState(false);

	const newIssueButton = (): ReactElement => {
		return (
			<button
				type="button"
				className={`${
					labelsSelected?.length > 0 && !newIssuePriority
						? `border border-[0.8px] border-border rounded py-1 px-0.5 mr-2 cursor-pointer ${handleBackground()}`
						: `flex cursor-pointer items-center h-7 justify-center w-[60px] border-[0.8px] border border-border rounded px-2 py-0.5 mr-2 text-card-foreground text-sm shadow-md cursor-pointer ${handleBackground()}`
				}`}
				onClick={handleButtonClick}
			>
				<div className="w-4 h-4 cursor-pointer">
					{newIssuePriority ? (
						showIcon(newIssuePriority)
					) : (
						<Ellipsis className="size-4" />
					)}
				</div>
				{labelsSelected?.length === 0 && (
					<span className="text-sm flex font-semibold text-card-foreground cursor-pointer ml-3">
						{newIssuePriority !== null && newIssuePriority.length > 0
							? newIssuePriority
							: "Priority"}
					</span>
				)}
				{labelsSelected?.length > 0 && newIssuePriority && (
					<span className="text-sm flex font-semibold text-card-foreground cursor-pointer ml-3">
						{newIssuePriority}
					</span>
				)}
			</button>
		);
	};

	const issueSidebarButton = () => {
		return (
			<button
				type="button"
				className={`grow flex flex-row w-36 items-center border-[0.8px] border border-transparent hover:border-border rounded px-2 py-2 mr-2 text-card-foreground text-sm cursor-pointer ${setBackgroundColor(
					theme,
				)}`}
				onClick={handleButtonClick}
			>
				<span className="w-4 h-4 cursor-pointer">
					{sidebarPriority ? (
						showIcon(sidebarPriority)
					) : (
						<Ellipsis className="size-4" />
					)}
				</span>
				<span className="text-sm flex font-semibold text-card-foreground cursor-pointer ml-3">
					{sidebarPriority ? sidebarPriority : "No priority"}
				</span>
			</button>
		);
	};

	const handleButtonClick = (): void => {
		setShowDropdown(!showDropdown);
	};

	const handleClickAway = (): void => {
		setShowDropdown(!showDropdown);
	};

	const showIcon = (name: string): JSX.Element => {
		switch (name) {
			case "No priority":
				return <Ellipsis className="size-4" />;
			case "Urgent":
				return <CircleAlert className="size-4 fill-destructive" />;
			case "High":
				return high();
			case "Medium":
				return medium();
			case "Low":
				return low();
		}
		return <Ellipsis className="size-4" />;
	};

	return (
		<>
			<div
				className={
					location === "newIssue"
						? "relative flex items-center"
						: "relative grow mr-12"
				}
			>
				{location === "newIssue" && newIssueButton()}
				{location === "issueSidebar" && issueSidebarButton()}
				{showDropdown && (
					<PriorityDropdown
						location={location}
						handleButtonClick={handleButtonClick}
						showIcon={showIcon}
						handleClickAway={handleClickAway}
					/>
				)}
			</div>
		</>
	);
};

export default PriorityButton;
