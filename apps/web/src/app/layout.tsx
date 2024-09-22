import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { Toaster } from "@/components/ui/toaster";
import WorkspaceInviteModal from "@/components/WorkspaceInviteModal";
import { SquaredStoreProvider } from "@/store";
import SearchCommand from "@/components/SearchCommand";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Squared",
	description:
		"Squared is your go-to platform for managing tasks, projects, and teams seamlessly.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
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
