'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { InputChangeEvent, FormSubmitEvent } from '@/types';
import { SqLogo, backChevron } from '@/components/Svg';

const styles = {
  mainbg: 'w-full flex items-center h-[100vh] bg-[#141414]',
  logoDiv:
    'flex flex-row justify-center items-center uppercase text-[#D8D8D8] gap-2 text-lg font-semibold',
  mainContainer:
    'flex  flex-1 flex-col justify-center space-y-6 px-20 py-16 max-w-fit mx-auto bg-gradient-to-b from-[#17181c] to-[#23293b] align-middle rounded-lg',
  returnWrapper: 'text-white flex items-center space-x-2',
  return: 'text-sm',
  titleWrapper: 'sm:mx-auto sm:w-[80%]',
  title:
    'uppercase text-[#D8D8D8] text-center text-4xl xs:text-2xl font-bold leading-9 tracking-tight',
  subTitleWrapper: 'sm:mx-auto sm:w-[90%]',
  subTitle: 'text-sm text-[#9597ad] text-center',
  form: 'mt-6 space-y-6',
  label: 'text-[#D8D8D8] block text-sm font-medium leading-6 text-[#]',
  inputWrapper: 'mt-2',
  input:
    'bg-[#282E43] text-[#D8D8D8] block w-full rounded-md border-0 pl-3 py-3 shadow-sm  placeholder:text-gray-400 focus:ring-2  sm:text-sm sm:leading-6',
  labelWrapper: 'flex items-center justify-between',
  submitButton:
    'flex w-full justify-center rounded-md bg-[#174EFF] px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
};

export default function ResetPasswordRequest() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleChange = (e: InputChangeEvent) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormSubmitEvent) => {
    e.preventDefault();

    try {
      const { data: responseData } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/auth/password/reset`,
        {
          email,
        },
      );
      toast.success(responseData.message);
      router.push('/login');
    } catch (error) {
      console.error('Failed to request password reset:', error);
      toast.error('There was an issue submitting your request. Please try again later.');
    }
  };

  return (
    <div className={styles.mainbg}>
      <div className={styles.mainContainer}>
        <div className={styles.logoDiv}>
          <SqLogo />
          Squared
        </div>
        <Link href={'/login'} className={styles.returnWrapper}>
          <span>{backChevron()}</span>
          <h2 className={styles.return}>Back to Log in</h2>
        </Link>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Forgot Password</h2>
        </div>
        <div className={styles.subTitleWrapper}>
          <h2 className={styles.subTitle}>Enter your email so we could send you instructions</h2>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <div className={styles.inputWrapper}>
              <input
                placeholder="Enter email.."
                type="email"
                value={email}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>
          <div>
            <button type="submit" className={styles.submitButton}>
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
