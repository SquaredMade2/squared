"use client";
import type React from "react";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, CircleUser, Plus, Users } from "lucide-react";
import type { Team } from "@repo/db";
import type { SettingsNavbarProps } from "./SettingsNavBarProps";
import { useWorkspaceStore } from "@/storeZ";
import { useTeamStore } from "@/storeZ";
import { useTheme } from "next-themes";
import BackButton from "../BackButton";

const SettingsNavBar = ({
	setLoading,
	toggleNavbar,
}: SettingsNavbarProps): React.ReactElement => {
	const router = useRouter();
	const { setTheme } = useTheme();
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { setCurrentTeam } = useTeamStore((state) => state);
	const teams = [] as Team[];

	const navigateTo = (targetRoute: string) => {
		router.replace(`/settings/${targetRoute}`);
		toggleNavbar?.();
	};

	const handleTeamClick = (team: Team) => {
		if (setLoading) {
			setLoading(true);
		}

		setCurrentTeam(team);

		navigateTo(`teams/${team.identifier}`);
	};

	return (
		<div className="bg-card min-w-64 min-h-screen h-full flex flex-col">
			<div className="flex flex-col items-center pb-6 text-foreground">
				<div>
					<div className="text-lg flex items-center gap-2 py-6">
						<BackButton hoverbackground="bg-accent" />
						<h1 className="text-foreground cursor-pointer">Settings</h1>
					</div>
					<div className="mb-1 pl-0.5 flex items-center">
						<BriefcaseBusiness className="size-4 text-[#6A6F75]" />
						<p className="text-muted-foreground pl-2">Workspace</p>
					</div>
					<button
						type="button"
						className="flex w-24 ml-6 p-0.5 cursor-pointer"
						onClick={() => navigateTo("workspace")}
					>
						<p>General</p>
					</button>
					<button
						type="button"
						onClick={() => navigateTo("members")}
						className="flex w-24 ml-6 p-0.5 cursor-pointer"
					>
						Members
					</button>
					<button
						type="button"
						onClick={() => navigateTo("integrations")}
						className="flex w-32 ml-6 mb-4 p-0.5 cursor-pointer"
					>
						Integrations
					</button>
					<div className="mb-1 pl-0.5 flex items-center">
						<CircleUser className="size-4 text-[#6A6F75]" />
						<p className="text-muted-foreground pl-2">My Account</p>
					</div>
					<div>
						<button
							type="button"
							className="rounded flex w-24 ml-6  p-0.5"
							onClick={() => navigateTo("profile")}
						>
							<p className="cursor-pointer">Profile</p>
						</button>
					</div>
					<div className="pt-5 pb-1 flex items-center">
						<Users className="size-4 text-[#858699]" />
						<p className="text-muted-foreground pl-2">Teams</p>
					</div>
					{currentWorkspace && (
						<ul>
							{teams?.map((team) => (
								<li
									key={team.id ?? ""}
									onClick={() => handleTeamClick(team)}
									className="rounded flex p-0.5 ml-6 cursor-pointer"
								>
									{team.name}
								</li>
							))}
						</ul>
					)}
					<div
						className="flex items-center justify-center p-1 ml-3 rounded"
						onClick={() => navigateTo("new-team")}
					>
						<span className="mr-2 rounded p-1 cursor-pointer">
							<Plus className="size-5 cursor-pointer" />
						</span>
						<p className="cursor-pointer">Add team</p>
					</div>
					<div className="pt-10 flex w-full justify-center pr-5">
						<button
							type="button"
							onClick={() => setTheme("light")}
							className="mr-2 rounded p-1 cursor-pointer"
						>
							Light
						</button>
						<button
							type="button"
							className="rounded p-1 cursor-pointer"
							onClick={() => setTheme("dark")}
						>
							Dark
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingsNavBar;
