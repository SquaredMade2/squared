"use client";

import {
	InviteModal,
	NewTaskModal,
	TaskSelector,
	WorkspaceInviteModal,
	WorkspaceSwitcher,
} from "@/components/Modals";
import SearchCommand from "@/components/SearchCommand";
import { SquaredStoreProvider } from "@/store";

export default function ClientLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SquaredStoreProvider>
			<WorkspaceInviteModal />
			<SearchCommand />
			<WorkspaceSwitcher />
			<TaskSelector />
			<InviteModal />
			<NewTaskModal />
			{children}
		</SquaredStoreProvider>
	);
}
