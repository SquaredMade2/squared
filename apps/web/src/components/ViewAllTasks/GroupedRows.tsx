import { Collapsible } from "../ui/collapsible";
import GroupColumn from "./GroupColumn";
import type { GroupedColumn } from "./interfaces";

const GroupedRows = ({
	columns,
	isListView,
}: { columns: GroupedColumn[]; isListView: boolean }) => {
	return (
		<Collapsible>
			{columns.map((column: GroupedColumn) => (
				<GroupColumn
					key={column.group}
					group={column.group}
					showTasks={true}
					tasks={column.tasks}
					currentView={isListView ? "list" : "grid"}
				/>
			))}
		</Collapsible>
	);
};

export default GroupedRows;
