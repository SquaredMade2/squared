import type { Metadata } from "next";
import "./globals.css";
import "@squared/fonts/src/styles.css";
import { ThemeProvider } from "@/context/theme-provider";
import { ViewTransitions } from "next-view-transitions";

export const metadata: Metadata = {
	title: "Squared",
	description:
		"Squared is a platform to help organize software development projects. Create new tasks, plan product goals, and setup milestones using Squared",
	openGraph: {
		images: ["/banner.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ViewTransitions>
			<html lang="en">
				<body className={"h-full w-full antialiased"}>
					<ThemeProvider
						attribute="class"
						enableSystem
						disableTransitionOnChange
						defaultTheme="system"
					>
						{children}
					</ThemeProvider>
				</body>
			</html>
		</ViewTransitions>
	);
}
