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
				const user = users.find((user) => user.id === title);
				return user ? user.name : "Unassigned";
			}
			case "Priority":
				return formatPriority(title as Priority);
			case "Label": {
				const labelName = workspace?.Labels.find((label) => label.id === title);
				return labelName ? labelName.name : "No label";
			}
			case "Parent Issue": {
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
								className={`${snapshot.isDraggingOver && "h-full"} rounded pr-2 transition-all duration-500 ease-in-out py-2`}
							>
								<div className="pr-2 bg-card rounded-lg">
									<div className="flex flex-row justify-between transition-all px-2 h-10 mb-2 font-medium text-sm">
										<div className="flex items-center gap-4">
											<div className="w-4 lg:mr-2 mr-1.5">
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
