"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@repo/db";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<User>[] = [
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
			return "Admin";
		},
	},
	{
		accessorKey: "manage",
		cell: ({ row }) => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="items-center">
							...
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Remove from Workspace</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
