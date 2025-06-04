import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandList,
} from "@/components/ui/command";
import { useTaskStore, useWorkspaceStore } from "@/store";
import type { Task } from "@squaredmade/db";
import { cn } from "@squaredmade/ui/cn";
import { CommandItem } from "cmdk";
import type { TextEditorTasksProps } from "../interfaces";
import { injectTaskConfirm } from "../textEditorSelection";

const TextEditorTasks = ({
	cursorPosition,
	editor,
	setToggleTasks,
	debounceRef,
}: TextEditorTasksProps) => {
	const { tasks } = useTaskStore((state) => state);
	const workspace = useWorkspaceStore((state) => state.workspace);

	// Helpers

	const currentCursorPosition = cursorPosition
		? cursorPosition
		: { x: 10, y: 10 };

	const handleTaskClick = (task: Task) => {
		debounceRef.current = true;
		injectTaskConfirm(editor, task, workspace);
		setToggleTasks(false);
	};

	return (
		<Command
			className="absolute h-auto w-64 rounded-lg border bg-background shadow-lg"
			style={{
				left: `${currentCursorPosition.x + 50}px`,
				top: `${currentCursorPosition.y - 50}px`,
			}}
		>
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Tasks" className="h-60 overflow-y-scroll pt-0">
					{tasks.map((task, index) => {
						return (
							<CommandItem
								key={task.id}
								className={cn(
									`${index === 0 && "bg-accent text-accent-foreground"} relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden aria-selected:bg-accent aria-selected:text-accent-foreground`,
								)}
								onSelect={() => handleTaskClick(task)}
							>
								{task.identifier} {task.title.substring(0, 20)}
								{task.title.length > 20 ? "..." : ""}
							</CommandItem>
						);
					})}
				</CommandGroup>
			</CommandList>
		</Command>
	);
};

export default TextEditorTasks;
