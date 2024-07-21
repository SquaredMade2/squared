'use client';

import CreateWorkspace from '@/components/CreateWorkspace';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllWorkspaces } from '@/store/taskData/thunks';
import { useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import type { RootState } from '@/store';

const Join = () => {
  const dispatch = useAppDispatch();

  const taskDataLoadingState = useSelector((state: RootState) => state.taskData.isLoading);

  useEffect(() => {
    if (taskDataLoadingState) {
      dispatch(getAllWorkspaces());
    }
  }, []);

  return (
    // testing purpose this is css is not here to stay
    <div className="absolute z-20 bg-card w-screen h-screen flex flex-col items-start">
      <CreateWorkspace onboarding={false} />
    </div>
  );
};

export default Join;
