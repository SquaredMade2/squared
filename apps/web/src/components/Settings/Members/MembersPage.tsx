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
	const users = memberships?.data
		?.map(
			(m) =>
				m.publicUserData && {
					...m.publicUserData,
					role: m.role,
				},
		)
		.filter((user): user is MemberWithRole => Boolean(user));

	const hasMembershipManagePermission = membership?.permissions.includes(
		"org:sys_memberships:manage",
	);
	return (
		<>
			{users && users.length > 0 && (
				<DataTable
					columns={columns}
					data={users}
					membershipManagementPermission={hasMembershipManagePermission}
					team={team ? team : null}
				/>
			)}
		</>
	);
}
