import type { Metadata } from "next";
import SettingsLayoutWrapper from "./SettingsLayoutWrapper";

export const metadata: Metadata = {
	title: "Settings",
	description:
		"Adjust your preferences and manage your account settings on Squared. Customize notifications, update your profile, and configure your workspace to suit your project needs.",
};

export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <SettingsLayoutWrapper>{children}</SettingsLayoutWrapper>;
}
