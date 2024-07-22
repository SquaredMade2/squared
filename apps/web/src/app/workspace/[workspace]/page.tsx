'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getWorkspace } from '../../../store/taskData/thunks';
// For some reason causes failed test from jest if absolute import
import WorkspaceNotFoundPage from './WorkspaceNotFoundPage';
import type { RootState } from '@/store';
import { useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import type { Team } from '@/store/taskData/taskData.interfaces';

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();

  const error = useSelector((state: RootState) => state.taskData.error);
  const user = useSelector((state: RootState) => state.userSettings.user);
  const workspaceUrl = params.workspace;

  const styles = {
    defaultPage: 'h-screen w-full bg-card',
    errorPage:
      'w-full h-screen text-3xl flex flex-col items-center justify-center text-foreground bg-background',
    errorH1: 'text-5xl font-semibold',
    header: 'text-gray-400',
    errorContainer: 'w-full h-1/2 flex flex-col items-center justify-around mb-20',
    homeButton:
      'w-1/7 h-20  duration-200 shadow-lg rounded focus:outline-none focus:shadow-sm active:shadow-3xl cursor-pointer hover:shadow-glow text-2xl px-5',
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (!user?.on_boarding) {
      router.push('/onboarding');
    } else {
      const fetchWorkspace = async () => {
        const updatedCurrentTeam = await dispatch(
          getWorkspace({ url: workspaceUrl as string, id: '' }),
        );
        if (updatedCurrentTeam.payload) {
          router.push(
            `/workspace/${workspaceUrl}/team/${
              (updatedCurrentTeam.payload as Team).identifier
            }/all`,
          );
        }
      };
      fetchWorkspace();
    }
  }, [dispatch]);

  // this will probably become its own component leave in until new component is made
  return (
    <>
      {!error && <div className={styles.defaultPage} />}
      {error && <WorkspaceNotFoundPage />}
    </>
  );
}
