"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { SessionProvider } from "next-auth/react";
import { SquaredStoreProvider } from "@/store";
import { Toaster } from "@/components/ui/toaster";
import {
	WorkspaceInviteModal,
	WorkspaceSwitcher,
	TaskSelector,
} from "@/components/Modals";
import SearchCommand from "@/components/SearchCommand";
import MobileMenuSheet from "@/components/MobileNav";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function ClientLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SessionProvider>
			<SquaredStoreProvider>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ErrorBoundary>
						<WorkspaceInviteModal />
						<MobileMenuSheet />
						<SearchCommand />
						<WorkspaceSwitcher />
						<TaskSelector />
						<div className="h-full flex flex-row overflow-hidden">
							{children}
						</div>
					</ErrorBoundary>
				</ThemeProvider>
				<Toaster />
			</SquaredStoreProvider>
		</SessionProvider>
	);
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
