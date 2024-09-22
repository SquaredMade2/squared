"use client";
import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { Toaster } from "@/components/ui/toaster";
import WorkspaceInviteModal from "@/components/WorkspaceInviteModal";
import { SquaredStoreProvider } from "@/store";
import { SessionProvider } from "next-auth/react";
import SearchCommand from "@/components/SearchCommand";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="text-sm min-h-[100vh]">
				<SessionProvider>
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
				</SessionProvider>
			</body>
		</html>
	);
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
