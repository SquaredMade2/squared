import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Custom type guard to check if a variable is defined
function isDefined<T>(value: T | undefined | null): value is T {
	return value !== undefined && value !== null;
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!isDefined(GOOGLE_CLIENT_ID) || !isDefined(GOOGLE_CLIENT_SECRET)) {
	throw new Error(
		"Missing environment variables for Google OAuth. Please check your .env file.",
	);
}

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
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
