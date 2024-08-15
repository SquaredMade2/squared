"use client";
import { useEffect } from "react";
import axios, { type AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { joiningWorkspaceVerification } from "@/store/taskData/thunks";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { useToast } from "@/components/ui/use-toast";

export default function JoiningWorkspaceVerification() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userSettings.user);
  const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
  const router = useRouter();
  const { token } = useParams();
  const { toast } = useToast();

  const handleUserRedirection = (url: string) => {
    if (!user) {
      router.push("/login");
    } else if (!user?.on_boarding) {
      router.push("/onboarding");
    } else {
      router.push(`/${url}`);
    }
  };

  const handleAxiosError = (error: AxiosError) => {
    const serverError = error?.response?.status;
    switch (serverError) {
      case 498:
        if (!user) {
          router.push("/login");
        } else if (!user.on_boarding) {
          router.push("/onboarding");
        } else {
          router.push(`/${workspace?.url}`);
        }
        break;
      default:
        toast({
          title: "An unexpected error occured",
          variant: "destructive",
        });
        break;
    }
  };

  useEffect(() => {
    const verifyingTokenToJoinWorkspace = async () => {
      try {
        const data = await dispatch(joiningWorkspaceVerification(token));

				if (data?.payload.success) {
					toast({ title: data.payload.message });
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
