import { useState } from "react";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import StatusDropdown from "@/components/StatusDropdown";
import type { StatusButtonProps } from "./StatusButton.interfaces";
import {
	Circle,
	CircleCheckBig,
	CircleDashed,
	CircleX,
	Copy,
} from "lucide-react";
import { inProgress } from "../Svg";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

const StatusButton = ({ location }: StatusButtonProps) => {
	const newIssueStatus = useAppSelector((state) => state.taskData.status);
	const sidebarStatus: string | undefined = useAppSelector(
		(state) => state.singleTask.data?.status,
	);

	const [dropdownOpen, setDropdownOpen] = useState(false);

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

	return (
		<Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
			<PopoverTrigger
				asChild
				className={
					location === "newIssue"
						? "relative"
						: "relative flex flex-row flex-wrap"
				}
			>
				<Button
					variant="outline"
					size="sm"
					className={`${"inline-flex items-center bg-popover hover:bg-muted"} 
					${location === "newIssue" && "px-2 py-0.5 mr-3 shadow-md"} 
				${location === "issueSidebar" && "rounded-3xl px-3 py-1 m-1"}`}
				>
					<span className="hover:bg-nav-hover w-4 h-4 mr-2 cursor-pointer">
						{location === "newIssue"
							? showIcon(newIssueStatus)
							: showIcon(sidebarStatus)}
					</span>
					<span className="text-sm font-semibold text-card-foreground ml-1 cursor-pointer">
						{location === "newIssue" ? newIssueStatus : sidebarStatus}
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<StatusDropdown
					showIcon={showIcon}
					location={location}
					setDropdownOpen={setDropdownOpen}
				/>
			</PopoverContent>
		</Popover>
	);
};

export default StatusButton;
