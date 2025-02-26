import { Button } from "@/components/ui/button";
import { Plus } from "@squared/icons";
import Link from "next/link";

const AddTeamButton = ({ workspaceUrl }: { workspaceUrl: string }) => {
	return (
		<Button variant="ghost" className="mt-2 w-full justify-start">
			<Link
				href={`/${workspaceUrl}/settings/new-team`}
				className="flex items-center"
			>
				<Plus className="mr-2 h-4 w-4" />
				Add team
			</Link>
		</Button>
	);
};

export default AddTeamButton;
