import "./globals.css";
import type { Metadata } from "next";
import ClientLayoutWrapper from "./clientLayout-wrapper";

export const metadata: Metadata = {
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
	return (
		<html lang="en">
			<body className="text-sm min-h-[100vh]">
				<ClientLayoutWrapper>{children}</ClientLayoutWrapper>
			</body>
		</html>
	);
}
