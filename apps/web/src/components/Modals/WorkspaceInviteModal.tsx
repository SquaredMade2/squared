"use client";

import { client } from "@/lib/client";
import { useModalStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { useOrganization } from "@clerk/nextjs";
import { LoaderCircle } from "@squared/icons";
import { useMutation } from "@tanstack/react-query";
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
	const { showWorkspaceInvite, setShowWorkspaceInvite } = useModalStore(
		(state) => state,
	);
	const [inviteEmails, setInviteEmails] = useState<string>("");
	const { organization } = useOrganization();
	const { toast } = useToast();

	const { mutate: handleInvite, isPending } = useMutation({
		mutationKey: ["workspace", "workspaceInvite", organization?.id],
		mutationFn: async () => {
			if (!organization?.slug) return;
			const emailAddresses = inviteEmails
				.split(",")
				.map((email) => email.trim())
				.filter(Boolean);

			await client.workspace.inviteToWorkspace.$post({
				email: emailAddresses,
				workspaceId: organization.id,
				workspaceSlug: organization.slug,
			});
		},
		onSuccess: () => {
			setInviteEmails("");
			setShowWorkspaceInvite(false);
			toast({
				title: "Invites sent!",
			});
		},
		onError: (error) => {
			toast({
				title: "Error sending invites",
				description: parseError(error),
				variant: "destructive",
			});
		},
	});

	return (
		<Dialog open={showWorkspaceInvite} onOpenChange={setShowWorkspaceInvite}>
			<DialogContent>
				<DialogHeader>
					<div className="flex items-center gap-2 text-lg">
						<Avatar>
							<AvatarImage src={organization?.imageUrl ?? undefined} />
							<AvatarFallback className="capitalize">
								{organization?.name
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
					<Button
						onClick={() => handleInvite()}
						disabled={isPending}
						className="w-32"
					>
						{isPending ? (
							<LoaderCircle className="size-4 animate-spin" />
						) : (
							"Send invites"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
