'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import { getSingleTaskIdentifier } from '@/store/task/thunks';
import { formatUrl } from '@/utils/formatting';
const styles = {
  main: 'h-screen bg-background',
};

const IssueIdentification: React.FunctionComponent = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();

  const { access, currentWorkspace } = useAppSelector((state) => state.taskData);
  const task = useAppSelector((state) => state.singleTask.data);
  const { user } = useAppSelector((state) => state.userSettings);
  const workspaceUrl = params.workspace;
  const userHasAccess = access && access.id === user?._id && workspaceUrl === currentWorkspace.url;

  useEffect(() => {
    if (!userHasAccess) {
      router.push(`/workspace/${workspaceUrl}`);
    }
    const fetch = async () => {
      const data = await dispatch(
        getSingleTaskIdentifier({
          identifier: params.identifier as string,
          workspace: params.workspace as string,
        }),
      );
      if (data) {
        const titleSlug = formatUrl(data.payload.title);
        const urlRedirect = `/workspace/${workspaceUrl}/issue/${params.identifier}/${titleSlug}`;
        router.push(urlRedirect);
      } else {
        router.push(`/workspace/${workspaceUrl}`);
      }
    };
    fetch();
  }, [workspaceUrl, task]);

  return <div className={styles.main} />;
};

export default IssueIdentification;
