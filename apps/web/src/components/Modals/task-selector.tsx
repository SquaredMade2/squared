"use client";

import { useOrganization } from "@clerk/nextjs";
import { DialogTitle } from "@squaredmade/ui/dialog";
import { useRouter } from "next/navigation";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useModalStore, useTaskStore } from "@/store";
import { formatUrl } from "@/utils/formatting";
import { StatusIcon } from "../Icons";

export function TaskSelector() {
	const router = useRouter();
	const { showTaskSelector: open, setShowTaskSelector: setOpen } =
		useModalStore((state) => state);
	const { tasks, setCurrentTask } = useTaskStore((state) => state);
	const { organization } = useOrganization();

	return (
		<CommandDialog onOpenChange={setOpen} open={open}>
			<DialogTitle className="sr-only">Open Task</DialogTitle>
			<CommandInput placeholder="Open task..." />
			<CommandList>
				<ScrollArea className="h-[calc(80vh-53px)]">
					<CommandEmpty>No tasks found.</CommandEmpty>
					<CommandGroup>
						{tasks.map((task) => (
							<CommandItem
								className="grid grid-cols-[auto_1fr_11fr] gap-x-4 p-2"
								key={task.id}
								onSelect={() => {
									setCurrentTask(task);
									router.push(
										`/${organization?.slug}/task/${task?.identifier}/${formatUrl(task.title)}`,
									);
									setOpen(false);
								}}
							>
								<StatusIcon status={task.status} />
								<span className="text-nowrap">{task.identifier}</span>
								<span>{task.title}</span>
							</CommandItem>
						))}
					</CommandGroup>
				</ScrollArea>
			</CommandList>
		</CommandDialog>
	);
}
