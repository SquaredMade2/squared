import { useState } from "react";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import EffortEstimateDropdown from "@/components/EffortEstimateDropdown";
import { high, medium, low } from "@/components/Svg";
import type { EffortEstimateButtonProps } from "./EffortEstimateButton.interfaces";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

const EffortEstimateButton = ({ location }: EffortEstimateButtonProps) => {
	const newIssueEffortEstimate = useAppSelector(
		(state) => state.taskData.effortEstimate,
	);
	const sidebarEffortEstimate: number | undefined = useAppSelector((state) => {
		if (location === "issueSidebar") {
			return state.singleTask.data?.effortEstimate;
		}
		return undefined;
	});
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const showIcon = (estimate: number): JSX.Element => {
		switch (true) {
			case estimate > 8:
				return high();
			case estimate > 3:
				return medium();
			default:
				return low();
		}
	};

	return (
		<Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
			<PopoverTrigger
				asChild
				className={
					location === "newIssue"
						? "relative flex items-center"
						: "relative mr-12"
				}
			>
				<Button
					variant="outline"
					size="sm"
					className={`${"inline-flex items-center bg-popover hover:bg-muted"} ${location === "newIssue" && "px-2 py-0.5 mr-3 shadow-md"} ${location === "issueSidebar" && "rounded-3xl px-3 py-1 m-1"}`}
				>
					<span className="w-4 h-4 mr-2 inline-block cursor-pointer">
						{newIssueEffortEstimate
							? showIcon(newIssueEffortEstimate)
							: sidebarEffortEstimate
								? showIcon(sidebarEffortEstimate)
								: medium()}
					</span>
					<span className="text-sm flex font-semibold text-foreground cursor-pointer">
						{newIssueEffortEstimate || sidebarEffortEstimate || "Effort"}
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<EffortEstimateDropdown
					location={location}
					showIcon={showIcon}
					setDropdownOpen={setDropdownOpen}
				/>
			</PopoverContent>
		</Popover>
	);
};

export default EffortEstimateButton;
