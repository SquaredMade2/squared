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
import { sprintService, taskService } from "@/lib/services";
import { useSprintStore, useTaskStore, useTeamStore } from "@/store";
import { TODO } from "@squared/context";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

const SprintCombobox = () => {
	const [open, setOpen] = useState(false);
	const { team } = useTeamStore((state) => state);
	const { sprints, setSprints } = useSprintStore((state) => state);
	const { currentTask, setCurrentTask, updateTask } = useTaskStore(
		(state) => state,
	);
	const [assignedSprint, setAssignedSprint] = useState<string | null>(null);

	useEffect(() => {
		if (currentTask?.sprintId) {
			setAssignedSprint(currentTask.sprintId);
		}

		const fetchSprints = async () => {
			if (team) {
				const fetchedSprints = await sprintService.getSprints(TODO, {
					teamId: team.id,
				});
				setSprints(fetchedSprints);
			}
		};

		fetchSprints();
	}, [team, currentTask]);

	const taskId = currentTask?.id ?? "";
	const sprintName = sprints.find((s) => s.id === assignedSprint)?.name ?? "";

	const handleAssignToSprint = async (sprintId: string | null) => {
		if (!sprintId) {
			const updatedTask = await taskService.updateTask(TODO, {
				id: taskId,
				sprintId: null,
			});
			updateTask(updatedTask);
			setCurrentTask(updatedTask);
			return;
		}
		const updatedTask = await taskService.updateTask(TODO, {
			id: taskId,
			sprintId: sprintId,
		});
		updateTask(updatedTask);
		setCurrentTask(updatedTask);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" className="justify-between w-full">
					{sprintName ? sprintName : "No sprint assigned"}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<Command>
					<CommandInput placeholder="Search sprints..." />
					<CommandList>
						<ScrollArea className="h-80 pr-2">
							<CommandEmpty>No sprints found.</CommandEmpty>
							<CommandGroup>
								{assignedSprint !== null && (
									<CommandItem onSelect={() => handleAssignToSprint(null)}>
										Unassign from {sprintName}
									</CommandItem>
								)}
								{sprints.map((sprint) => (
									<CommandItem
										key={sprint.id}
										onSelect={() => handleAssignToSprint(sprint.id)}
										className="w-full"
									>
										{sprint.name}
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

export default SprintCombobox;
