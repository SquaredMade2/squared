import { useClerk } from "@clerk/nextjs";
import type { OrganizationResource } from "@clerk/types";
import type { Team } from "@squaredmade/db";
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
} from "@squaredmade/icons";
import { toast } from "@squaredmade/ui/toast";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { useRouter } from "next/navigation";
import { config } from "@/config";
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

	constructor({
		setShowNewTask,
		setShowSwitchWorkspace,
		setShowNavbar,
		setShowTaskSelector,
		clearFilter,
		router,
		pathname,
		organization,
		showNavbar,
		team,
	}: {
		setShowNewTask: (input: boolean) => void;
		setShowSwitchWorkspace: (input: boolean) => void;
		setShowNavbar: (input: boolean) => void;
		setShowTaskSelector: (input: boolean) => void;
		clearFilter: () => void;
		router: AppRouterInstance;
		pathname: string;
		organization?: OrganizationResource | null;
		showNavbar: boolean;
		team: Team | null;
	}) {
		this.router = router;
		this.pathname = pathname;
		this.organization = organization;
		this.showNavbar = showNavbar;
		this.team = team;
		this.setShowNewTask = setShowNewTask;
		this.setShowSwitchWorkspace = setShowSwitchWorkspace;
		this.setShowNavbar = setShowNavbar;
		this.setShowTaskSelector = setShowTaskSelector;
		this.clearFilter = clearFilter;
	}

	getSchema(): SearchbarStructure {
		return {
			account: {
				createOrJoinWorkspace: {
					function: () => {
						this.router.push("/create");
					},
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					shortcut: [],
					text: "Create or join a workspace",
				},
				logOut: {
					function: async () => {
						const { signOut } = useClerk();
						try {
							await signOut();
							toast.success("Logged out successfully");
						} catch {
							toast.error("Failed to log out");
						}
					},
					icon: <LogOut className="mr-2 h-4 w-4" />,
					shortcut: ["Alt", "Shift", "Q"],
					text: "Log out",
				},
				switchWorkspace: {
					function: () => {
						this.setShowSwitchWorkspace(true);
					},
					icon: <ArrowLeftRight className="mr-2 h-4 w-4" />,
					shortcut: ["O", "then", "W"],
					text: "Switch workspace...",
				},
			},
			miscellaneous: {
				openNavSidebar: {
					function: () => {
						this.setShowNavbar(!this.showNavbar);
					},
					icon: <PanelLeft className="mr-2 h-4 w-4" />,
					shortcut: ["Ctrl", "/"],
					text: this.showNavbar
						? "Collapse navigation sidebar"
						: "Open navigation sidebar",
				},
			},
			navigation: {
				openLastViewedTask: {
					function: () => {
						/* This is for the future functionality */
					},
					icon: <ChevronRight className="mr-2 size-4" />,
					shortcut: [],
					text: "Open last viewed task",
				},
				openTask: {
					function: () => {
						this.setShowTaskSelector(true);
					},
					icon: <Circle className="mr-2 size-4" />,
					shortcut: ["O", "then", "I"],
					text: "Open task...",
				},
			},
			project: {
				createNewProject: {
					function: () => {
						/* This is for the future functionality */
					},
					icon: <Box className="mr-2 size-4" />,
					shortcut: ["P", "then", "C"],
					text: "Create new project...",
				},
				createNewProjectFromTemplate: {
					function: () => {
						/* This is for the future functionality */
					},
					icon: <Box className="mr-2 size-4" />,
					shortcut: [],
					text: "Create new project from template...",
				},
			},
			search: {
				searchWorkspace: {
					function: () => {
						/* this is for the future functionality */
					},
					icon: <Search className="mr-2 h-4 w-4" />,
					shortcut: [],
					text: "Search workspace...",
				},
			},
			separator1: "separator",
			separator2: "separator",
			separator3: "separator",
			separator4: "separator",
			settings: {
				accountSettings: {
					function: () => {
						this.router.push(`${this.organization?.slug}/settings/profile`);
					},
					icon: <Settings className="mr-2 h-4 w-4" />,
					shortcut: [],
					text: "Account Settings",
				},
				integrationSettings: {
					function: () => {
						this.router.push(
							`${this.organization?.slug}/settings/integrations`,
						);
					},
					icon: <Settings className="mr-2 h-4 w-4" />,
					shortcut: [],
					text: "Integration Settings",
				},
				teamSettings: {
					function: () => {
						if (this.organization && this.team) {
							this.router.push(
								`${this.organization?.slug}/settings/teams/${this.team.identifier}`,
							);
						} else {
							toast.error("Current workspace or team is null");
						}
					},
					icon: <Settings className="mr-2 h-4 w-4" />,
					shortcut: [],
					text: "Team Settings",
				},
				workspaceSettings: {
					function: () => {
						this.router.push(`${this.organization?.slug}/settings`);
					},
					icon: <Settings className="mr-2 h-4 w-4" />,
					shortcut: [],
					text: "Workspace Settings",
				},
			},
			task: {
				createNewTask: {
					function: () => {
						this.setShowNewTask(true);
					},
					icon: <Plus className="mr-2 h-4 w-4" />,
					shortcut: ["C"],
					text: "Create new task...",
				},
				createNewTaskFromTemplate: {
					function: () => {
						/* this is for the future functionality */
					},
					icon: <Plus className="mr-2 h-4 w-4" />,
					shortcut: ["Alt", "C"],
					text: "Create new task from template...",
				},
			},
			teams: {
				createNewTeam: {
					function: () => {
						this.router.push(`${this.organization?.slug}/settings/new-team`);
					},
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					shortcut: [],
					text: "Create new team...",
				},
			},
			templates: {
				createNewDocumentTemplate: {
					function: () => {
						/* This is for the future functionality */
					},
					icon: <Copy className="mr-2 size-4" />,
					shortcut: [],
					text: "Create new document template...",
				},
				createNewProjectTemplate: {
					function: () => {
						/* This is for the future functionality */
					},
					icon: <Copy className="mr-2 size-4" />,
					shortcut: [],
					text: "Create new project template...",
				},
				createNewTaskTemplate: {
					function: () => {
						/* This is for the future functionality */
					},
					icon: <Copy className="mr-2 size-4" />,
					shortcut: [],
					text: "Create new task template...",
				},
			},
			ungrouped1: {
				"Go to active tasks": {
					function: () => {
						if (this.organization && this.team) {
							this.router.push(
								`/${this.organization?.slug}/team/${this.team.identifier}/active`,
							);
						} else {
							toast.error("Current workspace or team is null");
						}
					},
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					shortcut: ["G", "then", "A"],
					text: "Go to active tasks",
				},
				"Go to all tasks": {
					function: () => {
						if (this.organization && this.team) {
							this.router.push(
								`/${this.organization?.slug}/team/${this.team.identifier}/all`,
							);
						} else {
							toast.error("Current workspace or team is null");
						}
					},
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					shortcut: ["G", "then", "E"],
					text: "Go to all tasks",
				},
				"Go to backlog": {
					function: () => {
						if (this.organization && this.team) {
							this.router.push(
								`/${this.organization?.slug}/team/${this.team.identifier}/backlog`,
							);
						} else {
							toast.error("Current workspace or team is null");
						}
					},
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					shortcut: ["G", "then", "B"],
					text: "Go to backlog",
				},
				"Go to inbox": {
					function: () => {
						this.router.push("/inbox");
					},
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					shortcut: ["G", "then", "I"],
					text: "Go to inbox",
				},
				"Go to my tasks": {
					function: () => {
						if (this.organization && this.team) {
							this.router.push(
								`/${this.organization?.slug}/team/${this.team.identifier}/my-tasks`,
							);
						} else {
							toast.error("Current workspace or team is null");
						}
					},
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					shortcut: ["G", "then", "M"],
					text: "Go to my tasks",
					/* This is for the future functionality */
				},
				"Go to projects": {
					function: () => {
						/* This is for the future functionality */
					},
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					shortcut: ["G", "then", "P"],
					text: "Go to projects",
				},
				"Go to views": {
					function: () => {
						this.clearFilter();
						if (this.organization && this.team) {
							this.router.push(
								`/${this.organization?.slug}/team/${this.team.identifier}/views`,
							);
						} else {
							toast.error("Current workspace or team is null");
						}
					},
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					shortcut: ["G", "then", "U"],
					text: "Go to views",
				},
			},
			ungrouped2: {
				"Go to archive": {
					function: () => {
						if (this.organization && this.team) {
							this.router.push(`/${this.organization?.slug}/archive/tasks`);
						} else {
							toast.error("Current workspace or team is null");
						}
					},
					icon: <ArrowRight className="mr-2 h-4 w-4" />,
					shortcut: ["G", "then", "X"],
					text: "Go to archive",
				},
				"Go to recently deleted documents": {
					function: () => {
						/* this is for the future functionality */
					},
					icon: <Trash2 className="mr-2 h-4 w-4" />,
					shortcut: [],
					text: "Go to recently deleted documents",
				},
				"Go to recently deleted projects": {
					function: () => {
						/* this is for the future functionality */
					},
					icon: <Trash2 className="mr-2 h-4 w-4" />,
					shortcut: [],
					text: "Go to recently deleted projects",
				},
				"Go to recently deleted tasks": {
					function: () => {
						if (this.organization && this.team) {
							this.router.push(
								`/${this.organization?.slug}/archive/recently-deleted-tasks`,
							);
						} else {
							toast.error("Current workspace or team is null");
						}
					},
					icon: <Trash2 className="mr-2 h-4 w-4" />,
					shortcut: [],
					text: "Go to recently deleted tasks",
				},
				"Open recently deleted teams": {
					function: () => {
						/* this is for the future functionality */
					},
					icon: <Trash2 className="mr-2 h-4 w-4" />,
					shortcut: [],
					text: "Open recently deleted teams",
				},
			},
			ungrouped3: {
				"Copy current page URL": {
					function: async () => {
						const url = `${config.NEXT_PUBLIC_URL}${this.pathname}`;
						await window.navigator.clipboard.writeText(url);
						toast.success("URL copied to clipboard");
					},
					icon: <ClipboardCopy className="mr-2 h-4 w-4" />,
					shortcut: ["Ctrl", "Shift", "C"],
					text: "Copy current page URL",
				},
				"Go to advanced search": {
					function: () => {
						/* this is for the future functionality */
					},
					icon: <MoveDiagonal className="mr-2 h-4 w-4" />,
					shortcut: ["/"],
					text: "Go to advanced search",
				},
			},
			view: {
				createNewView: {
					function: () => {
						this.clearFilter();
						if (this.organization && this.team) {
							this.router.push(
								`/${this.organization?.slug}/team/${this.team.identifier}/views/new`,
							);
						} else {
							toast.error("Current workspace or team is null");
						}
					},
					icon: <Layers3 className="mr-2 size-4" />,
					shortcut: [],
					text: "Create new view",
				},
			},
		};
	}
}
