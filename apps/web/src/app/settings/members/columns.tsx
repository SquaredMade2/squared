"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ColumnDef } from "@tanstack/react-table";
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
						<AvatarImage src={user.avatarUrl ?? undefined} />
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
		accessorKey: "manage",
		cell: async ({ row }) => {
			const userId: string = row.original.id;

			return <RemoveMemberButton userId={userId} />;
		},
	},
];
