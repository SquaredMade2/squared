import type { Metadata } from "next";
import MyIssues from "@/components/MyIssues";
import { capitalizeFirstLetter, removeSlug } from "@/utils/formatting";

type Props = {
	params: { workspace: string; taskIdentifier: string; taskName: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { workspace } = params;
	return {
		title: `My Issues > ${capitalizeFirstLetter(removeSlug(workspace))}`,
		description: `Track and manage your issues for workspace ${workspace}.`,
	};
}

const MyIssuesPage = () => {
	return <MyIssues />;
};

export default MyIssuesPage;
