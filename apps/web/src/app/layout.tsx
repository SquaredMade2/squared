"use client";
import "./globals.css";
import { Providers } from "@/store/provider";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import CurrentNavbar from "@/components/CurrentNavbar";
import { Toaster } from "@/components/ui/toaster";
import { SquaredStoreProvider } from "@/storeZ/provider";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<SquaredStoreProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							<div className="h-full flex flex-row overflow-hidden">
								<CurrentNavbar />
								{children}
							</div>
						</ThemeProvider>
						<Toaster />
					</SquaredStoreProvider>
				</Providers>
			</body>
		</html>
	);
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
