import { useState, useEffect } from "react";
import axios from "axios";
import {
	Circle,
	CircleCheckBig,
	CircleDashed,
	CircleX,
	Copy,
} from "lucide-react";
import { inProgress } from "../Svg";
import { statusOptions } from "@/constants/designations";
import { setStatus } from "@/store/taskData";
import { getSingleTask } from "@/store/task/thunks";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import useLogTaskEvent from "@/hooks/useLogTaskEvent";
import { EventType } from "@/interfaces/event.interfaces";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useModalStore } from "@/storeZ";
import { useToast } from "../ui/use-toast";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
} from "../ui/dropdown-menu";
import type { Status } from "@repo/db";

export const StatusDropdownButton = () => {
	const [open, setOpen] = useState(false);

	const { newIssueData, setNewIssueData } = useModalStore((state) => state);
	const newIssueStatus = newIssueData.status;

	const handleSelectStatus = (status: Status) => {
		setNewIssueData({ ...newIssueData, status });
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

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="cursor-pointer w-[150px] mr-2">
					<span className="cursor-pointer">{showIcon(newIssueStatus)}</span>
					<span className="ml-3 cursor-pointer">{newIssueStatus}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				sideOffset={4}
				side={"bottom"}
				align="start"
				className={"w-[150px]"}
			>
				<DropdownMenuRadioGroup
					value={newIssueStatus}
					onValueChange={(status) => handleSelectStatus(status as Status)}
				>
					{statusOptions.map((status) => (
						<DropdownMenuItem
							key={status}
							onSelect={() => handleSelectStatus(status as Status)}
							className="flex justify-between items-center px-2 py-1.5"
						>
							<div className="flex items-center">
								{showIcon(status)}
								<span className="ml-2">{status}</span>
							</div>
							{newIssueStatus === status && <Check className="h-4 w-4" />}
						</DropdownMenuItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
