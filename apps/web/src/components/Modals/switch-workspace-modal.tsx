"use client";

import { useOrganization } from "@clerk/nextjs";
import type { OrganizationResource } from "@clerk/types";
import { Check, CirclePlus } from "@squaredmade/icons";
import { cn } from "@squaredmade/ui/cn";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@squaredmade/ui/dialog";
import { useRouter } from "next/navigation";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useModalStore } from "@/store";
import WorkspaceInitials from "../WorkspaceImage";

export function WorkspaceSwitcher() {
	const { showSwitchWorkspace: open, setShowSwitchWorkspace: setOpen } =
		useModalStore((state) => state);
	const { organization, memberships } = useOrganization({ memberships: true });
	const organizations = memberships?.data?.map((m) => m.organization);
	const router = useRouter();
	const { switchWorkspace } = useWorkspaces();

	if (!(organization && organizations)) return null;

	const handleWorkspaceSwitch = async (org: OrganizationResource) => {
		await switchWorkspace(org);
		setOpen(false);
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogContent>
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
								{organizations.map((org) => (
									<CommandItem
										className="cursor-pointer"
										key={org?.id}
										onSelect={() => handleWorkspaceSwitch(org)}
									>
										<Check
											className={cn(
												"mr-2 size-4",
												organization?.id === org.id
													? "opacity-100"
													: "opacity-0",
											)}
										/>
										<WorkspaceInitials
											backgroundColor={organizations.findIndex(
												(item) => item?.id === org.id,
											)}
											location="workspaceMenu"
											workspaceName={org.name}
										/>
										{org.name}
									</CommandItem>
								))}
							</CommandGroup>
							<CommandSeparator />
							<CommandGroup>
								<CommandItem
									className="cursor-pointer"
									onSelect={() => {
										router.push("/create");
										setOpen(false);
									}}
								>
									<CirclePlus className="mr-2 h-4 w-4" />
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
