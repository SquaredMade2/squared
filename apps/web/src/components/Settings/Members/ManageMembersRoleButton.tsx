import { useUser } from "@clerk/nextjs";
import { UserCog } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";
import { toast } from "@squaredmade/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { parseError } from "@/utils/parseError";

const ManageMembersRoleButton = ({
	userId,
	pageId,
}: {
	userId: string;
	pageId: string | undefined;
}) => {
	const queryClient = useQueryClient();
	const { user } = useUser();

	const updateRoleMutation = useMutation({
		mutationFn: async (newRole: ClerkAuthorization["role"]) => {
			if (!pageId) throw new Error("Missing required data");
			return await client.workspace.updateUserRole.$post({
				role: newRole,
			});
		},
		onError: (error) => {
			toast.error("Member role could not be updated", {
				description: parseError(error, "unknown error"),
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
	});

	const handleClick = (newRole: ClerkAuthorization["role"]) => {
		updateRoleMutation.mutate(newRole);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className="items-center"
					disabled={userId === user?.id}
					variant="ghost"
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
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ManageMembersRoleButton;
