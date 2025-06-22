import "@squaredmade/ui/styles";
import "../globals.css";
import "@squaredmade/fonts";
import type { Metadata } from "next";
import ClientLayoutWrapper from "./app-layout-wrapper";

export const metadata: Metadata = {
	description:
		"Squared is a platform to help organize software development projects. Create new tasks, plan product goals, and setup milestones using Squared",
	title: {
		default: "Squared",
		template: "%s | Squared",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <ClientLayoutWrapper>{children}</ClientLayoutWrapper>;
}
