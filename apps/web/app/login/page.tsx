'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import type { InputChangeEvent, FormSubmitEvent } from '@/types';
import { setUser } from '@/store/userSettings';
import { getUser } from '@/store/userSettings/thunks';
import type { FormData } from '@/app/login/login.interfaces';
import type { LocalUser } from '@/app/login/login.interfaces';
import {
  SqLogo,
  // googleLogo, disabled because Oauth does not work
  // githubLogo
} from '@/components/Svg';

import {
  //  signIn,  disabled because Oauth does not work
  useSession,
} from 'next-auth/react';
// import SignInButtons from '@/components/SignInButtons'; This has been disabled because Github and Google Oauth do not work.

const styles = {
  mainbg: 'top-0 w-full flex items-center h-[100vh] bg-[#141414]',
  logoDiv:
    'flex flex-row justify-center items-center uppercase text-[#D8D8D8] gap-2 text-lg font-semibold',
  mainContainer:
    'flex flex-1 flex-col justify-center px-6 py-12 lg:px-14 max-w-fit mx-auto bg-gradient-to-b from-[#17181c] to-[#23293b] align-middle rounded-lg',
  signInTitleWrapper: 'sm:mx-auto sm:w-[90%]',
  signInTitle:
    'uppercase text-[#D8D8D8] mt-8 text-center text-4xl xs:text-2xl font-bold leading-9 tracking-tight',
  formContainer: 'mt-10 sm:mx-auto sm:w-full sm:max-w-sm',
  form: 'space-y-6',
  label: 'text-[#D8D8D8] block text-sm font-medium leading-6 text-[#]',
  passLabel: 'text-[#5d76c9] text-sm hover:text-indigo-500',
  inputWrapper: 'mt-2',
  input:
    'bg-[#282E43] text-[#D8D8D8] block w-full rounded-md border-0 pl-3 py-3 shadow-sm  placeholder:text-gray-400 focus:ring-2  sm:text-sm sm:leading-6',
  labelWrapper: 'flex items-center justify-between',
  signInButton:
    'flex w-full justify-center rounded-md bg-[#174EFF] px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
  member: 'mt-10 text-center text-sm text-gray-500',
  signUp: 'font-semibold leading-6 text-[#5d76c9] hover:text-indigo-500 hover:cursor-pointer',
  googleBtn:
    'flex w-full justify-center rounded-md bg-[#FFFFFF] px-3 py-2 text-sm font-semibold leading-6 text-[#2b5dff] shadow-sm hover:bg-indigo-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4',
  githubBtn:
    'flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4',
};

export default function Login() {
  const [loading, setLoading] = useState<boolean>(true);
  const user = useAppSelector((state) => state.userSettings.user);
  const [data, setData] = useState<FormData>({
    email: '',
    password: '',
  });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleRegisterPush = () => {
    router.push('/register');
  };
  const { data: session, status } = useSession();
  const { on_boarding, workspaces } = session?.userData || {};

  const handlePasswordChange = (e: InputChangeEvent) => {
    setData({ ...data, password: e.target.value });
  };

  const handleEmailChange = (e: InputChangeEvent) => {
    setData({ ...data, email: e.target.value });
  };

  const loginUser = async (e: FormSubmitEvent) => {
    e.preventDefault();
    const { email, password } = data;
    try {
      const { data: responseData } = await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/login`,
        data: { email, password },
        withCredentials: true,
      });
      if (responseData.error) {
        toast.error(responseData.error);
      } else {
        dispatch(setUser(responseData.user));
        toast.success('Login Successful, Welcome!');
        setData({
          email: '',
          password: '',
        });
        if (responseData.redirectTo) {
          // Redirect the user to the specified URL from the server
          router.push(`workspace/${responseData.redirectTo}`);
        } else {
          // otherwise send it to default workspace
          toast.error('No workspace found for redirection.');
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data.error;
        if (serverError) {
          toast.error(serverError);
        } else {
          toast.error('Something went wrong');
        }
      } else {
        console.error(error);
        toast.error('An unexpected error occurred');
      }
    }
  };

  // const handleLogInOptions = (providers: string) => {
  // 	signIn(providers);
  // }; //disabled Because Oauth does not work

  const LogInAuthentications = () => {
    try {
      setLoading(true);
      if (status === 'authenticated') {
        if (session?.userData) {
          dispatch(setUser(session?.userData));
          if (on_boarding && workspaces?.length) {
            router.push(`workspace/${workspaces[0].url}`);
          } else if (on_boarding && !workspaces?.length) {
            router.push('/join');
          } else if (!on_boarding) {
            router.push('/onboarding');
          } else {
            setLoading(false);
          }
        }
        toast.success('Login Successful, Welcome!');
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    LogInAuthentications();
  }, [session, dispatch, status]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (user) {
        const actionResult = await dispatch(getUser());
        const userData = actionResult.payload as LocalUser;
        if (userData?.on_boarding && userData.workspaces.length) {
          router.push(`workspace/${userData.workspaces[0].url}`);
        } else if (userData?.on_boarding && !userData.workspaces.length) {
          router.push('/join');
        } else if (userData && !userData.on_boarding) {
          router.push('/onboarding');
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className={styles.mainbg}>
        {!loading && (
          <div className={styles.mainContainer}>
            <div className={styles.logoDiv}>
              <SqLogo />
              Squared
            </div>
            <div className={styles.signInTitleWrapper}>
              <h2 className={styles.signInTitle}>Sign in to your account</h2>
            </div>

            <div className={styles.formContainer}>
              <form className={styles.form} onSubmit={loginUser}>
                <div>
                  <label htmlFor="email" className={styles.label}>
                    Email address
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      placeholder="Enter email.."
                      type="email"
                      value={data.email}
                      onChange={handleEmailChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div>
                  <div className={styles.labelWrapper}>
                    <label htmlFor="password" className={styles.label}>
                      Password
                    </label>
                    <Link href={'/password/reset'} className={styles.passLabel}>
                      Forgot Password?
                    </Link>
                  </div>
                  <div className={styles.inputWrapper}>
                    <input
                      placeholder="Enter password.."
                      type="password"
                      onChange={handlePasswordChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div>
                  <button type="submit" className={styles.signInButton}>
                    Sign in
                  </button>
                </div>
              </form>
              {/* <SignInButtons
								logo={googleLogo()}
								btnStyle={styles.googleBtn}
								provider="Google"
								handleLogInOptions={handleLogInOptions}
							/>
							<SignInButtons
								logo={githubLogo()}
								btnStyle={styles.githubBtn}
								provider="Github"
								handleLogInOptions={handleLogInOptions}
							/> */}
              {/* These have been disabled because they don't work. */}
              <p className={styles.member}>
                Not a member?{' '}
                <button type="button" onClick={handleRegisterPush} className={styles.signUp}>
                  Sign up for free
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
