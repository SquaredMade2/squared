import { AuthService } from "@/gen/rpc/auth";
import { TODO } from "@squared/context";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";
const serverUrl = process.env.NEXT_PUBLIC_SERVER ?? "http://localhost:5173";

const authService = new AuthService(serverUrl);

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
						// Return the user object and the token separately
						return {
							id: response.user.id,
							email: response.user.email,
							name: response.user.name,
							avatarUrl: response.user.avatarUrl,
							accessToken: response.token, // This will be handled in the jwt callback
						};
					}
					throw new Error("Invalid login credentials");
				} catch (error) {
					console.error("Error logging in: ", error);
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
				const response = await authService.googleLogin(TODO, {
					email: user.email,
					name: user.name,
					oauthId: user.id,
					avatarUrl: user.image,
				});
				if (response) {
					const { user: dbUser, token } = response;
					// Update the user object, but don't add the token here
					user.id = dbUser.id;
					user.name = dbUser.name;
					user.email = dbUser.email;
					user.avatarUrl = dbUser.avatarUrl ?? null;
					// The token will be handled in the jwt callback
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					(user as any).accessToken = token;
					return true;
				}
				return false;
			}
			return true;
		},
		async jwt({ token, user, account }) {
			if (user) {
				token.id = user.id;
				token.name = user.name;
				token.email = user.email;
				token.picture = user.avatarUrl;
			}
			if (account) {
				token.id = account.providerAccountId;
			}
			// Store the access token at the token level
			if (user && "accessToken" in user) {
				token.accessToken = user.accessToken;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.name = token.name as string;
				session.user.email = token.email as string;
				session.user.avatarUrl = token.picture as string | null;
			}
			// Add the access token to the session, not the user
			session.accessToken = token.accessToken as string;
			return session;
		},
	},
});

export { handler as GET, handler as POST };
