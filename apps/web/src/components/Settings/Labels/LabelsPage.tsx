import type { Label, Workspace } from "@squaredmade/db";

import { useOrganization } from "@clerk/nextjs";
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
	const { membership } = useOrganization();
	return (
		<>
			{labels.length > 0 && workspace && (
				<DataTable
					columns={columns}
					data={labels}
					userRole={membership?.role}
				/>
			)}
		</>
	);
}
