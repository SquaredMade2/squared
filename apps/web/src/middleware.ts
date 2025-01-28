import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const deploymentUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: process.env.NEXT_PUBLIC_URL;

export default clerkMiddleware(
	async (auth, request) => {
		if (!isPublicRoute(request)) {
			await auth.protect();
		}
	},
	() => ({
		signInUrl: `${deploymentUrl}/sign-in`,
		signUpUrl: `${deploymentUrl}/sign-up`,
	}),
);

// Check if the current route is public (accessible without authentication)
const isPublicRoute = createRouteMatcher([
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/forgot-password(.*)",
	"/api(.*)",
]);

// export default clerkMiddleware();

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
