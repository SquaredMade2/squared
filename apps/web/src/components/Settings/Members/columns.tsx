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
			const placeholder = user.firstName;

			return (
				<div className="flex gap-2">
					<Avatar>
						<AvatarImage
							src={user.imageUrl ?? undefined}
							alt={user.firstName ?? "User"}
						/>
						<AvatarFallback>{placeholder}</AvatarFallback>
					</Avatar>

					<div className="ml-2">{user.firstName}</div>
				</div>
			);
		},
	},
	{
		accessorKey: "role",
		cell: ({ row }) => {
			const role = row.original.role.split(":")[1];
			return role.charAt(0).toUpperCase() + role.slice(1);
		},
	},
	{
		accessorKey: "manage-role",
		cell: ({ row, column }) => {
			const userId: string = row.original.identifier;
			const { pageId, membersWithRoles } = column.columnDef.meta || {};

			return (
				<ManageMembersRoleButton
					userId={userId}
					pageId={pageId}
					membersWithRoles={membersWithRoles}
				/>
			);
		},
	},
	{
		accessorKey: "manage",
		cell: ({ row, column }) => {
			const userId: string = row.original.identifier;
			const { page, pageId, membersWithRoles, refetch } =
				column.columnDef.meta || {};

			return (
				<RemoveMemberButton
					userId={userId}
					page={page}
					pageId={pageId}
					membersWithRoles={membersWithRoles}
					refetch={refetch}
				/>
			);
		},
	},
];
