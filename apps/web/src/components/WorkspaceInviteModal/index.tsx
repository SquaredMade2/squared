"use client";

import { useModalStore, useWorkspaceStore } from "@/store";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";

const Index = () => {
	const {
		currentWorkspace,
		getWorkspace,
		setCurrentWorkspace,
		inviteToWorkspace,
	} = useWorkspaceStore((state) => state);
	const { showWorkspaceInvite, setShowWorkspaceInvite } = useModalStore(
		(state) => state,
	);
	const params = useParams();
	const [inviteEmails, setInviteEmails] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { toast } = useToast();
	useEffect(() => {
		if (!currentWorkspace) {
			const { workspaceId } = params;
			getWorkspace(workspaceId as string).then(({ workspace }) => {
				if (workspace) {
					setCurrentWorkspace(workspace);
				}
			});
		}
	}, [currentWorkspace, getWorkspace, params, setCurrentWorkspace]);

	const handleInvite = async () => {
		const emails = inviteEmails
			.split(",")
			.map((email) => email.trim())
			.filter(Boolean);

		if (!emails.length || !currentWorkspace) return;

		setIsLoading(true);

		try {
			await inviteToWorkspace(currentWorkspace.id, emails);
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
					<div className="flex gap-2 items-center text-lg">
						<Avatar>
							<AvatarImage src={currentWorkspace?.avatarUrl ?? undefined} />
							<AvatarFallback className="capitalize">
								{currentWorkspace?.name
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
					<Button onClick={handleInvite} className="w-32">
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

export default Index;
