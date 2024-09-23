import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { ApiReturnType } from "@/store/interfaces";
import type { User } from "@repo/db";
import axios from "axios";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "Enter your email",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const { data: response }: { data: ApiReturnType<User> } =
					await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/api/auth/`, {
						provider: "credentials",
						type: "login",
						email: credentials?.email,
						password: credentials?.password,
					});
				const { data: user } = response;

				if (user) {
					return user;
				}
				return null;
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
		async jwt({ token, account }) {
			if (account) {
				token.id = account.providerAccountId;
			}
			return token;
		},
	},
});

export { handler as GET, handler as POST };
