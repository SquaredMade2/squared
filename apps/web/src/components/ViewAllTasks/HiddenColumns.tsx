import type { Priority, Status, Task } from "@repo/db";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
import { Droppable } from "@hello-pangea/dnd";
import { useViewStore } from "@/store";
import { PriorityIcon, StatusIcon } from "../Icons";

const HiddenColumns = ({
	getHiddenColumns,
	getTasksForGroup,
	formatColumnTitle,
}: {
	getHiddenColumns: () => string[];
	getTasksForGroup: (group: string) => Task[];
	formatColumnTitle: (title: string) => string | undefined;
}) => {
	const { displayOptions } = useViewStore((state) => state);
	const { groupTasksBy } = displayOptions;
	console.log(getHiddenColumns());
	return (
		<Accordion type="single" collapsible className="min-w-[300px]">
			<AccordionItem value="hidden">
				<AccordionTrigger>Hidden Columns</AccordionTrigger>
				{getHiddenColumns().map((column: string) => (
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
