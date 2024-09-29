import type { Status, Task } from "@repo/db";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
import { Droppable } from "@hello-pangea/dnd";
import { formatStatus } from "@/utils/formatting";
import { StatusIcon } from "../Icons";

const HiddenColumns = ({
	getHiddenColumns,
	getTasksForStatus,
}: {
	getHiddenColumns: () => Status[];
	getTasksForStatus: (status: Status) => Task[];
}) => {
	return (
		<Accordion type="single" collapsible className="min-w-[300px]">
			<AccordionItem value="hidden">
				<AccordionTrigger>Hidden Columns</AccordionTrigger>
				{getHiddenColumns().map((column: Status) => (
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
												<StatusIcon status={column} />
											</div>
											<span>{formatStatus(column)}</span>
											<span className="ml-1 text-muted-foreground">
												{getTasksForStatus(column).length}
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
