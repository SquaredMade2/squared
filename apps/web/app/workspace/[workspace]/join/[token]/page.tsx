'use client';
import { useEffect } from 'react';
import axios, { type AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import { joiningWorkspaceVerification } from '@/store/taskData/thunks';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';

export default function JoiningWorkspaceVerification() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userSettings.user);
  const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
  const router = useRouter();
  const { token } = useParams();

  const handleUserRedirection = (url: string) => {
    if (!user) {
      router.push('/login');
    } else if (!user?.on_boarding) {
      router.push('/onboarding');
    } else {
      router.push(`/workspace/${url}`);
    }
  };

  const handleAxiosError = (error: AxiosError) => {
    const serverError = error?.response?.status;
    switch (serverError) {
      case 498:
        if (!user) {
          router.push('/login');
        } else if (!user.on_boarding) {
          router.push('/onboarding');
        } else {
          router.push(`/workspace/${workspace?.url}`);
        }
        break;
      default:
        toast.error('An unexpected error occured');
        break;
    }
  };

  useEffect(() => {
    const verifyingTokenToJoinWorkspace = async () => {
      try {
        const data = await dispatch(joiningWorkspaceVerification(token));

        if (data?.payload.success) {
          toast.success(data.payload.message);
          handleUserRedirection(data?.payload.workspace?.url);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          handleAxiosError(error);
        }
      }
    };
    verifyingTokenToJoinWorkspace();
  }, [token, user]);
}
