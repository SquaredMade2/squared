"use client";

import {
	InviteModal,
	NewTaskModal,
	TaskSelector,
	WorkspaceInviteModal,
	WorkspaceSwitcher,
} from "@/components/Modals";
import SearchCommand from "@/components/SearchCommand";
import { SquaredStoreProvider } from "@/store";
import { Toaster, toast } from "@squaredmade/ui/toast";
import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { HTTPException } from "hono/http-exception";
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
						toast.error(errorMessage);
					},
				}),
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<SquaredStoreProvider>
				<WorkspaceInviteModal />
				<SearchCommand />
				<WorkspaceSwitcher />
				<TaskSelector />
				<InviteModal />
				<NewTaskModal />
				{children}
				<Toaster />
			</SquaredStoreProvider>
		</QueryClientProvider>
	);
}
