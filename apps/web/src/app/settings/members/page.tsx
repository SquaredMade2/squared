"use client";
import { useUserStore, useWorkspaceStore } from "@/store";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export default function WorkspaceMembersPage() {
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { users } = useUserStore((state) => state);

	if (!currentWorkspace) {
		return (
			<MembersSettingsWrapper>
				<div className="w-full flex justify-center p-20">
					<Loader2 className="animate-spin" />
				</div>
			</MembersSettingsWrapper>
		);
	}

	return (
		<MembersSettingsWrapper>
			{currentWorkspace && (
				<DataTable
					columns={columns}
					data={users.map((m) => ({
						...m,
						role: currentWorkspace.admins.includes(m.id) ? "admin" : "member",
					}))}
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
