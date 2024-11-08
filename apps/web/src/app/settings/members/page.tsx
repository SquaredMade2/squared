"use client";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { Separator } from "@/components/ui/separator";
import { useUsers } from "@/hooks/useUsers";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import type { ReactNode } from "react";
import { columns } from "./columns";
import { DataTable, type MemberWithRole } from "./data-table";

export default function WorkspaceMembersPage() {
	const { currentWorkspace, loading: workspaceLoading } = useWorkspaces();
	const { users, loading: userLoading } = useUsers();

	const membersWithRoles: MemberWithRole[] = currentWorkspace
		? users.map((user) => ({
				...user,
				role: currentWorkspace.admins.includes(user.id) ? "admin" : "member",
			}))
		: [];

	if (workspaceLoading || userLoading) {
		return (
			<MembersSettingsWrapper>
				<div className="w-full flex justify-center p-20">
					<SquaredLoader />
				</div>
			</MembersSettingsWrapper>
		);
	}

	return (
		<MembersSettingsWrapper>
			{currentWorkspace && (
				<DataTable
					columns={columns}
					data={membersWithRoles}
					workspace={currentWorkspace}
				/>
			)}
		</MembersSettingsWrapper>
	);
}

const MembersSettingsWrapper = ({ children }: { children: ReactNode }) => (
	<div className="md:w-3/4 w-full flex flex-col py-8 container gap-4">
		<div className="flex flex-col gap-2 items-start">
			<h1 className="text-2xl">Members</h1>
			<p className="text-xs text-muted-foreground">
				Manage members for this workspace
			</p>
		</div>
		<Separator className="mb-8" />
		{children}
	</div>
);
