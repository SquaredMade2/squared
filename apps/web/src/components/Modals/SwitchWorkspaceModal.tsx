"use client";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { teamService } from "@/lib/services";
import { useModalStore, useWorkspaceStore } from "@/store";
import { cn } from "@/utils/cn";
import { useUser } from "@clerk/nextjs";
import { TODO } from "@squared/context";
import { useQuery } from "@tanstack/react-query";
import { Check, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import WorkspaceInitials from "../WorkspaceImage";

export function WorkspaceSwitcher() {
	const { showSwitchWorkspace: open, setShowSwitchWorkspace: setOpen } =
		useModalStore((state) => state);
	const { workspaces, workspace, setWorkspace } = useWorkspaceStore(
		(state) => state,
	);
	const { user } = useUser();
	const router = useRouter();

	const { isPending } = useQuery({
		queryKey: ["switchWorkspace", workspace?.url],
		queryFn: async () => {
			if (!workspace?.url) return;
			const newTeams = user
				? await teamService.getUserTeams(TODO, {
						userId: user.id,
						workspaceId: workspace.id,
					})
				: [];
			setWorkspace(workspace);
			router.push(`/${workspace?.url}/team/${newTeams[0]?.identifier}/all`);
			return newTeams;
		},
		enabled: !!workspace?.url,
	});

	if (isPending) return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Switch Workspace</DialogTitle>
					<DialogDescription>
						Select a workspace to switch to or create a new one.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<Command>
						<CommandInput placeholder="Search workspaces..." />
						<CommandList>
							<CommandEmpty>No workspaces found.</CommandEmpty>
							<CommandGroup heading="Workspaces">
								{workspaces.map((wk) => (
									<CommandItem
										key={wk?.id}
										onSelect={() => {
											setWorkspace(wk);
											setOpen(false);
										}}
										className="cursor-pointer"
									>
										<Check
											className={cn(
												"mr-2 size-4",
												workspace?.id === wk.id ? "opacity-100" : "opacity-0",
											)}
										/>
										<WorkspaceInitials
											workspaceName={wk.name}
											backgroundColor={workspaces.findIndex(
												(item) => item?.id === wk.id,
											)}
											location="workspaceMenu"
										/>
										{wk.name}
									</CommandItem>
								))}
							</CommandGroup>
							<CommandSeparator />
							<CommandGroup>
								<CommandItem
									onSelect={() => {
										router.push("/join");
										setOpen(false);
									}}
									className="cursor-pointer"
								>
									<PlusCircle className="mr-2 h-4 w-4" />
									Create New Workspace
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</div>
			</DialogContent>
		</Dialog>
	);
}
