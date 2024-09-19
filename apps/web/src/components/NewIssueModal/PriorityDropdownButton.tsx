import { Circle, AlertTriangle, AlertCircle, MinusCircle } from "lucide-react";
import { Check } from "lucide-react";
import { formatPriority } from "@/utils/formatting";
import { priorityOptions } from "@/constants/designations";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
} from "../ui/dropdown-menu";
import type { Priority } from "@repo/db";

export const PriorityDropdownButton = () => {
	const { newIssueData, setNewIssueData } = useModalStore((state) => state);
	const newIssuePriority = newIssueData.priority;

	const handleSelectPriority = (priority: Priority) => {
		setNewIssueData({ ...newIssueData, priority });
	};

	const showIcon = (priority: Priority) => {
		switch (priority) {
			case "noPriority":
				return <MinusCircle className="h-4 w-4 text-gray-500" />;
			case "urgent":
				return <AlertTriangle className="h-4 w-4 text-red-500" />;
			case "high":
				return <AlertCircle className="h-4 w-4 text-orange-500" />;
			case "medium":
				return <AlertCircle className="h-4 w-4 text-yellow-500" />;
			case "low":
				return <AlertCircle className="h-4 w-4 text-green-500" />;
			default:
				return <Circle className="h-4 w-4 text-gray-500" />;
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="max-w-full w-full">
					<span className="cursor-pointer">
						{showIcon(newIssuePriority || "noPriority")}
					</span>
					<span className="ml-2 cursor-pointer">
						{formatPriority(newIssuePriority || "noPriority")}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				sideOffset={4}
				side={"left"}
				align="start"
				className="w-[150px]"
			>
				<DropdownMenuRadioGroup
					value={newIssuePriority}
					onValueChange={(priority) =>
						handleSelectPriority(priority as Priority)
					}
				>
					{priorityOptions.map((priority) => (
						<DropdownMenuItem
							key={priority}
							onSelect={() => handleSelectPriority(priority as Priority)}
							className="flex justify-between items-center px-2 py-1.5"
						>
							<div className="flex items-center">
								{showIcon(priority)}
								<span className="ml-2">{formatPriority(priority)}</span>
							</div>
							{newIssuePriority === priority && <Check className="h-4 w-4" />}
						</DropdownMenuItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
