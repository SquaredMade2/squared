"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { useModalStore } from "@/store";
import { getInitials } from "@/utils/formatting";
import { Protect, useOrganization, useOrganizationList } from "@clerk/nextjs";
import { ChevronDown, Plus, Settings, UserRoundPlus } from "@squared/icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function WorkspaceDropdown() {
	const pathName = usePathname();
	const router = useRouter();
	const { organization } = useOrganization();
	const { userMemberships, setActive } = useOrganizationList({
		userMemberships: true,
	});
	const { state } = useSidebar();
	const { setShowInvite } = useModalStore((state) => state);

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

	useEffect(() => {
		if (!organization && userMemberships.data?.length) {
			setActive?.({ organization: userMemberships.data[0].organization });
			updatePathWithWorkspace(userMemberships.data[0].organization.slug);
		}
	}, [userMemberships.data, organization]);

	useEffect(() => {
		userMemberships.revalidate?.();
	}, []);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
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
							setActive?.({ organization: org });
							updatePathWithWorkspace(org.slug);
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
				<Protect
					condition={(has) =>
						has({ role: "org:admin" }) || has({ role: "org:owner" })
					}
				>
					<DropdownMenuItem asChild>
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
