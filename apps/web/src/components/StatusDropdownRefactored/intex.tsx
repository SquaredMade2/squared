import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { Combobox } from "@headlessui/react";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
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
// import type { StatusDropdownProps } from '../StatusDropdown/StatusDropdown.interfaces';
import useLogTaskEvent from "@/hooks/useLogTaskEvent";
import { EventType } from "@/interfaces/event.interfaces";
import { Check } from "lucide-react";
import { useToast } from "../ui/use-toast";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuGroup,
	DropdownMenuSeparator,
	DropdownMenuRadioGroup,
} from "../ui/dropdown-menu";
import {
	Command,
	CommandDialog,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandShortcut,
	CommandSeparator,
} from "../ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface StatusDropdownProps {
	location: string;
}

export const StatusDropdownRefactored = ({ location }: StatusDropdownProps) => {
	const [open, setOpen] = useState(false);
	const dispatch = useAppDispatch();
	const { toast } = useToast();
	const taskId = useAppSelector((state) => state.singleTask?.data?._id);

	const newIssueStatus = useAppSelector((state) => state.taskData.status);
	const sidebarStatus = useAppSelector(
		(state) => state.singleTask?.data?.status,
	);

	const [query, setQuery] = useState("");

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

	const {
		author,
		storeCommonFields,
		storeType,
		storeTaskValue,
		updateTaskValue,
		taskEvent,
	} = useLogTaskEvent();

	const handleSelectStatus = (newStatus: string) => {
		if (location === "newIssue") dispatch(setStatus(newStatus));
		if (location === "issueSidebar") {
			if (newStatus === sidebarStatus) return;
			if (taskId !== undefined) storeCommonFields(author, taskId);
			logEvent(newStatus);
			updateItem(newStatus);
		}
	};

	const filteredStatusOptions =
		query === ""
			? statusOptions
			: statusOptions.filter((name) => {
					return name.toLowerCase().includes(query.toLowerCase());
				});

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

	// const closeDropdown = () => {
	// 	handleButtonClick();
	// };

	useEffect(() => {
		if (taskEvent.updatedValue) {
			setOpen(false);
		}
	}, [taskEvent.updatedValue]);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="cursor-pointer w-[150px]">
					<span className="cursor-pointer">{showIcon(newIssueStatus)}</span>
					<span className="ml-3 cursor-pointer">{newIssueStatus}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				sideOffset={4}
				className={location === "newIssue" ? "w-[150px]" : "-left-[220px]"}
			>
				<DropdownMenuRadioGroup
					value={location === "newIssue" ? newIssueStatus : sidebarStatus}
					onValueChange={handleSelectStatus}
				>
					{statusOptions.map((status) => {
						return (
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
						);
					})}
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
			</DropdownMenuContent>
		</DropdownMenu>
		// <ClickAwayListener onClickAway={() => handleClickAway()}>
		// 	<Combobox value={selectedStatus} onChange={setSelectedStatus}>
		// 		<div
		// 			className={
		// 				location === "newIssue"
		// 					? "absolute top-8"
		// 					: "absolute top-0 -left-[220px] "
		// 			}
		// 		>
		// 			<div className="relative z-[1] max-w-[220px] border border-border bg-popover p-1.5 font-medium text-foreground text-sm shadow-lg rounded-md">
		// 				<Combobox.Input
		// 					placeholder={"Change status..."}
		// 					onChange={(event) => setQuery(event.target.value)}
		// 					className="p-2 mb-3 border-b border-border focus:outline-none bg-popover"
		// 				/>

		// 				<Combobox.Options static>
		// 					{filteredStatusOptions.map((name) => {
		// 						let isChecked = false;
		// 						if (location === "newIssue")
		// 							isChecked = newIssueStatus === name;
		// 						if (location === "issueSidebar")
		// 							isChecked = sidebarStatus === name;
		// 						return (
		// 							<Combobox.Option
		// 								onClick={() => handleSelectStatus(name)}
		// 								key={name}
		// 								value={name}
		// 								className="flex flex-row text-center justify-between hover:bg-popoverHover rounded-md py-1 px-2"
		// 							>
		// <div className="flex flex-row items-center">
		// 	<div className="w-4 h-4 mx-2">{showIcon(name)}</div>
		// 	<span>{name}</span>
		// </div>
		// 								<div>
		// 									{isChecked && <Check className="cursor-pointer size-5" />}
		// 								</div>
		// 							</Combobox.Option>
		// 						);
		// 					})}
		// 				</Combobox.Options>
		// 			</div>
		// 		</div>
		// 	</Combobox>
		// </ClickAwayListener>
	);
};
