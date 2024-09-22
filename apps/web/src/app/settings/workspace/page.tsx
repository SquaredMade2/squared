import type { Metadata } from "next";
import WorkspaceSettings from "@/components/WorkspaceSettings";

export const metadata: Metadata = {
	title: "Workspace",
	description: "Manage all your tasks and collaborate in the workspace.",
};

const WorkspaceSettingsPage = () => {
	return <WorkspaceSettings />;
};

export default WorkspaceSettingsPage;
