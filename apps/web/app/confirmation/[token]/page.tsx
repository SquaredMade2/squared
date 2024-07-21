'use client';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import type { Data } from '@/app/interfaces/Confirmation.interfaces';

const verifyUser = async (token: string | string[]): Promise<Data> => {
  try {
    const { data } = await axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_SERVER}/auth/confirmation/${token}`,
      withCredentials: true,
      params: {
        token: token,
      },
    });
    return data as Data;
  } catch (error) {
    console.error(error);
    toast.error('Could not find user to verify');
    throw error;
  }
};

export default function VerifyUserToken(): void {
  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    const verifyingUser = async (): Promise<void> => {
      try {
        const data = await verifyUser(params.token);
        const { success, redirect, message } = data;
        if (data && success) {
          router.push(redirect);
          toast.success(message);
        }
      } catch (error) {}
    };
    verifyingUser();
  }, [params.token]);
}
