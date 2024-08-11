import React from "react";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import type { MembersModalProp } from "@/components/InviteMembersModal/members-modal.interace";
import type { Workspace } from "@/store/taskData/taskData.interfaces";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DialogClose } from "../ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
const InviteMembersModal = ({ handleSubmit, setEmail }: MembersModalProp) => {
  const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
  const allWorkspaces = useAppSelector((state) => state.taskData.workspaces);
  const index = allWorkspaces.findIndex(
    (item: Workspace) => item._id === workspace._id
  );

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="default">Invite Member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite to your workspace</DialogTitle>
          <DialogDescription>
            The Squared account associated with this email will receive an
            invitation to join your workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              placeholder="email@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <DialogClose>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMembersModal;
