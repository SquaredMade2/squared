// app/team/[identifier]/[all]/layout.tsx
"use client";
import { useState, useMemo } from "react";
import SettingsNavBar from "@/components/SettingsNavBar";
import SettingsTopNavBar from "@/components/SettingsTopNavBar";
import { usePathname } from "next/navigation";

export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [showNavbar, setShowNavbar] = useState(false);
	const toggleNavbar = () => {
		setShowNavbar(!showNavbar);
	};
	const pathname = usePathname();
	// Memoize the metadata calculation to avoid recalculating on every render
	const metadata = useMemo(() => {
		const pathSegments = pathname.split("/");
		const currentPage = pathSegments[2];

		switch (currentPage) {
			case "workspace":
				return {
					title: "Workspace",
					description:
						"Manage all your tasks and collaborate in the workspace.",
				};
			case "members":
				return {
					title: "Members",
					description: "View and manage the team members in your workspace.",
				};
			case "integrations":
				return {
					title: "Integrations",
					description: "Set up and manage integrations for your workspace.",
				};
			case "profile":
				return {
					title: "Profile",
					description: "Manage your user profile and preferences.",
				};
			case "teams":
				return {
					title: "Teams",
					description: "Create and manage teams within your workspace.",
				};
			case "new-team":
				return {
					title: "Add Team",
					description: "Create a new team to start collaborating on tasks.",
				};
			default:
				return {
					title: "Squared",
					description:
						"Welcome to Squared, a platform for seamless task management.",
				};
		}
	}, [pathname]);

	return (
		<>
			<title>{metadata.title}</title>
			<meta name="description" content={metadata.description} />
			<div className="h-full w-full relative flex">
				<SettingsTopNavBar />
				<SettingsNavBar toggleNavbar={toggleNavbar} />
				<main className="md:ml-72 w-full mt-12">{children}</main>
			</div>
		</>
	);
}
