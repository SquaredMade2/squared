import CreateTeam from "@/components/CreateTeam";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Add Team",
	description: "Create a new team to start collaborating on tasks.",
};

const CreateTeamPage = () => {
	return <CreateTeam />;
};

export default CreateTeamPage;
