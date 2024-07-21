import NextAuth from 'next-auth/next';
import type { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import axios from 'axios';
import type { DefaultNextUser } from '@/app/interfaces/Auth.interfaces';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
if (
  !GOOGLE_CLIENT_ID ||
  !GOOGLE_CLIENT_SECRET ||
  !GITHUB_CLIENT_ID ||
  !GITHUB_CLIENT_SECRET ||
  !NEXTAUTH_SECRET
) {
  throw new Error('Missing environment variables for NextAuth configuration');
}
const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
        },
      },
    }),
    GithubProvider({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
        },
      },
    }),
  ],
  secret: NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account && (account.provider === 'google' || account.provider === 'github')) {
        (user as DefaultNextUser).ghToken = account.access_token;
        try {
          const { data } = await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_SERVER}/auth/signInUsingNextAuth`,
            data: { email: user?.email },
            withCredentials: true,
          });
          const userData = data.user;
          if (userData) {
            user.userData = userData;
            return true;
          }
          return false;
        } catch (error) {
          return '/login';
        }
      }
      return false;
    },
    async session({ session, token }) {
      if (token?.userData) {
        session.userData = token.userData;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.userData) {
        token.userData = user.userData;
      }
      return token;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
