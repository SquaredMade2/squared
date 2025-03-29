import type { Label, Workspace } from "@squaredmade/db";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";

export function LabelsPage({
	columns,
	labels,
	workspace,
}: {
	columns: ColumnDef<Label, unknown>[];
	labels: Label[];
	workspace?: Workspace | null;
}) {
	return (
		<>
			{labels.length > 0 && workspace && (
				<DataTable columns={columns} data={labels} />
			)}
		</>
	);
}
