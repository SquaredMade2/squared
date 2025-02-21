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
import { useModalStore } from "@/store";
import { cn } from "@/utils/cn";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Check, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import WorkspaceInitials from "../WorkspaceImage";

export function WorkspaceSwitcher() {
	const { showSwitchWorkspace: open, setShowSwitchWorkspace: setOpen } =
		useModalStore((state) => state);
	const { organization, memberships } = useOrganization({ memberships: true });
	const { setActive } = useOrganizationList();
	const organizations = memberships?.data?.map((m) => m.organization);
	const router = useRouter();

	if (!organization || !organizations || !setActive) return null;

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
								{organizations.map((org) => (
									<CommandItem
										key={org?.id}
										onSelect={() => {
											setActive({ organization: org });
											setOpen(false);
										}}
										className="cursor-pointer"
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
											workspaceName={org.name}
											backgroundColor={organizations.findIndex(
												(item) => item?.id === org.id,
											)}
											location="workspaceMenu"
										/>
										{org.name}
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
