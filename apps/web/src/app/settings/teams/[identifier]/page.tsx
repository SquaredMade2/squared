import TeamsSetting from "@/components/TeamsSetting";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Teams",
	description: "Create and manage teams within your workspace.",
};

const TeamsSettingPage = () => {
	return <TeamsSetting />;
};

export default TeamsSettingPage;
