"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { getSingleTaskIdentifier } from "@/store/task/thunks";
import { formatUrl } from "@/utils/formatting";

const IssueIdentification: React.FunctionComponent = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();

  const { access, currentWorkspace } = useAppSelector(
    (state) => state.taskData
  );
  const task = useAppSelector((state) => state.singleTask.data);
  const { user } = useAppSelector((state) => state.userSettings);
  const workspaceUrl = params.workspace;
  const userHasAccess =
    access && access.id === user?._id && workspaceUrl === currentWorkspace.url;

  useEffect(() => {
    if (!userHasAccess) {
      router.push(`/workspace/${workspaceUrl}`);
    } else {
      const fetch = async () => {
        const data = await dispatch(
          getSingleTaskIdentifier({
            identifier: params.identifier as string,
            workspace: params.workspace as string,
          })
        );
        if (data) {
          const titleSlug = formatUrl(data.payload.title);
          const urlRedirect = `/${workspaceUrl}/issue/${params.identifier}/${titleSlug}`;
          router.push(urlRedirect);
        } else {
          router.push(`/${workspaceUrl}`);
        }
      };
      fetch();
    }
  }, [workspaceUrl, task]);

  return <div className="h-screen bg-background" />;
};

export default IssueIdentification;
