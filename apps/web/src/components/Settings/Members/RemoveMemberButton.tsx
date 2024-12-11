import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { teamService, workspaceService } from "@/lib/services";
import { useUserStore } from "@/store";
import { TODO } from "@squared/context";
import { Ellipsis } from "lucide-react";
import type { MemberWithRole } from "./data-table";

const RemoveMemberButton = ({
	userId,
	page,
	pageId,
	membersWithRoles,
	setPageUsers,
}: {
	userId: string;
	page: string | undefined;
	pageId: string | undefined;
	membersWithRoles: MemberWithRole[] | undefined;
	setPageUsers: ((users: MemberWithRole[]) => void) | undefined;
}) => {
	const currentUser = useUserStore((state) => state.user);
	const { toast } = useToast();

	const handleClick = async () => {
		if (!pageId) return;

		if (page === "workspace") {
			try {
				await workspaceService.removeUserFromWorkspace(TODO, {
					userId,
					workspaceId: pageId,
				});
				toast({ title: "Member removed" });
				membersWithRoles &&
					setPageUsers &&
					setPageUsers(
						membersWithRoles.filter((pageUser) => pageUser.id !== userId),
					);
			} catch (error) {
				console.error(error);
				toast({ title: "Member could not be removed" });
			}
		} else {
			try {
				await teamService.removeUserFromTeam(TODO, {
					userId,
					teamId: pageId,
				});
				toast({ title: "Member removed" });
				membersWithRoles &&
					setPageUsers &&
					setPageUsers(
						membersWithRoles.filter((pageUser) => pageUser.id !== userId),
					);
			} catch (error) {
				console.error(error);
				toast({ title: "Member could not be removed" });
			}
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="items-center"
					disabled={userId === currentUser?.id}
				>
					<Ellipsis className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>
					<Button variant="ghost" onClick={handleClick}>
						Remove from {page === "workspace" ? "Workspace" : "Team"}
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default RemoveMemberButton;
