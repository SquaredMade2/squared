import type { Metadata } from "next";
import WorkspaceLayoutWrapper from "./workspaceLayout-wrapper";

export const metadata: Metadata = {
	title: "Workspace",
	description:
		"Collaborate and manage your team's workspaces. Create new projects, organize tasks, and oversee progress across multiple workspaces with Squared.",
};

export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <WorkspaceLayoutWrapper>{children}</WorkspaceLayoutWrapper>;
}
