"use client";
import Navbar from "@/components/NavBar";
import { cn } from "@/utils/cn";
import { useViewStore } from "@/store";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { capitalizeFirstLetter, removeSlug } from "@/utils/formatting";

export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { showNavbar, setShowNavbar } = useViewStore((state) => state);

	// Toggle the visibility of the navigation bar
	const toggleNavbar = (): void => {
		setShowNavbar(!showNavbar);
	};

	const pathname = usePathname();

	// Memoize the metadata calculation to avoid recalculating on every render
	const metadata = useMemo(() => {
		const pathSegments = pathname.split("/");

		const currentPage = pathSegments[2];
		const currentWorkspace = pathSegments[1];
		const currentTask = capitalizeFirstLetter(removeSlug(pathSegments[4]));

		switch (currentPage) {
			case "my-issues":
				return {
					title: `My Issues > ${currentWorkspace}`,
					description: `Track and manage your issues for workspace ${currentWorkspace}.`,
				};
			case "task":
				return {
					title: `Task > ${currentTask}`,
					description: `View and manage task "${currentTask}" in workspace ${currentWorkspace}.`,
				};
			case "team":
				return {
					title: `All Tasks > ${currentWorkspace}`,
					description: `Collaborate and manage all tasks in workspace ${currentWorkspace}.`,
				};
			case "WorkspaceNotFoundPage":
				return {
					title: "Workspace Not Found",
					description:
						"The specified workspace could not be found. Please check the URL.",
				};
			default:
				return {
					title: "Squared",
					description: "Welcome to Squared, a platform for task management.",
				};
		}
	}, [pathname]);

	return (
		<>
			<title>{metadata.title}</title>
			<meta name="description" content={metadata.description} />
			<div className="flex w-full overflow-hidden relative">
				{showNavbar && (
					<div
						className="w-full h-full bg-gray-500 bg-opacity-40 absolute top-0 left-0 z-10 md:hidden"
						onClick={toggleNavbar}
					/>
				)}
				<div
					className={cn(
						"absolute md:static transition-all duration-500 ease-in-out z-10 w-auto h-full",
						showNavbar ? "left-0 top-0" : "-left-[100%]",
					)}
				>
					<Navbar />
				</div>

				<main className="flex flex-grow overflow-hidden">{children}</main>
			</div>
		</>
	);
}
