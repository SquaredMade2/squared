import type { Metadata } from "next";
import WorkspaceLayoutWrapper from "./workspaceLayout-wrapper";

export const metadata: Metadata = {
	title: "Workspace",
};

export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <WorkspaceLayoutWrapper>{children}</WorkspaceLayoutWrapper>;
}
