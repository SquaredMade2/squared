"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { isRejected } from "@reduxjs/toolkit";
import {
  addWorkspace,
  getAllWorkspaces,
} from "@/store/taskData/thunks";
import { useToast } from "../ui/use-toast";
import { ChevronLeft } from "lucide-react";
import { getUser } from "@/store/userSettings/thunks";
import type { CreateWorkspaceProps } from "./CreateWorkspace.interfaces";
import type { AppDispatch, RootState } from "@/store";
import { Button } from "../ui/button";
// import { linkTo } from "@storybook/addon-links/*";

const CreateWorkspace = ({
  onboarding,
  handleNextPage,
}: CreateWorkspaceProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [inputValue, setInputValue] = useState("");
  const [urlInputValue, setUrlInputValue] = useState("");
  const urlRegex = /^[a-z0-9-]*$/;
  const nameRegex = /^[a-zA-Z0-9-& ']+$/;
  const workspaceList = useSelector(
    (state: RootState) => state.taskData.workspaces
  );
  const taskDataLoadingState = useSelector(
    (state: RootState) => state.taskData.isLoading
  );
  const user = useSelector(
    (state: RootState) => state.userSettings.user
  );

  const checkUrl = (str: string) => {
    const newStr = str.trim();
    if (newStr === "") {
      return false;
    }
    return urlRegex.test(newStr);
  };

  const checkName = (str: string) => {
    const newStr = str.trim();
    if (newStr === "") {
      return false;
    }
    return nameRegex.test(newStr);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!checkName(inputValue)) {
      toast({
        title:
          "Invalid workspace name. Name must not be empty and follow the format.",
        variant: "destructive",
      });
      return;
    }

    const finalWorkspaceUrl: string = (
      urlInputValue.length > 0 ? urlInputValue : inputValue
    )
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/'/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    if (!checkUrl(finalWorkspaceUrl)) {
      toast({
        title:
          "Invalid workspace URL. URL must be in the format workspace-url-format.",
        variant: "destructive",
      });
      return;
    }

    const workspaceData: { name: string; url: string } = {
      name: inputValue,
      url: finalWorkspaceUrl,
    };

    const createWorkspace = await dispatch(
      addWorkspace(workspaceData)
    );

    if (isRejected(createWorkspace)) {
      toast({
        title: "Workspace Url already exists.",
        variant: "destructive",
      });
    } else {
      dispatch(getUser());
      setInputValue("");
      setUrlInputValue("");
      toast({ title: "Workspace created successfully!" });
      !onboarding || !handleNextPage
        ? router.push(`/workspace/${finalWorkspaceUrl}`)
        : handleNextPage();
    }
  };

  useEffect(() => {
    const formattedUrlInput = inputValue
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/'/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    setUrlInputValue(formattedUrlInput);
  }, [inputValue]);

  useEffect(() => {
    if (!taskDataLoadingState) {
      user && dispatch(getAllWorkspaces());
    }
  }, []);

  return (
    <div className="h-screen w-full bg-card relative flex flex-col items-center justify-center">
      {!onboarding && workspaceList.length > 0 && (
        <div className="w-screen absolute top-0 p-10 flex justify-between">
          <div className="flex flex-col text-sm">
            <span className="text-xs text-muted-foreground">
              Logged in as:
            </span>
            <span className="text-foreground">{user.email}</span>
          </div>
          <div className="flex items-center space-x-1 text-foreground">
            <ChevronLeft className="text-[#858699] size-5" />
            <a href={`/workspace/${workspaceList[0].url}`}>
              Back to Squared
            </a>
          </div>
        </div>
      )}
      <div className="p-8 flex flex-col space-y-6">
        <div className="text-center">
          <span className="text-2xl text-foreground font-medium">
            Create a new workspace
          </span>
        </div>
        <div className="text-center">
          <span className="text-muted-foreground text-md">
            Workspaces are shared environments where teams can work on
            projects, cycles and tasks.
          </span>
        </div>
        <form
          className="flex flex-col space-y-6 text-foreground items-center"
          onSubmit={handleSubmit}
        >
          <div className="w-full shadow-[0_3px_15px_5px_rgb(0,0,0,0.1)] p-7 rounded-xl flex flex-col space-y-7 bg-accent">
            <div className="flex flex-col space-y-1 text-foreground relative">
              <label className="text-sm">Workspace Name</label>
              <input
                type="text"
                id="workSpace"
                autoComplete="off"
                className="h-12 rounded-md border border-border text-sm bg-card indent-2 focus:outline-none focus:ring-1 relative"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1 text-foreground relative">
              <label className="text-sm">Workspace URL</label>
              <div className="flex flex-col space-y-1 text-foreground relative">
                <span className="absolute z-10 bottom-3 left-2 text-muted-foreground xs:hidden">
                  app.squaredmade.com/
                </span>
                <input
                  className="h-12 rounded-md border border-border text-sm pl-[192px] bg-card xs:pl-0 xs:indent-2 focus:outline-none focus:ring-1 relative"
                  id="workSpaceUrl"
                  autoComplete="off"
                  value={urlInputValue}
                  onChange={(e) => setUrlInputValue(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Button type="submit">Create workspace</Button>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkspace;
