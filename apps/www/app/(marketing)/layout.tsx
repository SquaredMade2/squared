import type { Metadata } from "next";
import "../globals.css";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/navbar";

export const metadata: Metadata = {
	title: "Squared",
	description:
		"Squared is a platform to help organize software development projects. Create new tasks, plan product goals, and setup milestones using Squared",
	openGraph: {
		images: ["https://ai-saas-template-aceternity.vercel.app/banner.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main>
			<NavBar />
			{children}
			<Footer />
		</main>
	);
}
