"use client";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function AcceptWorkspaceInvitation() {
  const router = useRouter();
  const { token } = useParams();
  useEffect(() => {
    const verifyTokenLink = async () => {
      try {
        const { data } = await axios({
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/accept/${token}`,
          withCredentials: true,
        });
        if (data?.success) {
          toast.success(
            `Successfully joined ${data.updatedWorkspace.url} workspace!`
          );
          router.push(`/workspace/${data.updatedWorkspace.url}`);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const serverError = error?.response?.data;
          if (serverError) {
            router.push("/login");
            toast.error(serverError);
          }
        }
      }
    };
    verifyTokenLink();
  }, []);
}

export default AcceptWorkspaceInvitation;
