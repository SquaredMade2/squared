"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { useWorkspaceStore } from "@/store";
import { ChevronDown } from "lucide-react";

export function WorkspaceDropdown() {
	const { currentWorkspace, workspaces, setCurrentWorkspace } =
		useWorkspaceStore((state) => state);
	const { state } = useSidebar();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="w-full justify-between">
					<span className={state === "collapsed" ? "sr-only" : "truncate"}>
						{currentWorkspace?.name}
					</span>
					<ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
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
