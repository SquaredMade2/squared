"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Workspace, User } from "@repo/db";
import { useUserStore, useWorkspaceStore } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useMetaData } from "@/utils/useMetaData";

export default function WorkspaceMembersPage() {
	const params = useParams();
	const { workspaceId } = params;
	const { currentWorkspace, getWorkspace, setCurrentWorkspace } =
		useWorkspaceStore((state) => state);
	const [workspace, setWorkspace] = useState<Workspace | null>(
		currentWorkspace,
	);
	const { users, getAllUsers } = useUserStore((state) => state);
	const [members, setMembers] = useState<User[]>(users);

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

	// Custom hook for metadata
	useMetaData("Members", "Manage your members settings.");

	return (
		<div className="md:w-3/4 w-full flex flex-col py-8 container gap-4">
			<div className="flex flex-col gap-2 items-start">
				<h1 className="text-2xl">Members</h1>
				<p className="text-xs text-muted-foreground">
					Manage members for this workspace
				</p>
			</div>
			<Separator className="mb-8" />
			{workspace && (
				<DataTable
					columns={columns}
					data={members}
					workspace={currentWorkspace}
				/>
			)}
		</div>
	);
}
