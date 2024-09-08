"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Workspace, User } from "@repo/db";
import { useUserStore, useWorkspaceStore } from "@/storeZ";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function WorkspaceMembersPage() {
	const params = useParams();
	const { workspaceId } = params;
	const {
		currentWorkspace,
		getWorkspace,
		setCurrentWorkspace,
		inviteToWorkspace,
	} = useWorkspaceStore((state) => state);
	const [workspace, setWorkspace] = useState<Workspace | null>(
		currentWorkspace,
	);
	const { users, getAllUsers } = useUserStore((state) => state);
	const [members, setMembers] = useState<User[]>(users);
	const [inviteEmail, setInviteEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		if (
			workspaceId &&
			workspaceId !== workspace?.id &&
			typeof workspaceId === "string"
		) {
			getWorkspace(workspaceId).then(({ workspace, variant }) => {
				if (workspace) {
					setWorkspace(workspace);
					setCurrentWorkspace(workspace);
				}
			});
		}
		if (workspaceId && !members.length && typeof workspaceId === "string") {
			getAllUsers(workspaceId).then((users) => {
				setMembers(users);
			});
		}
	}, [workspaceId]);

	const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			await inviteToWorkspace(workspaceId as string, inviteEmail);
			toast({ title: `Invitation sent to ${inviteEmail}` });
			setInviteEmail("");
		} catch (error) {
			toast({
				title:
					error instanceof Error ? error.message : "Failed to invite user.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full flex flex-col px-56 py-8 container gap-4">
			<div className="flex flex-col gap-2 items-start">
				<h1 className="text-2xl">Members</h1>
				<p className="text-xs text-muted-foreground">
					Manage members for this workspace
				</p>
			</div>
			<Separator className="mb-8" />
			{workspace && <DataTable columns={columns} data={members} />}
		</div>
	);
}
