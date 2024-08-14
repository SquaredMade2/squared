"use client";
import { useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

function AcceptWorkspaceInvitation() {
  const router = useRouter();
  const { token } = useParams();
  const { toast } = useToast();
  useEffect(() => {
    const verifyTokenLink = async () => {
      try {
        const { data } = await axios({
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/accept/${token}`,
          withCredentials: true,
        });
        if (data?.success) {
          toast({
            title: `Successfully joined ${data.updatedWorkspace.url} workspace!`,
          });
          router.push(`/${data.updatedWorkspace.url}`);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const serverError = error?.response?.data;
          if (serverError) {
            router.push("/login");
            toast({ title: serverError, variant: "destructive" });
          }
        }
      }
    };
    verifyTokenLink();
  }, []);
}

export default AcceptWorkspaceInvitation;
