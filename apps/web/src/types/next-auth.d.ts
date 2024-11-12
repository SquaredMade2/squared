// biome-ignore lint/correctness/noUnusedImports: <explanation>
import NextAuth from "next-auth";

declare module "next-auth" {
	interface User {
		id: string;
		email: string;
		name?: string;
		avatarUrl: string | null;
	}
	interface Session {
		user: User;
		accessToken?: string;
	}
}
