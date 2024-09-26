"use client";

export default function MyTasksLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="flex w-full overflow-hidden relative">
			<main className="flex flex-grow overflow-hidden">{children}</main>
		</div>
	);
}
