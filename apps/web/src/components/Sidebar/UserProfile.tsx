"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useOrganization, useUser } from "@clerk/nextjs";
import { LogOut, Settings } from "@squaredmade/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { Button } from "@squaredmade/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";
import Link from "next/link";

interface UserProfileProps {
	onLogout: () => void;
}

export function UserProfile({ onLogout }: UserProfileProps) {
	const { state } = useSidebar();
	const { user } = useUser();
	const { organization } = useOrganization();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size={state === "collapsed" ? "icon" : "sm"}
					className={`relative ${
						state === "collapsed"
							? "mx-1 justify-center px-3"
							: "w-full justify-start gap-2"
					}`}
				>
					<Avatar className="size-5">
						<AvatarImage src={user?.imageUrl ?? ""} />
						<AvatarFallback>{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
					</Avatar>
					{state === "expanded" && (
						<div className="max-w-5/6 flex-1 text-left">
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
				<DropdownMenuItem asChild>
					<Link href={`/${organization?.slug}/settings/profile`}>
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
