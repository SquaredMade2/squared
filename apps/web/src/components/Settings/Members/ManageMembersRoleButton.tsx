import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { client } from "@/lib/client";
import { parseError } from "@/utils/parseError";
import { useUser } from "@clerk/nextjs";
import { UserCog } from "@squaredmade/icons";
import { DropdownMenuGroup } from "@squaredmade/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { MemberWithRole } from "./data-table";

const ManageMembersRoleButton = ({
	userId,
	pageId,
	membersWithRoles,
}: {
	userId: string;
	pageId: string | undefined;
	membersWithRoles: MemberWithRole[] | undefined;
}) => {
	const queryClient = useQueryClient();
	const { user } = useUser();
	const loggedInUserRole = membersWithRoles?.find(
		(u) => u.identifier === user?.id,
	)?.role;

	const updateRoleMutation = useMutation({
		mutationFn: async (newRole: ClerkAuthorization["role"]) => {
			if (!pageId) throw new Error("Missing required data");
			return await client.workspace.updateUserRole.$post({
				role: newRole,
			});
		},
		onSuccess: (_, newRole) => {
			queryClient.invalidateQueries({
				queryKey: ["workspaceUsers", pageId],
			});
			queryClient.invalidateQueries({
				queryKey: ["userRole", user?.id, pageId],
			});
			toast.success(`Member role updated to ${newRole}`);
		},
		onError: (error) => {
			toast.error("Member role could not be updated", {
				description: parseError(error, "unknown error"),
			});
		},
	});

	const handleClick = (newRole: ClerkAuthorization["role"]) => {
		updateRoleMutation.mutate(newRole);
	};

	if (loggedInUserRole !== "org:admin" && loggedInUserRole !== "org:owner") {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="items-center"
					disabled={userId === user?.id}
				>
					<UserCog />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => handleClick("org:member")}>
						Change user role to Member
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleClick("org:admin")}>
						Change user role to Admin
					</DropdownMenuItem>
					{loggedInUserRole === "org:owner" && (
						<DropdownMenuItem onClick={() => handleClick("org:owner")}>
							Change user role to Owner
						</DropdownMenuItem>
					)}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ManageMembersRoleButton;
