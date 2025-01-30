"use client";

import { workspaceService } from "@/lib/services";
import { useModalStore, useWorkspaceStore } from "@/store";
import { TODO } from "@squared/context";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

export const WorkspaceInviteModal = () => {
	const { workspace } = useWorkspaceStore((state) => state);
	const { showWorkspaceInvite, setShowWorkspaceInvite } = useModalStore(
		(state) => state,
	);
	const [inviteEmails, setInviteEmails] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { toast } = useToast();

	const handleInvite = async () => {
		const emails = inviteEmails
			.split(",")
			.map((email) => email.trim())
			.filter(Boolean);

		if (!emails.length || !workspace) return;

		setIsLoading(true);

		try {
			await workspaceService.inviteToWorkspace(TODO, {
				workspaceId: workspace.id,
				email: emails,
			});
			setInviteEmails("");
			setShowWorkspaceInvite(false);
			toast({
				title: "Invites sent!",
			});
		} catch (error) {
			console.error("Error sending invites:", error);
			toast({
				title: "Error sending invites",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={showWorkspaceInvite} onOpenChange={setShowWorkspaceInvite}>
			<DialogContent>
				<DialogHeader>
					<div className="flex items-center gap-2 text-lg">
						<Avatar>
							<AvatarImage src={workspace?.avatarUrl ?? undefined} />
							<AvatarFallback className="capitalize">
								{workspace?.name
									?.split(" ")
									.map((word) => word[0])
									.join("")
									.slice(0, 2)}
							</AvatarFallback>
						</Avatar>
						<h3>Invite to your workspace</h3>
					</div>
				</DialogHeader>
				<Separator className="mb-4" />
				<div className="flex flex-col gap-3 pl-2">
					<Label htmlFor="email">Email</Label>
					<Textarea
						placeholder="email@example.com, email2@example.com..."
						value={inviteEmails}
						onChange={(e) => setInviteEmails(e.target.value)}
					/>{" "}
				</div>
				<DialogFooter>
					<Button onClick={handleInvite} disabled={isLoading} className="w-32">
						{isLoading ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							"Send invites"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
