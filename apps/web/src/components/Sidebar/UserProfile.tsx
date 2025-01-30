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
import { useWorkspaceStore } from "@/store";
import { useUser } from "@clerk/nextjs";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";

interface UserProfileProps {
	onLogout: () => void;
}

export function UserProfile({ onLogout }: UserProfileProps) {
	const { state } = useSidebar();
	const { user } = useUser();
	const { workspace } = useWorkspaceStore((state) => state);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className={`w-full justify-start ${state === "collapsed" && "px-1"}`}
				>
					<Avatar className="h-6 w-6 mr-2">
						<AvatarImage src={user?.imageUrl ?? ""} />
						<AvatarFallback>{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
					</Avatar>
					{state === "expanded" && (
						<div className="flex-1 text-left">
							<p className="text-sm font-medium leading-none">
								{user?.fullName || "User"}
							</p>
							<p className="text-xs text-muted-foreground truncate">
								{user?.primaryEmailAddress?.emailAddress || "user@example.com"}
							</p>
						</div>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href={`/${workspace?.url}/settings/profile`}>
						<Settings className="mr-2 h-4 w-4" />
						<span>Profile Settings</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={onLogout}>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
