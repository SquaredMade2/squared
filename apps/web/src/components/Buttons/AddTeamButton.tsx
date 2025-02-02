import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const AddTeamButton = ({ workspaceUrl }: { workspaceUrl: string }) => {
	const router = useRouter();

	return (
		<Button
			variant="ghost"
			className="mt-2 w-full justify-start"
			onClick={() => router.replace(`${workspaceUrl}/settings/new-team`)}
		>
			<Plus className="mr-2 h-4 w-4" />
			Add team
		</Button>
	);
};

export default AddTeamButton;
