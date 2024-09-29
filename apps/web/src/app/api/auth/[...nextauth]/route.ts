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
			authorization: {
				params: {
					redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
				},
			},
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
				try {
					const { data: response }: { data: ApiReturnType<User> } =
						await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/api/auth/`, {
							provider: "credentials",
							type: "login",
							email: credentials?.email,
							password: credentials?.password,
						});
					const { data: user, message } = response;

					if (user) {
						return user;
					}
					// If user is not found or password is incorrect
					throw new Error(message || "Invalid login credentials");
				} catch (error) {
					// Customize the error message based on the response
					throw new Error(
						error instanceof Error ? error.message : "Login failed",
					);
				}
			},
		}),
	],
	callbacks: {
		async signIn({ user, account }) {
			console.log("signIn callback triggered");
			console.log("User:", user);
			console.log("Account:", account);

			if (account?.provider === "google" && user) {
				console.log(
					"Google provider detected, sending OAuth details to backend",
				);

				const { data: response }: { data: ApiReturnType<User> } =
					await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/api/auth/`, {
						provider: "google",
						type: "login",
						name: user.name ?? undefined,
						email: user.email,
						oauthId: user.id,
						avatarUrl: user.image ?? null,
					});

				console.log("Backend response:", response);

				const { data: dbUser } = response;
				if (dbUser) {
					console.log("User found in database:", dbUser);

					// Save the returned user data to the session
					user.id = dbUser.id;
					user.name = dbUser.name;
					user.email = dbUser.email;
					user.avatarUrl = dbUser.avatarUrl ?? null;

					console.log("User data saved to session:", user);
					return true;
				}
				console.log("User not found in database");
				return false;
			}

			console.log("Default sign-in allowed");
			return true; // Default allow sign-in
		},
		async session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub;
				session.user.name = token.name ?? "";
				session.user.email = token.email ?? "";
				session.user.avatarUrl = token.picture ?? "";
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
