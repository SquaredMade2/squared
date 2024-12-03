import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { workspaceService } from "@/lib/services";
import { useWorkspaceStore } from "@/store";
import { Ellipsis } from "lucide-react";

const RemoveMemberButton = ({ userId }: { userId: string }) => {
	const currentWorkspace = useWorkspaceStore((state) => state.workspace);
	const workspaceId = currentWorkspace ? currentWorkspace.id : undefined;

	const handleClick = async () => {
		if (workspaceId) {
			await workspaceService.removeUserFromWorkspace(userId, workspaceId);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="items-center">
					<Ellipsis className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>
					<Button onClick={handleClick}>Remove from Workspace</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default RemoveMemberButton;
