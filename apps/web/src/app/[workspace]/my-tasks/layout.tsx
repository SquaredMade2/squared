import type { Metadata } from "next";
import MyTasksNavbar from "@/components/MyTasksNavbar";

export const metadata: Metadata = {
	title: "My Tasks",
	description:
		"View and manage your personal task list. Track progress, set priorities, and stay organized with Squared's task management features.",
};

export default function MyTasksLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<main className="flex w-full flex-col h-screen flex-grow overflow-hidden container">
			<MyTasksNavbar />
			{children}
		</main>
	);
}
