"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { useModalStore, useWorkspaceStore } from "@/store";
import { useUser } from "@clerk/nextjs";
import { LogOut, Settings, UserRoundPlus } from "lucide-react";
import Link from "next/link";

interface UserProfileProps {
	onLogout: () => void;
}

export function UserProfile({ onLogout }: UserProfileProps) {
	const { state } = useSidebar();
	const { user } = useUser();
	const { workspace } = useWorkspaceStore((state) => state);
	const { setShowInvite } = useModalStore((state) => state);

	const isUserWorkspaceAdmin = workspace?.admins.filter(
		(admin) => admin === user?.id,
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className={`w-full justify-start ${state === "collapsed" && "px-1"}`}
				>
					<Avatar className="mr-2 h-6 w-6">
						<AvatarImage src={user?.imageUrl ?? ""} />
						<AvatarFallback>{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
					</Avatar>
					{state === "expanded" && (
						<div className="flex-1 text-left">
							<p className="font-medium text-sm leading-none">
								{user?.fullName || "User"}
							</p>
							<p className="truncate text-muted-foreground text-xs">
								{user?.primaryEmailAddress?.emailAddress || "user@example.com"}
							</p>
						</div>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild className="cursor-pointer">
					<Link href={`/${workspace?.url}/settings/profile`}>
						<Settings className="mr-2 h-4 w-4" />
						<span>Profile Settings</span>
					</Link>
				</DropdownMenuItem>
				{/* This should only show for workspace owners and admins */}
				{isUserWorkspaceAdmin && (
					<DropdownMenuItem asChild>
						<Button
							onClick={() => setShowInvite(true)}
							variant="ghost"
							className="w-full h-min flex justify-start ring-offset-0 focus-visible:ring-0 focus-visible:ring-none: focus-visible:ring-offset-0"
						>
							<UserRoundPlus className="mr-2 h-4 w-4" />
							<span>Invite People</span>
						</Button>
					</DropdownMenuItem>
				)}
				<DropdownMenuItem onClick={onLogout} className="cursor-pointer">
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
