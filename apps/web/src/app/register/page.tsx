'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { showPasswordIcon, hidePasswordIcon, SqLogo } from '@/components/Svg';

const styles = {
  mainBg:
    'absolute z-20 bg-[#141414] w-screen flex justify-center items-center h-[100vh] max-h-auto',
  mainContainer:
    'flex flex-1 flex-col justify-center px-6 py-12 lg:px-16 max-w-fit mx-auto bg-gradient-to-b from-[#17181c] to-[#23293b] align-middle rounded-lg',
  registerBgWrapper: 'sm:mx-auto sm:w-full sm:max-w-sm',
  registerTitle:
    'uppercase text-[#D8D8D8] mt-6 text-center text-4xl xs:text-2xl font-bold leading-9 tracking-wide',
  logoDiv: 'flex items-center justify-center gap-2 uppercase text-[#D8D8D8] font-semibold',
  formContainer: 'mt-10 sm:mx-auto sm:w-full sm:max-w-sm',
  form: 'space-y-3',
  input:
    'bg-[#282E43] text-[#D8D8D8] block w-full rounded-md border-0 pl-3 py-4 shadow-sm  placeholder:text-gray-400 focus:ring-2  sm:text-sm sm:leading-6',
  hidePasswordParentRelative: 'relative',
  hidePasswordBtn: 'absolute top-5 right-5 cursor-pointer',
  registerBtn:
    'flex w-full justify-center rounded-md bg-[#174EFF] px-3 py-1.5 text-sm font-semibold leading-6 text-[#D8D8D8] shadow-sm hover:bg-indigo-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
  member: 'mt-10 text-center text-sm  text-gray-500',
  logIn: 'font-semibold leading-6 text-[#5d76c9] hover:text-indigo-500 hover:cursor-pointer',
};

export default function RegisterUser() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [hidePassword, setHidePassword] = useState(false);
  const router = useRouter();

  const handlePushLogin = () => {
    router.push('/login');
  };

  const registerUser = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { name, email, password } = data;
    const username: string = name;
    try {
      const { data }: { data: { error: string; message: string } } = await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/register`,
        data: { name, username, email, password },
      });

      if (data.error) {
        toast.error(data.error, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } else {
        setData({
          name: '',
          email: '',
          password: '',
        });
        toast.success(data.message, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        router.push('/login');
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  const displayPasswordIcon = () => {
    if (hidePassword) {
      return showPasswordIcon();
    }
    return hidePasswordIcon();
  };
  const displayPassword = hidePassword ? 'text' : 'password';
  const passwordIconVisible = displayPasswordIcon();

  return (
    <>
      <div className={styles.mainBg}>
        <div className={styles.mainContainer}>
          <div className={styles.logoDiv}>
            <SqLogo /> squared
          </div>
          <div className={styles.registerBgWrapper}>
            <h2 className={styles.registerTitle}>Register your account</h2>
          </div>

          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={registerUser}>
              <div>
                <div>
                  <input
                    placeholder=" Your name.."
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>
              <div>
                <div className="">
                  <input
                    placeholder=" Email Address.."
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>
              <div>
                <div className={styles.hidePasswordParentRelative}>
                  <input
                    placeholder=" Password.."
                    type={displayPassword}
                    value={data.password}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    autoComplete="new-password"
                    className={styles.input}
                  />
                  <button
                    type="button"
                    onClick={() => setHidePassword((prev) => !prev)}
                    className={styles.hidePasswordBtn}
                  >
                    {passwordIconVisible}
                  </button>
                </div>
              </div>

              <div>
                <button type="submit" className={styles.registerBtn}>
                  Register
                </button>
              </div>
            </form>

            <p className={styles.member}>
              Already a member ?{' '}
              <button type="button" onClick={handlePushLogin} className={styles.logIn}>
                Click here to Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
