import { useTeamStore, useViewStore, useWorkspaceStore } from "@/store";
import { useAuthStore } from "@/store";
import type { Workspace } from "@/store/workspaces";
import type { Team } from "@squared/db";
import {
	ArrowLeftRight,
	ArrowRight,
	Box,
	ChevronRight,
	Circle,
	ClipboardCopy,
	Copy,
	Layers3,
	LogOut,
	MoveDiagonal,
	PanelLeft,
	Plus,
	Search,
	Settings,
	Trash2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { SearchbarStructure } from "./interfaces";

export class CommandSchema {
	router: ReturnType<typeof useRouter>;
	pathname: string;
	workspace: Workspace | null;
	currentTeam: Team | null;
	setShowNewIssue: (input: boolean) => void;
	setShowSwitchWorkspace: (input: boolean) => void;
	setShowNavbar: (input: boolean) => void;
	showNavbar: boolean;
	setShowTaskSelector: (input: boolean) => void;
	clearFilter: () => void;
	showToast: (
		title: string,
		variant?: "destructive" | "default" | null,
	) => void;

	constructor({
		setShowNewIssue,
		setShowSwitchWorkspace,
		setShowNavbar,
		setShowTaskSelector,
		clearFilter,
		showToast,
	}: {
		setShowNewIssue: (input: boolean) => void;
		setShowSwitchWorkspace: (input: boolean) => void;
		setShowNavbar: (input: boolean) => void;
		setShowTaskSelector: (input: boolean) => void;
		clearFilter: () => void;
		showToast: (
			title: string,
			variant?: "destructive" | "default" | null,
		) => void;
	}) {
		this.router = useRouter();
		this.pathname = usePathname();
		this.workspace = useWorkspaceStore((state) => state.workspace);
		this.showNavbar = useViewStore((state) => state.showNavbar);
		this.currentTeam = useTeamStore((state) => state.currentTeam);
		this.setShowNewIssue = setShowNewIssue;
		this.setShowSwitchWorkspace = setShowSwitchWorkspace;
		this.setShowNavbar = setShowNavbar;
		this.setShowTaskSelector = setShowTaskSelector;
		this.clearFilter = clearFilter;
		this.showToast = showToast;
	}

	getSchema(): SearchbarStructure {
		return {
			Issue: {
				createNewIssue: {
					icon: <Plus className="mr-2 h-4 w-4" />,
					text: "Create new issue...",
					function: () => {
						this.setShowNewIssue(true);
					},
					shortcut: ["C"],
				},
				createNewIssueFromTemplate: {
					icon: <Plus className="mr-2 h-4 w-4" />,
					text: "Create new issue from template...",
					function: () => {
						/* this is for the future functionality */
					},
					shortcut: ["Alt", "C"],
				},
			},
			Project: {
				createNewProject: {
					icon: <Box className="size-4 mr-2" />,
					text: "Create new project...",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: ["P", "then", "C"],
				},
				createNewProjectFromTemplate: {
					icon: <Box className="size-4 mr-2" />,
					text: "Create new project from template...",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: [],
				},
			},
			View: {
				createNewView: {
					icon: <Layers3 className="size-4 mr-2" />,
					text: "Create new view",
					function: () => {
						this.clearFilter();
						if (this.workspace && this.currentTeam) {
							this.router.push(
								`/${this.workspace.url}/team/${this.currentTeam.identifier}/views/new`,
							);
						} else {
							console.error("Current workspace or team is null");
						}
					},
					shortcut: [],
				},
			},
			Templates: {
				createNewIssueTemplate: {
					icon: <Copy className="size-4 mr-2" />,
					text: "Create new issue template...",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: [],
				},
				createNewDocumentTemplate: {
					icon: <Copy className="size-4 mr-2" />,
					text: "Create new document template...",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: [],
				},
				createNewProjectTemplate: {
					icon: <Copy className="size-4 mr-2" />,
					text: "Create new project template...",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: [],
				},
			},
			Navigation: {
				openTask: {
					icon: <Circle className="size-4 mr-2" />,
					text: "Open task...",
					function: () => {
						this.setShowTaskSelector(true);
					},
					shortcut: ["O", "then", "I"],
				},
				openLastViewedIssue: {
					icon: <ChevronRight className="size-4 mr-2" />,
					text: "Open last viewed issue",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: [],
				},
			},
			separator1: "separator",
			Ungrouped1: {
				"Go to inbox": {
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					text: "Go to inbox",
					function: () => {
						this.router.push("/inbox");
					},
					shortcut: ["G", "then", "I"],
				},
				"Go to my tasks": {
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					text: "Go to my tasks",
					function: () => {},
					shortcut: ["G", "then", "M"],
					/* This is for the future functionality */
				},
				"Go to active tasks": {
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					text: "Go to active tasks",
					function: () => {
						if (this.workspace && this.currentTeam) {
							this.router.push(
								`/${this.workspace.url}/team/${this.currentTeam.identifier}/active`,
							);
						} else {
							console.error("Current workspace or team is null");
						}
					},
					shortcut: ["G", "then", "A"],
				},
				"Go to backlog": {
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					text: "Go to backlog",
					function: () => {
						if (this.workspace && this.currentTeam) {
							this.router.push(
								`/${this.workspace.url}/team/${this.currentTeam.identifier}/backlog`,
							);
						} else {
							console.error("Current workspace or team is null");
						}
					},
					shortcut: ["G", "then", "B"],
				},
				"Go to all tasks": {
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					text: "Go to all tasks",
					function: () => {
						if (this.workspace && this.currentTeam) {
							this.router.push(
								`/${this.workspace.url}/team/${this.currentTeam.identifier}/all`,
							);
						} else {
							console.error("Current workspace or team is null");
						}
					},
					shortcut: ["G", "then", "E"],
				},
				"Go to projects": {
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					text: "Go to projects",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: ["G", "then", "P"],
				},
				"Go to views": {
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					text: "Go to views",
					function: () => {
						this.clearFilter();
						if (this.workspace && this.currentTeam) {
							this.router.push(
								`/${this.workspace.url}/team/${this.currentTeam.identifier}/views`,
							);
						} else {
							console.error("Current workspace or team is null");
						}
					},
					shortcut: ["G", "then", "U"],
				},
			},
			separator2: "separator",
			Ungrouped2: {
				"Go to archive": {
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					text: "Go to archive",
					function: () => {
						if (this.workspace && this.currentTeam) {
							this.router.push(`/${this.workspace.url}/archive/tasks`);
						} else {
							console.error("Current workspace or team is null");
						}
					},
					shortcut: ["G", "then", "X"],
				},
				"Go to recently deleted tasks": {
					icon: <Trash2 className="mr-2 h-4 w-4" />,
					text: "Go to recently deleted tasks",
					function: () => {
						if (this.workspace && this.currentTeam) {
							this.router.push(
								`/${this.workspace.url}/archive/recently-deleted-tasks`,
							);
						} else {
							console.error("Current workspace or team is null");
						}
					},
					shortcut: [],
				},
				"Go to recently deleted projects": {
					icon: <Trash2 className="mr-2 w-4 h-4" />,
					text: "Go to recently deleted projects",
					function: () => {
						/* this is for the future functionality */
					},
					shortcut: [],
				},
				"Go to recently deleted documents": {
					icon: <Trash2 className="mr-2 h-4 w-4" />,
					text: "Go to recently deleted documents",
					function: () => {
						/* this is for the future functionality */
					},
					shortcut: [],
				},
				"Open recently deleted teams": {
					icon: <Trash2 className="mr-2 h-4 w-4" />,
					text: "Open recently deleted teams",
					function: () => {
						/* this is for the future functionality */
					},
					shortcut: [],
				},
			},
			separator3: "separator",
			Ungrouped3: {
				"Copy current page URL": {
					icon: <ClipboardCopy className="mr-2 h-4 w-4" />,
					text: "Copy current page URL",
					function: async () => {
						const url = `${process.env.NEXT_PUBLIC_URL}${this.pathname}`;
						await window.navigator.clipboard.writeText(url);
						this.showToast("URL copied to clipboard");
					},
					shortcut: ["Ctrl", "Shift", "C"],
				},
				"Go to advanced search": {
					icon: <MoveDiagonal className="mr-2 h-4 w-4" />,
					text: "Go to advanced search",
					function: () => {
						/* this is for the future functionality */
					},
					shortcut: ["/"],
				},
			},
			separator4: "separator",
			Teams: {
				createNewTeam: {
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					text: "Create new team...",
					function: () => {
						this.router.push("/settings/new-team");
					},
					shortcut: [],
				},
			},
			Settings: {
				workspaceSettings: {
					icon: <Settings className="mr-2 h-4 w-4" />,
					text: "Workspace Settings",
					function: () => {
						this.router.push("/settings/workspace");
					},
					shortcut: [],
				},
				accountSettings: {
					icon: <Settings className="mr-2 h-4 w-4" />,
					text: "Account Settings",
					function: () => {
						this.router.push("/settings/profile");
					},
					shortcut: [],
				},
				teamSettings: {
					icon: <Settings className="mr-2 h-4 w-4" />,
					text: "Team Settings",
					function: () => {
						if (this.workspace && this.currentTeam) {
							this.router.push(
								`/settings/teams/${this.currentTeam.identifier}`,
							);
						} else {
							console.error("Current workspace or team is null null");
						}
					},
					shortcut: [],
				},
				integrationSettings: {
					icon: <Settings className="mr-2 h-4 w-4" />,
					text: "Integration Settings",
					function: () => {
						this.router.push("/settings/integrations");
					},
					shortcut: [],
				},
			},
			Account: {
				logOut: {
					icon: <LogOut className="mr-2 h-4 w-4" />,
					text: "Log out",
					function: async () => {
						const logout = useAuthStore((state) => state.logout);
						try {
							await logout();
							this.showToast("Logged out successfully", "default");
						} catch {
							this.showToast("Failed to log out", "destructive");
						}
					},
					shortcut: ["Alt", "Shift", "Q"],
				},
				switchWorkspace: {
					icon: <ArrowLeftRight className="mr-2 h-4 w-4" />,
					text: "Switch workspace...",
					function: () => {
						this.setShowSwitchWorkspace(true);
					},
					shortcut: ["O", "then", "W"],
				},
				createOrJoinWorkspace: {
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					text: "Create or join a workspace",
					function: () => {
						this.router.push("/join");
					},
					shortcut: [],
				},
			},
			Miscellaneous: {
				openNavSidebar: {
					icon: <PanelLeft className="mr-2 h-4 w-4" />,
					text: this.showNavbar
						? "Collapse navigation sidebar"
						: "Open navigation sidebar",
					function: () => {
						this.setShowNavbar(!this.showNavbar);
					},
					shortcut: ["Ctrl", "/"],
				},
			},
			Search: {
				searchWorkspace: {
					icon: <Search className="mr-2 h-4 w-4" />,
					text: "Search workspace...",
					function: () => {
						/* this is for the future functionality */
					},
					shortcut: [],
				},
			},
		};
	}
}
