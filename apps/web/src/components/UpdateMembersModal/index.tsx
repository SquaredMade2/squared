import { useState } from "react";
import WorkspaceInitials from "@/components/WorkspaceImage";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { X } from "lucide-react";
import type {
	MemberDetails,
	UpdateMemberProps,
} from "./update-member.interface";
import type { Workspace } from "@repo/db";

const UpdateMembersInfoModal = ({
	handleSubmit,
	setOpenUserUpdateModal,
	memberDetails,
}: UpdateMemberProps) => {
	const [editUser, setEditUser] = useState<MemberDetails>(memberDetails);
	const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
	const allWorkspaces = useAppSelector((state) => state.taskData.workspaces);
	const index = allWorkspaces.findIndex(
		(item: Workspace) => item.id === workspace.id,
	);

	return (
		<div className="fixed z-10 top-0 left-14 flex items-start justify-center w-screen h-[703.2px] px-2 py-[30vh]">
			<div className="relative flex flex-col w-[508.4px] border border-border bg-popover rounded-lg shadow-[#00000080] shadow-[0px_16px_70px] text-nav">
				<div className="border-b border-border pb-2 px-8 py-4 flex items-center">
					<span className="text-sm">
						<WorkspaceInitials
							workspaceName={workspace.name}
							backgroundColor={index}
							location="workspaceMenu"
						/>
					</span>
					<span className="text-sm font-semibold">
						Invite to your workspace
					</span>
					<span
						onClick={() => setOpenUserUpdateModal(false)}
						className="text-[#DCD8FE93] ml-auto"
					>
						<X className="size-4 cursor-pointer" />
					</span>
				</div>
				<form
					onSubmit={(e) =>
						handleSubmit(
							e,
							editUser.name ?? "",
							editUser.username ?? "",
							editUser.id,
						)
					}
					className="flex flex-col px-8 py-4 gap-2"
				>
					<label htmlFor="member-name">Name</label>
					<input
						id="member-name"
						className="px-2 py-4 bg-transparent border-border border"
						type="text"
						value={editUser.name}
						onChange={(e) =>
							setEditUser((prev: MemberDetails) => ({
								...prev,
								name: e.target.value,
							}))
						}
					/>
					<label htmlFor="member-username">Username</label>
					<input
						id="member-username"
						className="px-2 py-4 bg-transparent border-border border"
						type="text"
						value={editUser.username}
						onChange={(e) =>
							setEditUser((prev: MemberDetails) => ({
								...prev,
								username: e.target.value,
							}))
						}
					/>
					<button
						type="button"
						className="bg-purpleButtonHover hover:bg-purpleButton py-1 px-2 rounded text-foreground"
					>
						Update
					</button>
				</form>
			</div>
		</div>
	);
};

export default UpdateMembersInfoModal;
