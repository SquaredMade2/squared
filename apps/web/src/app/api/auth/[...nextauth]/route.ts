import { authService } from "@/lib/services";
import { TODO } from "@squared/context";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

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
				try {
					if (!credentials?.email || !credentials?.password)
						throw new Error("Invalid login credentials");
					const response = await authService.login(TODO, {
						email: credentials?.email,
						password: credentials?.password,
					});

					if (response) {
						return response.user;
					}
					// If user is not found or password is incorrect
					throw new Error("Invalid login credentials");
				} catch (error) {
					console.log("error", error instanceof Error ? error.message : error);
					// Customize the error message based on the response
					throw new Error(
						error instanceof Error ? error.message : "Login failed",
					);
				}
			},
		}),
	],
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider === "google" && user) {
				// Ping the backend with the user's OAuth details
				const response = await authService.googleLogin(TODO, {
					email: user.email,
					name: user.name,
					oauthId: user.id,
					avatarUrl: user.image,
				});
				if (response) {
					const { user: dbUser } = response;
					// Save the returned user data to the session
					user.id = dbUser.id;
					user.name = dbUser.name;
					user.email = dbUser.email;
					user.avatarUrl = dbUser.avatarUrl ?? null;
					return true;
				}
				return false;
			}
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
