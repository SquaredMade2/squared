import type { Metadata } from "next";
import SettingsLayoutWrapper from "./settingsLayout-wrapper";

export const metadata: Metadata = {
	title: "Settings",
};

export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <SettingsLayoutWrapper>{children}</SettingsLayoutWrapper>;
}
