import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { workspaceService } from "@/lib/services";
import { useUserStore, useWorkspaceStore } from "@/store";
import { TODO } from "@squared/context";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";

const RemoveMemberButton = ({
	userId,
	userRole,
}: { userId: string; userRole: string }) => {
	const currentWorkspace = useWorkspaceStore((state) => state.workspace);
	const currentUser = useUserStore((state) => state.user);
	const workspaceId = currentWorkspace ? currentWorkspace.id : undefined;
	const router = useRouter();
	const { toast } = useToast();

	const handleClick = async () => {
		if (!workspaceId) return;

		try {
			await workspaceService.removeUserFromWorkspace(TODO, {
				userId,
				workspaceId,
			});
			toast({ title: "Member removed" });
			router.refresh();
		} catch (error) {
			console.error(error);
			toast({ title: "Member could not be removed" });
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="items-center"
					// disabled={userRole !== "admin" || userId === currentUser?.id}
					disabled={userId === currentUser?.id}
				>
					<Ellipsis className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>
					<Button variant="ghost" onClick={handleClick}>
						Remove from Workspace
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default RemoveMemberButton;
