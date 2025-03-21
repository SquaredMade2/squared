import MyTasksNavbar from "@/components/MyTasksNavbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "My Tasks",
	description:
		"View and manage your personal task list. Track progress, set priorities, and stay organized with Squared's task management features.",
};

export default function MyTasksLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<main className="container flex h-screen w-full grow flex-col overflow-hidden">
			<MyTasksNavbar />
			{children}
		</main>
	);
}
