"use client";
import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { Toaster } from "@/components/ui/toaster";
import WorkspaceInviteModal from "@/components/WorkspaceInviteModal";
import { SquaredStoreProvider } from "@/store";
import SearchCommand from "@/components/SearchCommand";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	// Memoize metadata to prevent unnecessary recalculations
	const metadata = useMemo(() => {
		if (pathname.startsWith("/password/")) {
			return {
				title: "Password Reset",
				description:
					"Reset your Squared account password using the token to regain access to your tasks and projects.",
			};
		}

		switch (pathname) {
			case "/login":
				return {
					title: "Login",
					description:
						"Securely log in to your Squared account to manage your tasks and collaborate with your team.",
				};
			case "/inbox":
				return {
					title: "Inbox",
					description:
						"View all your messages and notifications in one place with the Squared inbox.",
				};
			case "/join":
				return {
					title: "Join",
					description:
						"Join Squared today and start organizing, managing, and collaborating on your tasks.",
				};
			case "/register":
				return {
					title: "Register",
					description:
						"Create your Squared account to gain access to powerful task management features.",
				};
			case "/confirmation":
				return {
					title: "Email Confirmation",
					description:
						"Confirm your email to activate your Squared account and start using our platform.",
				};
			case "/password/reset":
				return {
					title: "Password Reset",
					description:
						"Reset your Squared account password to regain access to your tasks and projects.",
				};
			default:
				return {
					title: "Squared",
					description:
						"Squared is your go-to platform for managing tasks, projects, and teams seamlessly.",
				};
		}
	}, [pathname]);

	return (
		<html lang="en">
			<title>{metadata.title}</title>
			<meta name="description" content={metadata.description} />
			<body className="text-sm min-h-[100vh]">
				<SquaredStoreProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<WorkspaceInviteModal />
						<SearchCommand />
						<div className="h-full flex flex-row overflow-hidden">
							{children}
						</div>
					</ThemeProvider>
					<Toaster />
				</SquaredStoreProvider>
			</body>
		</html>
	);
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
