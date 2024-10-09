"use client";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { SessionProvider } from "next-auth/react";
import { SquaredStoreProvider } from "@/store";
import {
	WorkspaceInviteModal,
	WorkspaceSwitcher,
	TaskSelector,
} from "@/components/Modals";
import { Toaster } from "@/components/ui/toaster";
import SearchCommand from "@/components/SearchCommand";
import MobileMenuSheet from "@/components/MobileNav";

// export const metadata: Metadata = {
// 	title: {
// 		default: "Squared",
// 		template: "%s | Squared",
// 	},
// 	description: "description",

// };

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
							<MobileMenuSheet />
							<SearchCommand />
							<WorkspaceSwitcher />
							<TaskSelector />
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
