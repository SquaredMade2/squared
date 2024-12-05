"use client";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { MembersPage } from "@/components/Settings/Members/MembersPage";
import { useUsers } from "@/hooks/useUsers";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import MemberSettingsWrapper from "../../MemberSettingsWrapper";
import type { MemberWithRole } from "./data-table";

export default function WorkspaceMembersPage() {
	const { workspace, loading: workspaceLoading } = useWorkspaces();
	const { users, loading: userLoading } = useUsers();

	const membersWithRoles: MemberWithRole[] = workspace
		? users.map((user) => ({
				...user,
				role: workspace.admins.includes(user.id) ? "admin" : "member",
			}))
		: [];

	if (workspaceLoading || userLoading) {
		return (
			<MemberSettingsWrapper page="workspace">
				<div className="w-full flex justify-center p-20">
					<SquaredLoader />
				</div>
			</MemberSettingsWrapper>
		);
	}

	return (
		<MemberSettingsWrapper page="workspace">
			<MembersPage
				members={membersWithRoles}
				workspace={workspace}
				admins={workspace?.admins || []}
			/>
		</MemberSettingsWrapper>
	);
}
