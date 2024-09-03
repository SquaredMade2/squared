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
import type { StatusDropdownButtonProps } from "./StatusDropdownButton.interfaces";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import useLogTaskEvent from "@/hooks/useLogTaskEvent";
import { EventType } from "@/interfaces/event.interfaces";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "../ui/use-toast";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
} from "../ui/dropdown-menu";

export const StatusDropdownButton = ({
	location,
}: StatusDropdownButtonProps) => {
	const [open, setOpen] = useState(false);
	const dispatch = useAppDispatch();
	const { toast } = useToast();

	const taskId = useAppSelector((state) => state.singleTask?.data?._id);
	const newIssueStatus = useAppSelector((state) => state.taskData.status);
	const sidebarStatus = useAppSelector(
		(state) => state.singleTask?.data?.status,
	);

	const {
		author,
		storeCommonFields,
		storeType,
		storeTaskValue,
		updateTaskValue,
		taskEvent,
	} = useLogTaskEvent();

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

	const handleSelectStatus = (newStatus: string) => {
		if (location === "newIssue") dispatch(setStatus(newStatus));
		if (location === "issueSidebar") {
			if (newStatus === sidebarStatus) return;
			if (taskId !== undefined) storeCommonFields(author, taskId);
			logEvent(newStatus);
			updateItem(newStatus);
		}
	};

	const renderButton = () => {
		if (location === "newIssue") {
			return (
				<Button variant="outline" className="cursor-pointer w-[150px] mr-2">
					<span className="cursor-pointer">{showIcon(newIssueStatus)}</span>
					<span className="ml-3 cursor-pointer">{newIssueStatus}</span>
				</Button>
			);
		}

		if (location === "issueSidebar") {
			return (
				<Button
					variant="outline"
					className="cursor-pointer w-[150px] justify-start"
				>
					<span className="cursor-pointer">{showIcon(sidebarStatus)}</span>
					<span className="ml-3 cursor-pointer">{sidebarStatus}</span>
				</Button>
			);
		}
	};

	const updateItem = async (newStatus: string) => {
		if (taskId !== undefined) {
			try {
				await axios.put(
					`${process.env.NEXT_PUBLIC_SERVER}/task/update/${taskId}`,
					{
						status: newStatus,
					},
				);
				dispatch(getSingleTask(taskId as string));
			} catch (err) {
				toast({
					title: "Error updating status",
					variant: "destructive",
				});
			}
		}
	};

	const logEvent = (newStatus: string) => {
		storeType(EventType.StatusUpdated);
		if (sidebarStatus) {
			storeTaskValue(sidebarStatus);
			updateTaskValue(newStatus);
		}
	};

	useEffect(() => {
		if (taskEvent.updatedValue) {
			setOpen(false);
		}
	}, [taskEvent.updatedValue]);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>{renderButton()}</DropdownMenuTrigger>
			<DropdownMenuContent
				sideOffset={4}
				side={location === "issueSidebar" ? "left" : "bottom"}
				align="start"
				className={"w-[150px]"}
			>
				<DropdownMenuRadioGroup
					value={location === "newIssue" ? newIssueStatus : sidebarStatus}
					onValueChange={handleSelectStatus}
				>
					{statusOptions.map((status) => (
						<DropdownMenuItem
							key={status}
							onSelect={() => handleSelectStatus(status)}
							className="flex justify-between items-center px-2 py-1.5"
						>
							<div className="flex items-center">
								{showIcon(status)}
								<span className="ml-2">{status}</span>
							</div>
							{(location === "newIssue" ? newIssueStatus : sidebarStatus) ===
								status && <Check className="h-4 w-4" />}
						</DropdownMenuItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
