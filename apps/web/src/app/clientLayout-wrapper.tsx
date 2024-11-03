"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import MobileMenuSheet from "@/components/MobileNav";
import {
	TaskSelector,
	WorkspaceInviteModal,
	WorkspaceSwitcher,
} from "@/components/Modals";
import SearchCommand from "@/components/SearchCommand";
import { Toaster } from "@/components/ui/toaster";
import { SquaredStoreProvider } from "@/store";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

export default function ClientLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SessionProvider>
			<ErrorBoundary>
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
			</ErrorBoundary>
		</SessionProvider>
	);
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
