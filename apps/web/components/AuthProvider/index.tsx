'use Client';

import { createContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { setUser } from '@/store/userSettings';
import type { RootState } from '@/store';
import type { AuthProviderProps } from './AuthProvider.interfaces';

export const AuthContext = createContext({});

const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.userSettings.user);

  useEffect(() => {
    const checkProfile = () => {
      axios({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/profile`,
        withCredentials: true,
      })
        .then((response) => {
          const data = response.data;

          if (data === null) {
            router.push('/login');
            return;
          }

          dispatch(setUser(data));
        })
        .catch((error) => {
          console.error('Error fetching profile:', error);
        });
    };

    if (!user) {
      checkProfile();

      const intervalId = setInterval(
        () => {
          checkProfile();
        },
        5 * 60 * 1000,
      ); // 5 minutes

      // Return a cleanup function to clear the interval when the component unmounts or the dependencies change
      return () => clearInterval(intervalId);
    }
  }, [user, dispatch, router]);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
