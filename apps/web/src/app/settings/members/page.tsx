// "use client";
// import SquaredLoader from "@/components/Loaders/SquaredLoader";
// import { Separator } from "@/components/ui/separator";
// import { useUsers } from "@/hooks/useUsers";
// import { useWorkspaces } from "@/hooks/useWorkspaces";
// import { useState } from "react";
// import type { ReactNode } from "react";
// import { columns } from "./columns";
// import { DataTable, type MemberWithRole } from "./data-table";

// export default function WorkspaceMembersPage() {
// 	const { workspace, loading: workspaceLoading } = useWorkspaces();
// 	const { users, loading: userLoading } = useUsers();
// 	const [workspaceUsers, setWorkspaceUsers] = useState(users);

// 	const membersWithRoles: MemberWithRole[] = workspace
// 		? workspaceUsers.map((user) => ({
// 				...user,
// 				role: workspace.admins.includes(user.id) ? "admin" : "member",
// 			}))
// 		: [];

// 	const enhancedColumns = columns.map((col) => ({
// 		...col,
// 		meta: {
// 			membersWithRoles,
// 			setWorkspaceUsers,
// 		},
// 	}));

// 	if (workspaceLoading || userLoading) {
// 		return (
// 			<MembersSettingsWrapper>
// 				<div className="w-full flex justify-center p-20">
// 					<SquaredLoader />
// 				</div>
// 			</MembersSettingsWrapper>
// 		);
// 	}

// 	return (
// 		<MembersSettingsWrapper>
// 			{workspace && (
// 				<DataTable
// 					columns={enhancedColumns}
// 					data={membersWithRoles}
// 					workspace={workspace}
// 				/>
// 			)}
// 		</MembersSettingsWrapper>
// 	);
// }

// const MembersSettingsWrapper = ({ children }: { children: ReactNode }) => (
// 	<div className="md:w-3/4 w-full flex flex-col py-8 container gap-4">
// 		<div className="flex flex-col gap-2 items-start">
// 			<h1 className="text-2xl">Members</h1>
// 			<p className="text-xs text-muted-foreground">
// 				Manage members for this workspace
// 			</p>
// 		</div>
// 		<Separator className="mb-8" />
// 		{children}
// 	</div>
// );
