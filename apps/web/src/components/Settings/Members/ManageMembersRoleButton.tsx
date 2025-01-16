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
import { useEffect, useState } from "react";
import type { MemberWithRole } from "./data-table";

const ManageMembersRoleButton = ({
	userId,
	pageId,
	membersWithRoles,
	fetchWorkspaceUsersWithRoles,
}: {
	userId: string;
	page: string | undefined;
	pageId: string | undefined;
	membersWithRoles: MemberWithRole[] | undefined;
	fetchWorkspaceUsersWithRoles: () => void;
}) => {
	const [loggedInUserRole, setLoggedInUserRole] = useState<Role | null>(null);
	const loggedInUser = useUserStore((state) => state.user);
	const { toast } = useToast();
	const selectedUserRole = membersWithRoles?.find(
		(user) => user.id === userId,
	)?.role;

	const fetchLoggedInUserRole = async () => {
		if (!loggedInUser || !pageId) return;
		try {
			const role = await userService.getUserWorkspaceRole(TODO, {
				userId: loggedInUser.id,
				workspaceId: pageId,
			});
			setLoggedInUserRole(role);
		} catch (error) {
			console.error("Error fetching role:", error);
		}
	};

	const handleClick = async (newRole: Role) => {
		if (!pageId || !loggedInUser) return;

		try {
			await userService.updateUsersRole(TODO, {
				callerId: loggedInUser?.id,
				userId,
				workspaceId: pageId,
				newRole,
			});
			fetchWorkspaceUsersWithRoles();
			fetchLoggedInUserRole();

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

	useEffect(() => {
		fetchLoggedInUserRole();
	}, [loggedInUser, pageId, membersWithRoles]);

	if (loggedInUserRole !== "admin" && loggedInUserRole !== "owner") {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="items-center"
					disabled={userId === loggedInUser?.id}
				>
					<UserCog />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => handleClick("member")}
						disabled={
							selectedUserRole === "member" ||
							(loggedInUserRole === "admin" &&
								(selectedUserRole === "admin" || selectedUserRole === "owner"))
						}
					>
						Change user role to Member
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleClick("admin")}
						disabled={
							selectedUserRole === "admin" ||
							(loggedInUserRole === "admin" && selectedUserRole === "owner")
						}
					>
						Change user role to Admin
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleClick("owner")}
						disabled={
							selectedUserRole === "owner" || loggedInUserRole !== "owner"
						}
					>
						Change user role to Owner
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ManageMembersRoleButton;
