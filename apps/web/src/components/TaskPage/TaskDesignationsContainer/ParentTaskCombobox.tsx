import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { taskService } from "@/lib/services";
import { useTaskStore } from "@/store";
import { cn } from "@/utils/cn";
import { TODO } from "@squared/context";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

const ParentTaskCombobox = () => {
	const [open, setOpen] = useState(false);
	const [parentTaskId, setParentTaskId] = useState<string | null>(null);
	const { tasks, currentTask, setCurrentTask, updateTask } = useTaskStore(
		(state) => state,
	);

	useEffect(() => {
		if (currentTask?.parentId) {
			setParentTaskId(currentTask.parentId);
		}
	}, [currentTask]);

	const taskId = currentTask?.id ?? "";
	const parentTaskTitle = tasks.find((t) => t.id === parentTaskId)?.title ?? "";

	const handleAssignParentTask = async (parent: string | null) => {
		if (!parent) {
			const updatedTask = await taskService.updateTask(TODO, {
				id: taskId,
				parentId: null,
			});
			updateTask(updatedTask);
			setCurrentTask(updatedTask);
			return;
		}
		const updatedTask = await taskService.updateTask(TODO, {
			id: taskId,
			parentId: parent,
		});
		updateTask(updatedTask);
		setCurrentTask(updatedTask);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" className="justify-between w-full">
					{parentTaskTitle ? parentTaskTitle : "No parent assigned"}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn("p-0 w-[200px]")}>
				<Command>
					<CommandInput placeholder="Search tasks..." />
					<CommandList>
						<ScrollArea className="h-80 pr-2">
							<CommandEmpty>No tasks found.</CommandEmpty>
							<CommandGroup>
								{parentTaskId !== null && (
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
										</CommandItem>
									))}
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default ParentTaskCombobox;
