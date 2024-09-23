import type { Status } from "@repo/db";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
import { Droppable } from "@hello-pangea/dnd";
import TaskColumnTitle from "./TaskColumnTitle";

const UnassignedColumns = ({
	getEmptyColumns,
}: { getEmptyColumns: () => Status[] }) => {
	return (
		<Accordion type="single" collapsible>
			<AccordionItem value="hidden">
				<AccordionTrigger>Hidden Columns</AccordionTrigger>
				{getEmptyColumns().map((column: Status) => (
					<Droppable key={column} droppableId={column}>
						{(provided, snapshot) => (
							<AccordionContent
								ref={provided.innerRef}
								{...provided.droppableProps}
								className={`${snapshot.isDraggingOver && "h-full"} rounded pr-2 transition-all duration-500 ease-in-out py-2`}
							>
								<TaskColumnTitle
									isListView={false}
									showTasks={true}
									title={column}
									numberOfTasks={0}
								/>
								{provided.placeholder}
							</AccordionContent>
						)}
					</Droppable>
				))}
			</AccordionItem>
		</Accordion>
	);
};
export default UnassignedColumns;
