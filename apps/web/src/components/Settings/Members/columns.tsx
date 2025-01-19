import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ColumnDef } from "@tanstack/react-table";
import ManageMembersRoleButton from "./ManageMembersRoleButton";
import RemoveMemberButton from "./RemoveMemberButton";
import type { MemberWithRole } from "./data-table";

export const columns: ColumnDef<MemberWithRole>[] = [
	{
		accessorKey: "name",
		cell: ({ row }) => {
			const user = row.original;
			const placeholder = user.name
				.split(" ")
				.map((name) => name[0])
				.join("");
			return (
				<div className="flex gap-2">
					<Avatar>
						<AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
						<AvatarFallback>{placeholder}</AvatarFallback>
					</Avatar>
					<div className="flex items-start flex-col">
						<div className="ml-2">{user.name}</div>
						<div className="ml-2 text-sm text-muted-foreground">
							{user.email}
						</div>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "role",
		cell: ({ row }) => {
			if (
				!["member", "admin", "owner"].includes(
					row.original.role?.toLowerCase() || "",
				)
			) {
				return "loading...";
			}
			return (
				row.original?.role?.charAt(0).toUpperCase() +
				row.original?.role?.slice(1)
			);
		},
	},
	{
		accessorKey: "manage-role",
		cell: ({ row, column }) => {
			const userId: string = row.original.id;
			const { page, pageId, membersWithRoles, fetchWorkspaceUsersWithRoles } =
				column.columnDef.meta || {};

			return (
				<ManageMembersRoleButton
					userId={userId}
					page={page}
					pageId={pageId}
					membersWithRoles={membersWithRoles}
					fetchWorkspaceUsersWithRoles={fetchWorkspaceUsersWithRoles}
				/>
			);
		},
	},
	{
		accessorKey: "manage",
		cell: ({ row, column }) => {
			const userId: string = row.original.id;
			const { page, pageId, membersWithRoles, setPageUsers } =
				column.columnDef.meta || {};

			return (
				<RemoveMemberButton
					userId={userId}
					page={page}
					pageId={pageId}
					membersWithRoles={membersWithRoles}
					setPageUsers={setPageUsers}
				/>
			);
		},
	},
];
