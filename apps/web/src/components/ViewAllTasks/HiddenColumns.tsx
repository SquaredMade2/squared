import {
	useTaskStore,
	useUserStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import { formatPriority, formatStatus } from "@/utils/formatting";
import { Droppable } from "@hello-pangea/dnd";
import type { Priority, Status, Task } from "@squared/db";
import { PriorityIcon, StatusIcon } from "../Icons";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";

const HiddenColumns = ({
	getHiddenColumns,
	getTasksForGroup,
}: {
	getHiddenColumns: () => string[];
	getTasksForGroup: (group: string) => Task[];
}) => {
	const { displayOptions } = useViewStore((state) => state);
	const { groupTasksBy } = displayOptions;
	const { users } = useUserStore((state) => state);
	const workspace = useWorkspaceStore((state) => state.workspace);
	const { tasks } = useTaskStore((state) => state);

	const formatColumnTitle = (title: string) => {
		switch (groupTasksBy) {
			case "Status":
				return formatStatus(title as Status);
			case "Assignee": {
				const user = users.find((user) => user.externalId === title);
				return user ? user.name : "Unassigned";
			}
			case "Priority":
				return formatPriority(title as Priority);
			case "Label": {
				const labelName = workspace?.labels.find((label) => label.id === title);
				return labelName ? labelName.name : "No label";
			}
			case "Parent Task": {
				const parentTask = tasks.find((t) => t.id === title);
				return parentTask ? parentTask.title : "No parent";
			}
			case "No grouping":
				return title;
		}
	};

	return (
		<Accordion type="single" collapsible className="min-w-[300px]">
			<AccordionItem value="hidden">
				<AccordionTrigger>Hidden Columns</AccordionTrigger>
				{getHiddenColumns().map((column) => (
					<Droppable key={column} droppableId={column}>
						{(provided, snapshot) => (
							<AccordionContent
								ref={provided.innerRef}
								{...provided.droppableProps}
								className={`${snapshot.isDraggingOver && "h-full"} rounded py-2 pr-2 transition-all duration-500 ease-in-out`}
							>
								<div className="rounded-lg bg-card pr-2">
									<div className="mb-2 flex h-10 flex-row justify-between px-2 font-medium text-sm transition-all">
										<div className="flex items-center gap-4">
											<div className="mr-1.5 w-4 lg:mr-2">
												{groupTasksBy === "Status" ? (
													<StatusIcon status={column as Status} />
												) : groupTasksBy === "Priority" ? (
													<PriorityIcon priority={column as Priority} />
												) : (
													""
												)}
											</div>
											<span>{formatColumnTitle(column)}</span>
											<span className="ml-1 text-muted-foreground">
												{getTasksForGroup(column).length}
											</span>
										</div>
									</div>
								</div>

								{provided.placeholder}
							</AccordionContent>
						)}
					</Droppable>
				))}
			</AccordionItem>
		</Accordion>
	);
};
export default HiddenColumns;
