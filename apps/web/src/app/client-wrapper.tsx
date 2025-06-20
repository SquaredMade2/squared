"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster, toast } from "@squaredmade/ui/toast";
import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { HTTPException } from "hono/http-exception";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
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
						toast.error(errorMessage);
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
				<NextThemesProvider
					attribute="class"
					defaultTheme="system"
					enableSystem={true}
					disableTransitionOnChange={true}
				>
					{children}
				</NextThemesProvider>
				<Toaster />
			</ClerkProvider>
		</QueryClientProvider>
	);
};
