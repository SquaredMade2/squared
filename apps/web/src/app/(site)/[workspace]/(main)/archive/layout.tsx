import ArchiveNavbar from "@/components/NavBars/ArchiveNavbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Archive",
	description:
		"Access your completed and archived tasks in one place. Review past milestones, reference previous work, and keep a record of your accomplishments.",
};

export default function MyTasksLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="container flex h-screen w-full grow flex-col overflow-hidden">
			<ArchiveNavbar />
			{children}
		</main>
	);
}
