import { UserSearch } from "@squaredmade/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { Calendar } from "@squaredmade/ui/calendar";
import {
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@squaredmade/ui/dropdown-menu";
import { toast } from "@squaredmade/ui/toast";
import { PriorityIcon, StatusIcon } from "@/components/Icons";
import { useUsers } from "@/hooks/useUsers";
import { client } from "@/lib/client";
import { priorityOptions, statusOptions } from "@/lib/constants";
import { useTaskStore } from "@/store";
import {
	formatName,
	formatPriority,
	formatStatus,
	getInitials,
} from "@/utils/formatting";
import type { BoxProps } from "./interfaces";

export const AssigneeBox = ({ task }: BoxProps) => {
	const { updateTask } = useTaskStore((state) => state);
	const { users } = useUsers();
	const taskId = task.id;

	const updateAssignee = async (userId: string | null) => {
		try {
			const res = await client.task.updateAssignee.$post({
				assigneeId: userId,
				taskId,
			});
			const updatedTask = await res.json();
			updateTask(updatedTask);
		} catch (error) {
			toast.error("Error updating task", {
				description: `Failed to update assignee: ${error}`,
			});
		}
	};

	return (
		<>
			<DropdownMenuLabel>Assign to...</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuGroup className="h-[400px] w-[160px] overflow-y-scroll">
				<DropdownMenuItem key="unassign" onSelect={() => updateAssignee(null)}>
					<UserSearch className="size-6 shrink-0 text-[#9597AD] mx-2" />{" "}
					Unassign
				</DropdownMenuItem>
				{users?.map((assignee) => (
					<DropdownMenuItem
						className="hover:bg-slate-600"
						key={assignee.userId}
						onSelect={() => updateAssignee(assignee.userId as string)}
					>
						<Avatar className="size-6 shrink-0 mx-2">
							<AvatarImage src={assignee?.imageUrl} />
							<AvatarFallback className="text-xxs">
								{getInitials(formatName(assignee))}
							</AvatarFallback>
						</Avatar>
						{assignee.firstName}
					</DropdownMenuItem>
				))}
			</DropdownMenuGroup>
		</>
	);
};

export const PriorityBox = ({ task }: BoxProps) => {
	const { updateTask } = useTaskStore((state) => state);
	const taskId = task.id;
	type Priority = (typeof priorityOptions)[number];

	const updatePriority = async (priority: Priority) => {
		try {
			const res = await client.task.updatePriority.$post({
				priority,
				taskId,
			});
			const updatedTask = await res.json();
			updateTask(updatedTask);
			return updatedTask;
		} catch (error) {
			toast.error("Error updating task", {
				description: `Failed to update priority: ${error}`,
			});
		}
	};

	return (
		<>
			<DropdownMenuLabel>Change Priority...</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuGroup className="h-[160px]">
				{priorityOptions?.map((priority) => (
					<DropdownMenuItem
						className="hover:bg-slate-600 cursor-pointer"
						key={priority}
						onSelect={() => updatePriority(priority)}
					>
						<div className="mr-2">
							<PriorityIcon priority={priority} />
						</div>
						{formatPriority(priority)}
					</DropdownMenuItem>
				))}
			</DropdownMenuGroup>
		</>
	);
};

export const StatusBox = ({ task }: BoxProps) => {
	const { updateTask } = useTaskStore((state) => state);
	const taskId = task.id;
	type Status = (typeof statusOptions)[number];

	const updateStatus = async (status: Status) => {
		try {
			const res = await client.task.updateStatus.$post({
				status,
				taskId,
			});
			const updatedTask = await res.json();
			updateTask(updatedTask);
			return updatedTask;
		} catch (error) {
			toast.error("Error updating task", {
				description: `Failed to update status: ${error}`,
			});
		}
	};

	return (
		<>
			<DropdownMenuLabel>Change Status...</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuGroup className="h-[160px]">
				{statusOptions?.map((status) => (
					<DropdownMenuItem
						className="hover:bg-slate-600 cursor-pointer"
						key={status}
						onSelect={() => updateStatus(status)}
					>
						<div className="mr-2">
							<StatusIcon status={status} />
						</div>
						{formatStatus(status)}
					</DropdownMenuItem>
				))}
			</DropdownMenuGroup>
		</>
	);
};

export const DateBox = ({ task }: BoxProps) => {
	const { updateTask } = useTaskStore((state) => state);
	const taskId = task.id;

	const changeDate = async (date?: Date) => {
		try {
			const res = await client.task.updateDueDate.$post({
				dueDate: date ?? null,
				taskId,
			});
			const updatedTask = await res.json();
			updateTask(updatedTask);
			return updatedTask;
		} catch (error) {
			toast.error("Error updating task", {
				description: `Failed to update due date: ${error}`,
			});
		}
	};

	return (
		<>
			<DropdownMenuLabel>Change Date...</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuGroup className="h-[320px]">
				<Calendar
					initialFocus
					mode="single"
					onSelect={changeDate}
					selected={task.dueDate ?? undefined}
				/>
			</DropdownMenuGroup>
		</>
	);
};
