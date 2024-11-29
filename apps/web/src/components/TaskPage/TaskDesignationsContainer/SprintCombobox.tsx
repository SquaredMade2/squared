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
import { useSprintStore } from "@/store";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

const SprintCombobox = () => {
	const [open, setOpen] = useState(false);
	const { sprints, sprint } = useSprintStore((state) => state);
	console.log(sprint);
	const handleAssignToSprint = async (sprintId: string | null) => {
		console.log(sprintId);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" className="justify-between w-full">
					sprint assignment
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
