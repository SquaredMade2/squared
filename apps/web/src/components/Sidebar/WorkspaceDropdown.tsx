"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspaceStore } from "@/store";
import { ChevronsUpDown } from "lucide-react";

export function WorkspaceDropdown() {
	const { currentWorkspace, workspaces, setCurrentWorkspace } =
		useWorkspaceStore((state) => state);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="w-full justify-between">
					{currentWorkspace?.name}
					<ChevronsUpDown className="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-full">
				{workspaces.map((workspace) => (
					<DropdownMenuItem
						key={workspace.id}
						onSelect={() => setCurrentWorkspace(workspace)}
					>
						{workspace.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
