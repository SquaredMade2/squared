import { useOrganization } from "@clerk/nextjs";
import type { Team } from "@squaredmade/db";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, type MemberWithRole } from "./data-table";

export function MembersPage({
	columns,
	team,
}: {
	columns: ColumnDef<MemberWithRole, unknown>[];
	team?: Team | null;
}) {
	const { membership, memberships } = useOrganization({
		memberships: {
			infinite: true,
			pageSize: 100,
		},
	});
	const users = memberships?.data?.map((membership) => ({
		...membership.publicUserData,
		role: membership.role,
	}));
	return (
		<>
			{users && users.length > 0 && (
				<DataTable
					columns={columns}
					data={users}
					team={team ? team : null}
					userRole={membership?.role}
				/>
			)}
		</>
	);
}
