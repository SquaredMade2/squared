import "./globals.css";
import "@squared/fonts/src/styles.css";
import type { Metadata } from "next";
import ClientLayoutWrapper from "./clientLayout-wrapper";
import createCustomLogger from "@squared/logger";

const logger = createCustomLogger("layout");
console.log = (...args) => logger.info(...args);
console.info = (...args) => logger.info(...args);
console.warn = (...args) => logger.warn(...args);
console.error = (...args) => logger.error(...args);
console.debug = (...args) => logger.debug(...args);

export const metadata: Metadata = {
	title: {
		default: "Squared",
		template: "%s | Squared",
	},
	description:
		"Squared is a platform to help organize software development projects. Create new tasks, plan product goals, and setup milestones using Squared",
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
