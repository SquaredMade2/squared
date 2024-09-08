import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Allow all requests to /_next/, /api/, and public files like favicon.ico, etc.
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname === "/favicon.ico"
	) {
		return NextResponse.next();
	}

	// Check if the user is logged in (replace with your actual login check logic)
	const authStore = request.cookies.get("auth-store");
	const userLoggedIn = Boolean(authStore);

	// Redirect logged-in users trying to access login or register
	if (userLoggedIn && (pathname === "/login" || pathname === "/register")) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// Redirect non-logged-in users to login for protected routes
	if (!userLoggedIn && !isPublicRoute(pathname)) {
		const token = request.nextUrl.searchParams.get("token");
		const redirectTo = token ? `/login?token=${token}` : "/login";
		return NextResponse.redirect(new URL(redirectTo, request.url));
	}

	return NextResponse.next();
}

function isPublicRoute(pathname: string) {
	const PUBLIC_ROUTES = ["/login", "/register", "/[workspace]/join/[token]"];
	return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}
