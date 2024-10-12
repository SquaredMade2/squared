import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Allow all requests to /_next/, /api/, and public files like favicon.ico, etc.
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname === "/favicon.ico"
	) {
		return NextResponse.next();
	}

	// Check if the user is logged in using next-auth
	const token = await getToken({ req: request });
	const userLoggedIn = Boolean(token);

	// Redirect logged-in users trying to access login or register to the homepage
	if (userLoggedIn && isAuthRoute(pathname)) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// Redirect non-logged-in users to login for protected routes
	if (!userLoggedIn && !isPublicRoute(pathname)) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Allow the request to proceed
	return NextResponse.next();
}

// Check if the current route is public (accessible without authentication)
function isPublicRoute(pathname: string) {
	const PUBLIC_ROUTES = ["/login", "/register", "/verify", "/forgotPassword"];
	const workspaceJoinRegex = /^\/[^\/]+\/join\/[^\/]+$/;

	return (
		PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
		workspaceJoinRegex.test(pathname)
	);
}

// Check if the current route is an authentication route (login or register)
function isAuthRoute(pathname: string) {
	const AUTH_ROUTES = ["/login", "/register", "/verify"];
	return AUTH_ROUTES.includes(pathname);
}
