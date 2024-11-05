"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { User } from "@squared/db";
import { LogOut } from "lucide-react";
import Link from "next/link";

interface UserProfileProps {
	user: User | null;
	onLogout: () => void;
}

export function UserProfile({ user, onLogout }: UserProfileProps) {
	return (
		<div className="mt-auto p-4 flex items-center gap-4">
			<Avatar>
				<AvatarImage src={user?.avatarUrl ?? ""} />
				<AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
			</Avatar>
			<div className="flex-1">
				<Link href="/settings/profile" className="block">
					<p className="text-sm font-medium">{user?.name || "User"}</p>
					<p className="text-xs text-muted-foreground truncate">
						{user?.email || "user@example.com"}
					</p>
				</Link>
			</div>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							aria-label="Logout"
							onClick={onLogout}
						>
							<LogOut className="h-5 w-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="top">Logout</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
