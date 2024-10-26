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
} from "@/components/ui/dropdown-menu";
import type { Priority } from "@squared/db";
import { PriorityIcon } from "@/components/Icons";

export const PriorityDropdownButton = () => {
	const { newIssueData, setNewIssueData } = useModalStore((state) => state);
	const newIssuePriority = newIssueData.priority;

	const handleSelectPriority = (priority: Priority) => {
		setNewIssueData({ ...newIssueData, priority });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="max-w-full w-full">
					<span className="cursor-pointer">
						<PriorityIcon priority={newIssuePriority || "noPriority"} />
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
							className="flex justify-between items-center px-2 py-1.5 cursor-pointer"
						>
							<div className="flex items-center ">
								<PriorityIcon priority={priority} />
								<span className="ml-2 cursor-pointer">
									{formatPriority(priority)}
								</span>
							</div>
							{newIssuePriority === priority && <Check className="h-4 w-4" />}
						</DropdownMenuItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
