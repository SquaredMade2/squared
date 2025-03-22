import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const getDeploymentUrl = () => {
	if (process.env.VERCEL_TARGET_ENV === "preview") {
		return `https://${process.env.VERCEL_URL}`;
	}
	return process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
};

const deploymentUrl = getDeploymentUrl();

export default clerkMiddleware(
	async (auth, request) => {
		const url = new URL(request.url);
		const pathSegments = url.pathname.split("/").filter(Boolean);

		if (pathSegments[1] === "undefined" || pathSegments[3] === "undefined") {
			return NextResponse.redirect(new URL("/", request.url));
		}
		if (!isPublicRoute(request)) {
			await auth.protect();
		}
		if (
			isAdminRoute(request) &&
			!(await auth()).has({ role: "org:admin" }) &&
			!(pathSegments.length >= 2)
		) {
			return NextResponse.redirect(new URL(`${request.url}/profile`));
		}
		if (
			isAdminRoute(request) &&
			!(await auth()).has({ role: "org:admin" }) &&
			pathSegments.length >= 2
		) {
			return NextResponse.redirect(
				new URL(request.url.replace(pathSegments[2], "/profile")),
			);
		}
	},
	() => ({
		signInUrl: `${deploymentUrl}/sign-in`,
		signUpUrl: `${deploymentUrl}/sign-up`,
		organizationSyncOptions: {
			organizationPatterns: ["/:slug", "/:slug/(.*)"],
		},
	}),
);

// Check if the current route is public (accessible without authentication)
const isPublicRoute = createRouteMatcher([
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/forgot-password(.*)",
	"/api(.*)",
]);

const isAdminRoute = createRouteMatcher([
	"/:workspace/settings",
	"/:workspace/settings/integrations",
	"/:workspace/settings/labels",
	"/:workspace/settings/members",
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
