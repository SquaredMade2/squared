"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { useWorkspaceStore } from "@/store";
import { getInitials } from "@/utils/formatting";
import { ChevronDown, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function WorkspaceDropdown() {
	const pathName = usePathname();
	const router = useRouter();
	const { workspace, workspaces, setWorkspace } = useWorkspaceStore(
		(state) => state,
	);
	const { state } = useSidebar();

	const updatePathWithWorkspace = (newWorkspace: { url: string }) => {
		const pathNameParts = pathName.split("/");

		// validation for 'inbox' page or any other page that doesn't have workspace url
		if (workspace && pathNameParts.includes(workspace.url)) {
			if (pathNameParts[1] === "settings" || pathNameParts[2] === "inbox") {
				pathNameParts[2] = newWorkspace?.url;
				router.push(pathNameParts.join("/"));
			} else {
				router.push(`/${newWorkspace?.url}`);
			}
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className={`w-full items-center gap-2 transition-all duration-300 ease-in-out ${state === "collapsed" ? "justify-center border-none px-0" : "justify-start"}`}
				>
					<Avatar className="h-8 w-8 shrink-0">
						<AvatarFallback>
							{getInitials(workspace?.name || "WS")}
						</AvatarFallback>
					</Avatar>
					{state === "expanded" && (
						<>
							<span
								className={"truncate transition-all duration-300 ease-in-out"}
							>
								{workspace?.name}
							</span>
							<ChevronDown
								className={
									"ml-auto h-4 w-4 shrink-0 opacity-50 transition-all duration-300 ease-in-out"
								}
							/>
						</>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className={`bg-card ${state === "collapsed" ? "w-16" : "w-64"}`}
			>
				{workspaces.map((workspace) => (
					<DropdownMenuItem
						key={workspace.externalId}
						onSelect={() => {
							setWorkspace(workspace);
							updatePathWithWorkspace(workspace);
						}}
						className="hover:cursor-pointer"
					>
						<Avatar className="mr-2 h-6 w-6">
							<AvatarFallback>{getInitials(workspace.name)}</AvatarFallback>
						</Avatar>
						<span className="truncate">{workspace.name}</span>
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onSelect={() => {
						router.push(`/${workspace?.url}/settings`);
					}}
					className="hover:cursor-pointer"
				>
					<Settings className="text-muted-foreground" />
					<span className="ml-2">Settings</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
