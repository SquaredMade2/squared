import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

const SprintCombobox = () => {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" className="justify-between w-full">
					sprint assignment
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<Command>
					<CommandInput placeholder="Search sprints..." />
					<CommandList>
						<ScrollArea className="h-80 pr-2">
							<CommandEmpty>No sprints found.</CommandEmpty>
							<CommandGroup>sprints</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default SprintCombobox;
