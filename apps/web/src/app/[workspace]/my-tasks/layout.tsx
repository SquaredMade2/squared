import MyTasksNavbar from "@/components/MyTasksNavbar";

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
