"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useModalStore } from "@/store";
import { getInitials } from "@/utils/formatting";
import { Protect, useOrganization, useOrganizationList } from "@clerk/nextjs";
import type { OrganizationResource } from "@clerk/types";
import { ChevronDown, Plus, Settings, UserRoundPlus } from "@squaredmade/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { Button } from "@squaredmade/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function WorkspaceDropdown() {
	const pathName = usePathname();
	const router = useRouter();
	const { organization } = useOrganization();
	const { userMemberships } = useOrganizationList({
		userMemberships: true,
	});
	const { state } = useSidebar();
	const { setShowInvite } = useModalStore((state) => state);
	const { switchWorkspace } = useWorkspaces();

	const updatePathWithWorkspace = (url: string | null) => {
		const pathNameParts = pathName.split("/");

		// validation for 'inbox' page or any other page that doesn't have workspace url
		if (organization?.slug && pathNameParts.includes(organization.slug)) {
			if (pathNameParts[1] === "settings" || pathNameParts[2] === "inbox") {
				pathNameParts[2] = url ?? "";
				router.push(pathNameParts.join("/"));
			} else {
				router.push(`/${url}`);
			}
		}
	};

	const updateActiveWorkspace = async (org: OrganizationResource) => {
		await switchWorkspace(org);
		updatePathWithWorkspace(org.slug);
	};

	useEffect(() => {
		if (!organization && userMemberships.data?.length) {
			updateActiveWorkspace(userMemberships.data[0].organization);
		}
	}, [userMemberships.data, organization]);

	useEffect(() => {
		userMemberships.revalidate?.();
	}, []);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild={true}>
				<Button
					variant="outline"
					className={`w-full items-center gap-2 transition-all duration-300 ease-in-out ${state === "collapsed" ? "justify-center border-none px-0" : "justify-start"}`}
				>
					<Avatar className="h-8 w-8 shrink-0">
						<AvatarImage src={organization?.imageUrl} />
						<AvatarFallback>
							{getInitials(organization?.name || "WS")}
						</AvatarFallback>
					</Avatar>
					{state === "expanded" && (
						<>
							<span
								className={"truncate transition-all duration-300 ease-in-out"}
							>
								{organization?.name}
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
				{userMemberships.data?.map(({ organization: org }) => (
					<DropdownMenuItem
						key={org.id}
						onSelect={() => {
							updateActiveWorkspace(org);
						}}
						className="hover:cursor-pointer"
					>
						<Avatar className="mr-2 h-6 w-6">
							<AvatarImage src={org.imageUrl} />
							<AvatarFallback>{getInitials(org.name)}</AvatarFallback>
						</Avatar>
						<span className="truncate">{org.name}</span>
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onSelect={() => {
						router.push("/create");
					}}
					className="hover:cursor-pointer"
				>
					<Plus className="text-muted-foreground" />
					<span className="ml-2">Create New</span>
				</DropdownMenuItem>
				<Protect permission="org:sys_memberships:manage">
					<DropdownMenuItem asChild={true}>
						<Button
							onClick={() => setShowInvite(true)}
							variant="ghost"
							className="flex h-min w-full justify-start ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							<UserRoundPlus className="text-muted-foreground" />
							<span className="ml-2">Invite People</span>
						</Button>
					</DropdownMenuItem>
				</Protect>
				<DropdownMenuItem
					onSelect={() => {
						router.push(`/${organization?.slug}/settings`);
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
