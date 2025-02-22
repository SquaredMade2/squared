import { useTeamStore, useViewStore } from "@/store";
import { useClerk, useOrganization } from "@clerk/nextjs";
import type { OrganizationResource } from "@clerk/types";
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
} from "@squared/icons";
import { usePathname, useRouter } from "next/navigation";
import type { SearchbarStructure } from "./interfaces";

export class CommandSchema {
	router: ReturnType<typeof useRouter>;
	pathname: string;
	organization?: OrganizationResource | null;
	team: Team | null;
	setShowNewTask: (input: boolean) => void;
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
		setShowNewTask,
		setShowSwitchWorkspace,
		setShowNavbar,
		setShowTaskSelector,
		clearFilter,
		showToast,
	}: {
		setShowNewTask: (input: boolean) => void;
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
		this.organization = useOrganization().organization;
		this.showNavbar = useViewStore((state) => state.showNavbar);
		this.team = useTeamStore((state) => state.team);
		this.setShowNewTask = setShowNewTask;
		this.setShowSwitchWorkspace = setShowSwitchWorkspace;
		this.setShowNavbar = setShowNavbar;
		this.setShowTaskSelector = setShowTaskSelector;
		this.clearFilter = clearFilter;
		this.showToast = showToast;
	}

	getSchema(): SearchbarStructure {
		return {
			Task: {
				createNewTask: {
					icon: <Plus className="mr-2 h-4 w-4" />,
					text: "Create new task...",
					function: () => {
						this.setShowNewTask(true);
					},
					shortcut: ["C"],
				},
				createNewTaskFromTemplate: {
					icon: <Plus className="mr-2 h-4 w-4" />,
					text: "Create new task from template...",
					function: () => {
						/* this is for the future functionality */
					},
					shortcut: ["Alt", "C"],
				},
			},
			Project: {
				createNewProject: {
					icon: <Box className="mr-2 size-4" />,
					text: "Create new project...",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: ["P", "then", "C"],
				},
				createNewProjectFromTemplate: {
					icon: <Box className="mr-2 size-4" />,
					text: "Create new project from template...",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: [],
				},
			},
			View: {
				createNewView: {
					icon: <Layers3 className="mr-2 size-4" />,
					text: "Create new view",
					function: () => {
						this.clearFilter();
						if (this.organization && this.team) {
							this.router.push(
								`/${this.organization?.slug}/team/${this.team.identifier}/views/new`,
							);
						} else {
							console.error("Current workspace or team is null");
						}
					},
					shortcut: [],
				},
			},
			Templates: {
				createNewTaskTemplate: {
					icon: <Copy className="mr-2 size-4" />,
					text: "Create new task template...",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: [],
				},
				createNewDocumentTemplate: {
					icon: <Copy className="mr-2 size-4" />,
					text: "Create new document template...",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: [],
				},
				createNewProjectTemplate: {
					icon: <Copy className="mr-2 size-4" />,
					text: "Create new project template...",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: [],
				},
			},
			Navigation: {
				openTask: {
					icon: <Circle className="mr-2 size-4" />,
					text: "Open task...",
					function: () => {
						this.setShowTaskSelector(true);
					},
					shortcut: ["O", "then", "I"],
				},
				openLastViewedTask: {
					icon: <ChevronRight className="mr-2 size-4" />,
					text: "Open last viewed task",
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
						if (this.organization && this.team) {
							this.router.push(
								`/${this.organization?.slug}/team/${this.team.identifier}/active`,
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
						if (this.organization && this.team) {
							this.router.push(
								`/${this.organization?.slug}/team/${this.team.identifier}/backlog`,
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
						if (this.organization && this.team) {
							this.router.push(
								`/${this.organization?.slug}/team/${this.team.identifier}/all`,
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
						if (this.organization && this.team) {
							this.router.push(
								`/${this.organization?.slug}/team/${this.team.identifier}/views`,
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
						if (this.organization && this.team) {
							this.router.push(`/${this.organization?.slug}/archive/tasks`);
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
						if (this.organization && this.team) {
							this.router.push(
								`/${this.organization?.slug}/archive/recently-deleted-tasks`,
							);
						} else {
							console.error("Current workspace or team is null");
						}
					},
					shortcut: [],
				},
				"Go to recently deleted projects": {
					icon: <Trash2 className="mr-2 h-4 w-4" />,
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
						this.router.push(`${this.organization?.slug}/settings/new-team`);
					},
					shortcut: [],
				},
			},
			Settings: {
				workspaceSettings: {
					icon: <Settings className="mr-2 h-4 w-4" />,
					text: "Workspace Settings",
					function: () => {
						this.router.push(`${this.organization?.slug}/settings`);
					},
					shortcut: [],
				},
				accountSettings: {
					icon: <Settings className="mr-2 h-4 w-4" />,
					text: "Account Settings",
					function: () => {
						this.router.push(`${this.organization?.slug}/settings/profile`);
					},
					shortcut: [],
				},
				teamSettings: {
					icon: <Settings className="mr-2 h-4 w-4" />,
					text: "Team Settings",
					function: () => {
						if (this.organization && this.team) {
							this.router.push(
								`${this.organization?.slug}/settings/teams/${this.team.identifier}`,
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
						this.router.push(
							`${this.organization?.slug}/settings/integrations`,
						);
					},
					shortcut: [],
				},
			},
			Account: {
				logOut: {
					icon: <LogOut className="mr-2 h-4 w-4" />,
					text: "Log out",
					function: async () => {
						const { signOut } = useClerk();
						try {
							await signOut();
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
						this.router.push("/create");
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
