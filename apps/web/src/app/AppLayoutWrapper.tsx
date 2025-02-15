"use client";

import {
	NewTaskModal,
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
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export default function ClientLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const [mounted, setMounted] = useState(false);
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

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;
	return (
		<QueryClientProvider client={queryClient}>
			<ClerkProvider>
				<SquaredStoreProvider>
					<NextThemesProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{mounted && (
							<>
								<WorkspaceInviteModal />
								<SearchCommand />
								<WorkspaceSwitcher />
								<TaskSelector />
								<NewTaskModal />
								{children}
							</>
						)}
					</NextThemesProvider>
					<Toaster />
				</SquaredStoreProvider>
			</ClerkProvider>
		</QueryClientProvider>
	);
}
