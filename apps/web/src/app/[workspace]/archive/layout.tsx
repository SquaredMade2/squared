import ArchiveNavbar from "@/components/NavBars/ArchiveNavbar";

export default function MyTasksLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<main className="flex w-full flex-col h-screen flex-grow overflow-hidden container">
			<ArchiveNavbar />
			{children}
		</main>
	);
}
