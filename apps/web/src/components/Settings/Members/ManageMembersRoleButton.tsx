import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { userService } from "@/lib/services";
import { useUserStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { DropdownMenuGroup } from "@repo/ui/dropdown-menu";
import { TODO } from "@squared/context";
import type { Role } from "@squared/db";
import { UserCog } from "lucide-react";
import type { MemberWithRole } from "./data-table";

const ManageMembersRoleButton = ({
	userId,
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
	const selectedUserRole = membersWithRoles?.find(
		(user) => user.id === userId,
	)?.role;
	const handleClick = async (newRole: Role) => {
		if (!pageId || !membersWithRoles || !setPageUsers) return;

		try {
			await userService.updateUsersRole(TODO, {
				userId,
				workspaceId: pageId,
				newRole,
			});
			const updatedUsers = membersWithRoles.map((user) =>
				user.id === userId ? { ...user, role: newRole } : user,
			);
			setPageUsers(updatedUsers);

			toast({ title: `Member role updated to ${newRole}` });
		} catch (error) {
			console.error(error);
			toast({
				title: "Member role could not be updated",
				description: parseError(error, "unknown error"),
				variant: "destructive",
			});
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
					<UserCog />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					{selectedUserRole !== "member" && (
						<DropdownMenuItem onClick={() => handleClick("member")}>
							Convert user to Member
						</DropdownMenuItem>
					)}
					{selectedUserRole !== "admin" && (
						<DropdownMenuItem onClick={() => handleClick("admin")}>
							Convert user to Admin
						</DropdownMenuItem>
					)}
					{selectedUserRole !== "owner" && (
						<DropdownMenuItem onClick={() => handleClick("owner")}>
							Convert user to Owner
						</DropdownMenuItem>
					)}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ManageMembersRoleButton;
