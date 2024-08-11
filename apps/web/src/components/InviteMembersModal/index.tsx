import React from "react";
import WorkspaceInitials from "@/components/WorkspaceImage";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { X } from "lucide-react";
import type { MembersModalProp } from "@/components/InviteMembersModal/members-modal.interace";
import type { Workspace } from "@/store/taskData/taskData.interfaces";

const InviteMembersModal = ({
  handleSubmit,
  setEmail,
  setOpenModal,
}: MembersModalProp) => {
  const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
  const allWorkspaces = useAppSelector((state) => state.taskData.workspaces);
  const index = allWorkspaces.findIndex(
    (item: Workspace) => item._id === workspace._id
  );
  return (
    <div className="fixed z-10 top-0 left-26 flex items-start justify-center w-screen h-[703.2px] px-2 py-[30vh]">
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
            onClick={() => setOpenModal(false)}
            className="text-[#DCD8FE93] ml-auto"
          >
            <X className="size-4 cursor-pointer" />
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col px-8 py-4 gap-2">
          <label htmlFor="invite-user-email">Email</label>
          <input
            id="invite-user-email"
            className="px-2 py-4 bg-transparent border-border border"
            type="text"
            placeholder="email@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="button"
            className="bg-purpleButtonHover hover:bg-purpleButton py-1 px-2 rounded text-foreground"
          >
            Send invites
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteMembersModal;
