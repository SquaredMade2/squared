import type { Metadata } from "next";
import WorkspaceMembersSetting from "@/components/WorkspaceMembersSetting";

export const metadata: Metadata = {
	title: "Members",
	description: "View and manage the team members in your workspace.",
};

export default function WorkspaceMembersPage() {
	return <WorkspaceMembersSetting />;
}
