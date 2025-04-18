"use client";

import {
	InviteModal,
	NewTaskModal,
	TaskSelector,
	WorkspaceInviteModal,
	WorkspaceSwitcher,
} from "@/components/Modals";
import SearchCommand from "@/components/SearchCommand";
import { Toaster } from "@/components/ui/sonner";
import { ErrorProvider } from "@/context/ErrorContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { queryClient } from "@/lib/queryClient";
import { SquaredStoreProvider } from "@/store";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export default function ClientLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const [mounted, setMounted] = useState(false);

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
								<InviteModal />
								<NewTaskModal />
								<ErrorProvider>
									<LoadingProvider>{children}</LoadingProvider>
								</ErrorProvider>
							</>
						)}
					</NextThemesProvider>
					<Toaster />
				</SquaredStoreProvider>
			</ClerkProvider>
		</QueryClientProvider>
	);
}
