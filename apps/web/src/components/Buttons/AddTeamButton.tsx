import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const AddTeamButton = () => {
	const router = useRouter();

	return (
		<Button
			variant="ghost"
			className="w-full justify-start mt-2"
			onClick={() => router.replace("/settings/new-team")}
		>
			<Plus className="mr-2 h-4 w-4" />
			Add team
		</Button>
	);
};

export default AddTeamButton;
