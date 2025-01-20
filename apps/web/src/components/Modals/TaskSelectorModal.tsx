"use client";

import { useModalStore, useTaskStore, useWorkspaceStore } from "@/store";
import { formatUrl } from "@/utils/formatting";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@squaredmade/ui/command";
import { DialogTitle } from "@squaredmade/ui/dialog";
import { ScrollArea } from "@squaredmade/ui/scroll-area";
import { VisuallyHidden } from "@squaredmade/ui/visually-hidden";
import { useRouter } from "next/navigation";
import { StatusIcon } from "../Icons";

export function TaskSelector() {
	const router = useRouter();
	const { showTaskSelector: open, setShowTaskSelector: setOpen } =
		useModalStore((state) => state);
	const { tasks, setCurrentTask } = useTaskStore((state) => state);
	const workspace = useWorkspaceStore((state) => state.workspace);

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<VisuallyHidden>
				<DialogTitle>Open Task</DialogTitle>
			</VisuallyHidden>
			<CommandInput placeholder="Open task..." />
			<CommandList>
				<ScrollArea className="h-[calc(80vh-53px)]">
					<CommandEmpty>No tasks found.</CommandEmpty>
					<CommandGroup>
						{tasks.map((task) => (
							<CommandItem
								key={task.id}
								onSelect={() => {
									setCurrentTask(task);
									router.push(
										`/${workspace?.url}/task/${task?.identifier}/${formatUrl(task.title)}`,
									);
									setOpen(false);
								}}
								className="grid grid-cols-[auto_1fr_11fr] gap-x-4 p-2"
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
