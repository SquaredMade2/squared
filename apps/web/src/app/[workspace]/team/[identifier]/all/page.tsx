import type { Metadata } from "next";
import AllTasks from "@/components/AllTasks";
import { capitalizeFirstLetter, removeSlug } from "@/utils/formatting";

type Props = {
	params: { workspace: string; taskIdentifier: string; taskName: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { workspace } = params;
	return {
		title: `All Tasks > ${capitalizeFirstLetter(removeSlug(workspace))}`,
		description: `Collaborate and manage all tasks in workspace ${workspace}.`,
	};
}

const Home = () => {
	return <AllTasks />;
};

export default Home;
