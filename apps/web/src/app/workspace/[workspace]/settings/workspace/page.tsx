"use client";

import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  getWorkspace,
  deleteWorkspace,
} from "@/store/taskData/thunks";
import SettingsTopNavBar from "@/components/SettingsTopNavBar";
import WorkspaceInitials from "@/components/WorkspaceImage";
import DeleteButton from "@/components/DeleteButton";
import BlueButton from "@/components/BlueButton";
import { navBarToggle } from "@/store/userSettings";
import type { RootState } from "@/store";
import { useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { X } from "lucide-react";

export default function WorkspaceSettings() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();

  const workspace = useSelector(
    (state: RootState) => state.taskData.currentWorkspace
  );
  const workspaceList = useSelector(
    (state: RootState) => state.taskData.workspaces
  );
  const access = useSelector(
    (state: RootState) => state.taskData.access
  );
  const { user } = useSelector(
    (state: RootState) => state.userSettings
  );
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [workspaceURL, setWorkspaceURL] = useState(workspace.url);
  const [deletingWorkspace, setDeletingWorkspace] = useState(false);
  const { showNavBar } = useSelector(
    (state: RootState) => state.userSettings
  );
  const [fillColor, setFillColor] = useState("text-[#9c9eac]");
  const urlRegex = /^[a-z0-9-]*$/;
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const index = workspaceList.findIndex(
    (item) => item._id === workspace._id
  );
  const workspaceUrl = params.workspace;
  const userHasAccess =
    access &&
    access.id === user?._id &&
    workspaceUrl === workspace.url;

  const currentUserRole = workspace.users.find(
    (u) => u.user === user._id
  )?.role;

  const deleteOrLeaveBtnLabel =
    currentUserRole === "owner" ? "Delete this workspace" : "Leave";

  const checkURL = (str: string) => {
    const trimmedStr = str.trim();
    if (trimmedStr === "") {
      return false;
    }
    return urlRegex.test(trimmedStr);
  };

  const handleOpen = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const handleDelete = async () => {
    try {
      const actionResult = await dispatch(
        deleteWorkspace(workspace._id)
      );
      unwrapResult(actionResult);

      setDeletingWorkspace(true);
      handleClose();
      toast({ title: "Workspace deleted, redirecting..." });
    } catch (error) {
      console.error("Error deleting workspace:", error);
      toast({
        title: "Failed to delete workspace. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const urlCheck: boolean = checkURL(workspaceURL.trim());
    const name: string = workspaceName.trim();
    const url: string = workspaceURL.trim();
    if (!urlCheck) {
      toast({
        title:
          "Invalid workspace URL. URL must be in the format hello-world.",
        variant: "destructive",
      });
    } else if (!name) {
      toast({
        title: "Workspace name is required.",
        variant: "destructive",
      });
    } else {
      await updateWorkspace(name, url);
      await dispatch(
        getWorkspace({ url: workspace.url, id: workspace._id })
      );
      router.push(`workspace/${url}/settings/workspace`);
      toast({ title: "Workspace Updated" });
    }
  };

  const updateWorkspace = async (name: string, url: string) => {
    try {
      await axios({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/update`,
        withCredentials: true,
        params: {
          name: name,
          url: url,
          id: workspace._id,
        },
      });
    } catch (error) {
      toast({
        title: "An error occurred trying to update workspace",
        variant: "destructive",
      });
    }
  };

  const handleNavToggle = () => {
    const navBarValue = !showNavBar;
    dispatch(navBarToggle(navBarValue));
  };

  useEffect(() => {
    if (deletingWorkspace) {
      setTimeout(() => {
        if (!workspaceList.length) {
          router.push("/join");
        } else {
          router.push(`workspace/${workspaceList[0].url}`);
        }
        setDeletingWorkspace(false);
      }, 2000);
    }
  }, [workspaceList, deletingWorkspace, index]);

  useEffect(() => {
    if (!userHasAccess) {
      router.push(`workspace/${workspaceUrl}`);
    }
  }, []);

  return (
    <div className="flex mdsm:flex-col relative bg-background min-h-screen xs:h-full xs:pb-10 w-full">
      <div className="relative mdsm:absolute -left-0 transition-all duration-300 ease-in-out z-10 lg:hidden mdsm:visible">
        <SettingsTopNavBar setShowNavBar={handleNavToggle} />
      </div>
      <div className="h-full w-full flex flex-col items-center bg-background text-foreground pt-20">
        <div>
          <dialog
            className="w-84 bg-background text-foreground rounded-lg cursor-default border border-border"
            ref={dialogRef}
          >
            <div className="w-full flex items-center justify-between py-4 px-8 border-b border-border">
              <h1>Verify workspace deletion</h1>
              <div
                onClick={handleClose}
                onMouseEnter={() => setFillColor("text-[#BDBFC5]")}
                onMouseLeave={() => setFillColor("text-[#9c9eac]")}
              >
                <X className={`cursor-pointer ${fillColor}`} />
              </div>
            </div>
            <div className="h-full w-full flex flex-col items-center mt-5 py-2 px-8">
              <h1>
                Are you sure you want to{" "}
                {deleteOrLeaveBtnLabel.toUpperCase()}?
              </h1>
              <div className="flex mb-5">
                <DeleteButton
                  description={deleteOrLeaveBtnLabel}
                  handleAction={handleDelete}
                />
              </div>
            </div>
          </dialog>
        </div>
        <div className="w-1/3 mdsm:w-3/4 xs:w-full">
          <div>
            <h1 className="text-2xl font-medium">Workspace</h1>
            <p className="text-sm mb-4 mt-1 text-muted-foreground">
              Manage your workspace settings
            </p>
          </div>
          <span className="block w-full border-t border-border my-6" />
          <div className="border-b border-border">
            <h2>Logo</h2>
            <WorkspaceInitials
              workspaceName={workspace.name}
              backgroundColor={index}
              location="workspaceSettings"
            />
          </div>
          <form
            onSubmit={handleUpdate}
            className="border-b border-border mt-8"
          >
            <h2>General</h2>
            <div className="mb-4 mt-5 text-sm">
              <p className="text-sm text-muted-foreground mb-1.5">
                Workspace name
              </p>
              <input
                type="text"
                className="flex border border-border py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded w-3/4 xs:w-full pl-1.5 text-foreground text-sm bg-textField"
                onChange={(e) => setWorkspaceName(e.target.value)}
                value={workspaceName}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1.5">
                Workspace URL
              </p>
              <div className="flex relative items-center">
                <span className="text-sm text-muted-foreground absolute left-1.5">
                  Squared.com/
                </span>
                <input
                  type="text"
                  className="flex border border-border py-1.5 pl-[102px] focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm rounded w-3/4 xs:w-full bg-textField"
                  onChange={(e) => setWorkspaceURL(e.target.value)}
                  value={workspaceURL}
                />
              </div>
            </div>
            <BlueButton description="Update" />
          </form>
          <div>
            <h2 className="mt-10">Delete workspace</h2>
            <p className="text-sm mb-4 mt-1 text-muted-foreground">
              If you want to permanently delete this workspace and all
              of its data, including but not limited to users, issues,
              and comments, you can do so below.
            </p>
            <DeleteButton
              description={deleteOrLeaveBtnLabel}
              handleAction={handleOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
