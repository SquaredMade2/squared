// import { useState, useEffect } from "react";
import axios from "axios";
import { statusOptions } from "@/constants/designations";
import { setStatus } from "@/store/taskData";
import { getSingleTask } from "@/store/task/thunks";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import type { StatusDropdownProps } from "./StatusDropdown.interfaces";
import useLogTaskEvent from "@/hooks/useLogTaskEvent";
import { EventType } from "@/interfaces/event.interfaces";
import { Check } from "lucide-react";
import { useToast } from "../ui/use-toast";
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";

const StatusDropdown = ({
	showIcon,
	location,
	setDropdownOpen,
}: StatusDropdownProps) => {
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
	} = useLogTaskEvent();

	const handleSelectStatus = (newStatus: string) => {
		if (location === "newIssue") dispatch(setStatus(newStatus));
		if (location === "issueSidebar") {
			if (newStatus === sidebarStatus) setDropdownOpen(false);
			if (taskId !== undefined) storeCommonFields(author, taskId);
			logEvent(newStatus);
			updateItem(newStatus);
		}
		setDropdownOpen(false);
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

	return (
		<Command>
			<CommandInput placeholder="Change status..." />
			<CommandList>
				<CommandGroup>
					{statusOptions.map((name) => {
						let isChecked = false;
						if (location === "newIssue") isChecked = newIssueStatus === name;
						if (location === "issueSidebar") isChecked = sidebarStatus === name;
						return (
							<CommandItem
								key={name}
								onSelect={() => handleSelectStatus(name)}
								className="cursor-pointer justify-between"
							>
								<div className="flex flex-row items-center">
									<div className="mx-2">{showIcon(name)}</div>
									<span>{name}</span>
								</div>
								<div>{isChecked && <Check className=" size-5" />}</div>
							</CommandItem>
						);
					})}
				</CommandGroup>
			</CommandList>
		</Command>
	);
};

export default StatusDropdown;
