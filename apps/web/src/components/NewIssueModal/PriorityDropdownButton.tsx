import * as React from "react";
import { useModalStore } from "@/storeZ";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { priorityOptions } from "@/constants/designations";
import type { Priority } from "@repo/db";

export const PriorityDropdownButton = () => {
	const { newIssueData, setNewIssueData } = useModalStore((state) => state);

	const handleSelectPriority = (priority: Priority) => {
		setNewIssueData({ ...newIssueData, priority });
	};

	return (
		<Select>
			<SelectTrigger className="appearance-none grow flex items-center justify-center border-[0.8px] border-border text-card-foreground hover:cursor-pointer bg-transparent text-sm font-semibold">
				<SelectValue placeholder="Priority" />
			</SelectTrigger>
			<SelectContent side={"left"} align="start">
				<SelectGroup>
					<SelectLabel>Priority</SelectLabel>
					{priorityOptions.map((name) => (
						<SelectItem
							key={name}
							value={name}
							onClick={() => handleSelectPriority(name)}
							className=""
						>
							<span>{name}</span>
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};
