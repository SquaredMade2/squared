"use client";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import type { Data } from "@/app/interfaces/Confirmation.interfaces";

export default function VerifyUserToken(): void {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const verifyUser = async (
    token: string | string[]
  ): Promise<Data | undefined> => {
    try {
      const { data } = await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/confirmation/${token}`,
        withCredentials: true,
        params: {
          token: token,
        },
      });
      return data as Data;
    } catch (error) {}
  };

  useEffect(() => {
    const verifyingUser = async (): Promise<void> => {
      try {
        const data = await verifyUser(params.token);
        if (!data) throw new Error("Could not find user to verify");
        const { success, redirect, message } = data;
        if (data && success) {
          router.push(redirect);
          toast({ title: message });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Could not find user to verify",
          variant: "destructive",
        });
        throw error;
      }
    };
    verifyingUser();
  }, [params.token]);
}
