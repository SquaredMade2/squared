"use client";

import { Dialog, DialogContent } from "../ui/dialog";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";
import { useTaskStore, useModalStore, useWorkspaceStore } from "@/store";
import { ScrollArea } from "../ui/scroll-area";
import { StatusIcon } from "../Icons";
import { formatUrl } from "@/utils/formatting";
import { useRouter } from "next/navigation";

export function TaskSelector() {
	const router = useRouter();
	const { showTaskSelector: open, setShowTaskSelector: setOpen } =
		useModalStore((state) => state);
	const { tasks, setCurrentTask } = useTaskStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="p-0 max-h-[80vh] overflow-hidden">
				<Command className="rounded-lg border shadow-md h-full">
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
												`/${currentWorkspace?.url}/task/${task?.identifier}/${formatUrl(task.title)}`,
											);
											setOpen(false);
										}}
										className="grid grid-cols-[auto_1fr_11fr] gap-x-4 p-2"
									>
										<StatusIcon status={task.status} />
										<span>{task.identifier}</span>
										<span className="">{task.title}</span>
									</CommandItem>
								))}
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</DialogContent>
		</Dialog>
	);
}
