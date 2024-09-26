import { Check } from "lucide-react";
import { statusOptions } from "@/constants/designations";
import { formatStatus } from "@/utils/formatting";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
} from "../ui/dropdown-menu";
import type { Status } from "@repo/db";
import { StatusIcon } from "../Icons";

export const StatusDropdownButton = () => {
	const { newIssueData, setNewIssueData } = useModalStore((state) => state);
	const newIssueStatus = newIssueData.status;

	const handleSelectStatus = (status: Status) => {
		setNewIssueData({ ...newIssueData, status });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="max-w-full w-full">
					<span className="cursor-pointer">
						<StatusIcon status={newIssueStatus || "todo"} />
					</span>
					<span className="ml-2 cursor-pointer">
						{formatStatus(newIssueStatus ?? "backlog")}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="left" align="start" className="w-[150px]">
				<DropdownMenuRadioGroup
					value={newIssueStatus}
					onValueChange={(status) => handleSelectStatus(status as Status)}
				>
					{statusOptions.map((status) => (
						<DropdownMenuItem
							key={status}
							onSelect={() => handleSelectStatus(status as Status)}
							className="flex justify-between items-center px-2 py-1.5 cursor-pointer"
						>
							<div className="flex items-center">
								<StatusIcon status={status} />
								<span className="ml-2 cursor-pointer">
									{formatStatus(status)}
								</span>
							</div>
							{newIssueStatus === status && <Check className="h-4 w-4" />}
						</DropdownMenuItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
