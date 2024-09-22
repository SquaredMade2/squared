import GithubSettings from "@/components/GithubSettings";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Github",
	description:
		"Connect your personal account to github to use the integration feature.",
};

const GithubSettingsPage = () => {
	return <GithubSettings />;
};

export default GithubSettingsPage;
