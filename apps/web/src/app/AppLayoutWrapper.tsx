"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import {
	TaskSelector,
	WorkspaceInviteModal,
	WorkspaceSwitcher,
} from "@/components/Modals";
import SearchCommand from "@/components/SearchCommand";
import { Toaster } from "@/components/ui/toaster";
import { SquaredStoreProvider } from "@/store";
import { ClerkProvider } from "@clerk/nextjs";
import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { HTTPException } from "hono/http-exception";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState } from "react";

export default function ClientLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				queryCache: new QueryCache({
					onError: (err) => {
						let errorMessage: string;
						if (err instanceof HTTPException) {
							errorMessage = err.message;
						} else if (err instanceof Error) {
							errorMessage = err.message;
						} else {
							errorMessage = "An unknown error occurred.";
						}
						// toast notify user, log as an example
						console.log(errorMessage);
					},
				}),
			}),
	);
	return (
		<QueryClientProvider client={queryClient}>
			<ClerkProvider>
				<ErrorBoundary>
					<SquaredStoreProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							<WorkspaceInviteModal />
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
			</ClerkProvider>
		</QueryClientProvider>
	);
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
