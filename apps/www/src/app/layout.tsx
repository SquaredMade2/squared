import type { Metadata } from "next";
import "./globals.css";
import "@squaredmade/fonts";
import { repositoryName } from "@/prismicio";
import { PrismicPreview } from "@prismicio/next";
import { ViewTransitions } from "next-view-transitions";
import { ClientWrapper } from "./client-wrapper";

export const metadata: Metadata = {
	metadataBase: new URL("https://www.squaredmade.com"),
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
				<body className="h-full w-full antialiased">
					<ClientWrapper>{children}</ClientWrapper>
				</body>
				<PrismicPreview repositoryName={repositoryName} />
			</html>
		</ViewTransitions>
	);
}
