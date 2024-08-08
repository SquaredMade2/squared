"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { getWorkspace } from "../../../store/taskData/thunks";
import WorkspaceNotFoundPage from "./WorkspaceNotFoundPage";
import type { RootState } from "@/store";
import { useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import type { Team } from "@/store/taskData/taskData.interfaces";

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();

  const error = useSelector((state: RootState) => state.taskData.error);
  const user = useSelector((state: RootState) => state.userSettings.user);
  const workspaceUrl = params.workspace;

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (!user?.on_boarding) {
      router.push("/onboarding");
    } else {
      const fetchWorkspace = async () => {
        const updatedCurrentTeam = await dispatch(
          getWorkspace({ url: workspaceUrl as string, id: "" })
        );
        if (updatedCurrentTeam.payload) {
          router.push(
            `/workspace/${workspaceUrl}/team/${(updatedCurrentTeam.payload as Team).identifier}/all`
          );
        }
      };
      fetchWorkspace();
    }
  }, [dispatch, router, user, workspaceUrl]);

  return (
    <>
      {!error ? (
        <div className="h-screen w-full bg-card" />
      ) : (
        <WorkspaceNotFoundPage />
      )}
    </>
  );
}
