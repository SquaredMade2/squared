'use client';
import { SessionProvider } from 'next-auth/react';
type NextAuthProviderProps = {
  children: React.ReactNode;
};

export const NextAuthProvider: React.FC<NextAuthProviderProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
