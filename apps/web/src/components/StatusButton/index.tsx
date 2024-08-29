import { useState } from "react";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import StatusDropdown from "@/components/StatusDropdown";
import { Button } from "@/components/ui/button";
import { setBackgroundColor } from "../DesignationsContainer";
import type { StatusButtonProps } from "./StatusButton.interfaces";
import {
	Circle,
	CircleCheckBig,
	CircleDashed,
	CircleX,
	Copy,
} from "lucide-react";
import { inProgress } from "../Svg";

const StatusButton = ({ location }: StatusButtonProps) => {
	const newIssueStatus = useAppSelector((state) => state.taskData.status);
	const sidebarStatus: string | undefined = useAppSelector(
		(state) => state.singleTask.data?.status,
	);
	const { theme } = useAppSelector((state) => state.userSettings);

	const [showDropdown, setShowDropdown] = useState(false);

	const handleButtonClick = () => {
		setShowDropdown(!showDropdown);
	};

	const handleClickAway = () => {
		setShowDropdown(!showDropdown);
	};

	const handleBackground = () => {
		return theme === "light"
			? "bg-popover hover:bg-popoverHover"
			: "bg-popoverHover hover:bg-popover";
	};

	const showIcon = (name: string | undefined) => {
		switch (name) {
			case "Backlog":
				return <CircleDashed className="size-4" />;
			case "Todo":
				return <Circle className="size-4" />;
			case "In Progress":
				return inProgress();
			case "Done":
				return <CircleCheckBig className="size-4 text-[#7394FF]" />;
			case "Canceled":
				return <CircleX className="size-4" />;
			case "Duplicate":
				return <Copy className="size-4" />;
		}
	};

	// const newIssueButton = () => {
	// 	return (
	// 		<button
	// 			type="button"
	// 			className={`inline-flex items-center h-7 border-[0.8px] border-border rounded px-2 py-0.5 mr-2 text-card-foreground text-sm shadow-md cursor-pointer ${handleBackground()}`}
	// 			onClick={handleButtonClick}
	// 		>
	// 			<span className="hover:bg-nav-hover w-4 h-4 mr-2 cursor-pointer">
	// 				{showIcon(newIssueStatus)}
	// 			</span>
	// 			<span className="text-sm font-semibold text-card-foreground ml-1 cursor-pointer">
	// 				{newIssueStatus}
	// 			</span>
	// 		</button>
	// 	);
	// };

	const newIssueButton = () => {
		return (
			<Button variant="outline" onClick={handleButtonClick}>
				<span className="hover:bg-nav-hover w-4 h-4 mr-2 cursor-pointer">
					{showIcon(newIssueStatus)}
				</span>
				<span className="text-sm font-semibold text-card-foreground ml-1 cursor-pointer">
					{newIssueStatus}
				</span>
			</Button>
		);
	};

	const issueSidebarButton = () => {
		return (
			<button
				type="button"
				className={`grow flex flex-row w-36 items-center border-[0.8px] border-transparent hover:border-border rounded px-2 py-2 mr-2 text-card-foreground text-sm cursor-pointer ${setBackgroundColor(
					theme,
				)}`}
				onClick={handleButtonClick}
			>
				<span className="hover:bg-nav-hover w-4 h-4 mr-2 cursor-pointer">
					{showIcon(sidebarStatus)}
				</span>
				<span className="text-sm font-semibold text-card-foreground ml-1 cursor-pointer">
					{sidebarStatus}
				</span>
			</button>
		);
	};

	return (
		<>
			<div className={location === "newIssue" ? "relative" : "relative mr-12"}>
				{location === "newIssue" && newIssueButton()}
				{location === "issueSidebar" && issueSidebarButton()}
				{showDropdown && (
					<StatusDropdown
						handleButtonClick={handleButtonClick}
						showIcon={showIcon}
						location={location}
						handleClickAway={handleClickAway}
					/>
				)}
			</div>
		</>
	);
};

export default StatusButton;
