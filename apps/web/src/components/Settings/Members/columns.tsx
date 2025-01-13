import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ColumnDef } from "@tanstack/react-table";
import RemoveMemberButton from "./RemoveMemberButton";
import UpdateSubTeamDropdown from "./UpdateSubTeamDropdown";
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
			return row.original.role;
		},
	},
	{
		accessorKey: "subTeam",
		cell: ({ row }) => {
			const userId = row.original.id;
      const name = row.original.name;
      const subTeam = row.original.subTeam;

			return <UpdateSubTeamDropdown userId={userId} name = {name} subTeam = {subTeam} />;
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
