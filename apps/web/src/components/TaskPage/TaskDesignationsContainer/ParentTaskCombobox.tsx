// import { Button } from "@/components/ui/button";
// import {
// 	Command,
// 	CommandEmpty,
// 	CommandGroup,
// 	CommandInput,
// 	CommandItem,
// 	CommandList,
// } from "@/components/ui/command";
// import {
// 	Popover,
// 	PopoverContent,
// 	PopoverTrigger,
// } from "@/components/ui/popover";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { taskService } from "@/lib/services";
import { useTaskStore } from "@/store";
// import { cn } from "@/utils/cn";
import { TODO } from "@squared/context";
import type { Task } from "@squared/db";
// import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { DesignationCombobox } from "./DesignationCombobox";

const ParentTaskCombobox = () => {
	const [open, setOpen] = useState(false);
	const { tasks, currentTask, setCurrentTask, updateTask } = useTaskStore(
		(state) => state,
	);
	const [parentTaskId, setParentTaskId] = useState<string | null>(null);
	const taskId = currentTask?.id ?? "";
	const parentTaskTitle = tasks.find((t) => t.id === parentTaskId)?.title ?? "";

	useEffect(() => {
		if (currentTask?.parentId) {
			setParentTaskId(currentTask.parentId);
		}
	}, [currentTask]);

	const handleAssignParentTask = async (parentId: string | null) => {
		const updatedTask = await taskService.updateTask(TODO, {
			id: taskId,
			parentId,
		});
		updateTask(updatedTask);
		setCurrentTask(updatedTask);
		setOpen(false);
	};

	return (
		<>
			<DesignationCombobox
				open={open}
				setOpen={setOpen}
				triggerText={
					currentTask?.parentId ? parentTaskTitle : "No parent assigned"
				}
				emptyText="No tasks found."
				listItems={tasks.filter((t) => t.id !== taskId)}
				selectedItemId={parentTaskId}
				selectedItemLabel={parentTaskTitle}
				itemLabel={(task: Task) => task.title}
				itemId={(task: Task) => task.id}
				onItemSelect={handleAssignParentTask}
			/>
			{/* <Popover open={open} onOpenChange={setOpen}> */}
			{/* <PopoverTrigger asChild>
					<Button variant="outline" className="justify-between w-full">
						{currentTask?.parentId ? parentTaskTitle : "No parent assigned"}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger> */}
			{/* <PopoverContent className={cn("p-0 w-[200px]")}> */}
			{/* <Command> */}
			{/* <CommandInput placeholder="Search tasks..." /> */}
			{/* <CommandList> */}
			{/* <ScrollArea className="h-80 pr-2"> */}
			{/* <CommandEmpty>No tasks found.</CommandEmpty> */}
			{/* <CommandGroup>
									{currentTask?.parentId && (
										<CommandItem onSelect={() => handleAssignParentTask(null)}>
											Unassign from {parentTaskTitle}
										</CommandItem>
									)}
									{tasks
										.filter((t) => t.id !== taskId)
										.map((task) => (
											<CommandItem
												key={task.id}
												onSelect={() => handleAssignParentTask(task.id)}
												className="w-full"
											>
												{task.title}
												<Check
													className={cn(
														"ml-auto h-4 w-4",
														currentTask?.parentId === task.id
															? "opacity-100"
															: "opacity-0",
													)}
												/>
											</CommandItem>
										))}
								</CommandGroup>
							</ScrollArea>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover> */}
		</>
	);
};

export default ParentTaskCombobox;
