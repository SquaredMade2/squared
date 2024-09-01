"use client";
import "./globals.css";
import { Providers } from "@/store/provider";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import CommandPalette from "@/components/CommandPalette";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="text-sm min-h-[100vh]">
				<Providers>
					<CommandPalette />
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<div className="h-full flex flex-row overflow-hidden">
							{children}
						</div>
					</ThemeProvider>
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
