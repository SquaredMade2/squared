import axios from "axios";
import type { RootState } from "@/store";
import { signOut } from "next-auth/react";
import { clearUser } from "@/store/userSettings";
import { setShowNewIssue } from "@/store/showNewIssue";
import { usePathname, useRouter } from "next/navigation";
import type { SearchbarStructure } from "./SearchCommand.interface";
import { deleteAllCurrentFilters } from "@/store/filterPage/actions";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import {
	Box,
	Copy,
	Plus,
	Circle,
	Search,
	LogOut,
	Trash2,
	Layers3,
	Settings,
	ArrowRight,
	MoveDiagonal,
	ChevronRight,
	ClipboardCopy,
	ArrowLeftRight,
} from "lucide-react";
import { useToast } from "../ui/use-toast";

export class commandSchema {
	router = useRouter();
	pathname = usePathname();
	dispatch = useAppDispatch();
	currentWorkspace = useAppSelector(
		(state: RootState) => state.taskData.currentWorkspace,
	);
	currentTeam = useAppSelector(
		(state: RootState) => state.taskData.currentTeam,
	);
	showToast(title: string, variant?: "destructive" | "default" | null) {
		const { toast } = useToast();
		toast({ title, variant });
	}
	constructor() {
		this.currentSchema = {
			Issue: {
				createNewIssue: {
					icon: <Plus className="mr-2 h-4 w-4" />,
					text: "Create new issue...",
					function: () => {
						this.dispatch(setShowNewIssue(true));
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
					icon: <Box />,
					text: "Create new project...",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: ["P", "then", "C"],
				},
				createNewProjectFromTemplate: {
					icon: <Box />,
					text: "Create new project from template...",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: [],
				},
			},
			View: {
				createNewView: {
					icon: <Layers3 />,
					text: "Create new view",
					function: () => {
						this.dispatch(deleteAllCurrentFilters());
						this.router.push(
							`/${this.currentWorkspace.url}/team/${this.currentTeam.identifier}/views/new`,
						);
					},
					shortcut: [],
				},
			},
			Templates: {
				createNewIssueTemplate: {
					icon: <Copy />,
					text: "Create new issue template...",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: [],
				},
				createNewDocumentTemplate: {
					icon: <Copy />,
					text: "Create new document template...",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: [],
				},
				createNewProjectTemplate: {
					icon: <Copy />,
					text: "Create new project template...",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: [],
				},
			},
			Navigation: {
				openIssue: {
					icon: <Circle />,
					text: "Open issue...",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: ["O", "then", "I"],
				},
				openLastViewedIssue: {
					icon: <ChevronRight />,
					text: "Open last viewed issue",
					function: () => {
						/* This is for the future functionality */
					},
					shortcut: [],
				},
			},
			separator1: "separator",
			"Go to inbox": {
				icon: <ArrowRight />,
				text: "Go to inbox",
				function: () => {
					this.router.push("/inbox");
				},
				shortcut: ["G", "then", "I"],
			},
			"Go to my issues": {
				icon: <ArrowRight />,
				text: "Go to my issues",
				shortcut: ["G", "then", "M"],
				function: () => {
					this.router.push(`/${this.currentWorkspace.url}/my-issues/assigned`);
				},
			},
			"Go to active issues": {
				icon: <ArrowRight />,
				text: "Go to active issues",
				function: () => {
					this.router.push(
						`/${this.currentWorkspace.url}/team/${this.currentTeam.identifier}/active`,
					);
				},
				shortcut: ["G", "then", "A"],
			},
			"Go to backlog": {
				icon: <ArrowRight />,
				text: "Go to backlog",
				function: () => {
					this.router.push(
						`/${this.currentWorkspace.url}/team/${this.currentTeam.identifier}/backlog`,
					);
				},
				shortcut: ["G", "then", "B"],
			},
			"Go to all issues": {
				icon: <ArrowRight />,
				text: "Go to all issues",
				function: () => {
					this.router.push(
						`/${this.currentWorkspace.url}/team/${this.currentTeam.identifier}/all`,
					);
				},
				shortcut: ["G", "then", "E"],
			},
			"Go to projects": {
				icon: <ArrowRight />,
				text: "Go to projects",
				function: () => {
					/* This is for the future functionality */
				},
				shortcut: ["G", "then", "P"],
			},
			"Go to views": {
				icon: <ArrowRight />,
				text: "Go to views",
				function: () => {
					this.dispatch(deleteAllCurrentFilters());
					this.router.push(
						`/${this.currentWorkspace.url}/team/${this.currentTeam.identifier}/views`,
					);
				},
				shortcut: ["G", "then", "U"],
			},
			separator2: "separator",
			"Go to archive": {
				icon: <ArrowRight />,
				text: "Go to archive",
				function: () => {
					/* This is for the future functionality */
				},
				shortcut: ["G", "then", "X"],
			},
			"Go to recently deleted issues": {
				icon: <Trash2 />,
				text: "Go to recently deleted issues",
				function: () => {
					/* this is for the future functionality */
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
				icon: <Trash2 />,
				text: "Go to recently deleted documents",
				function: () => {
					/* this is for the future functionality */
				},
				shortcut: [],
			},
			"Open recently deleted teams": {
				icon: <Trash2 />,
				text: "Open recently deleted teams",
				function: () => {
					/* this is for the future functionality */
				},
				shortcut: [],
			},
			separator3: "separator",
			"Copy current page URL": {
				icon: <ClipboardCopy />,
				text: "Copy current page URL",
				function: async () => {
					const url = `${process.env.NEXT_PUBLIC_URL}${this.pathname}`;
					await window.navigator.clipboard.writeText(url);
					this.showToast("URL copied to clipboard");
				},
				shortcut: ["Ctrl", "Shift", "C"],
			},
			"Go to advanced search": {
				icon: <MoveDiagonal />,
				text: "Go to advanced search",
				function: () => {
					/* this is for the future functionality */
				},
				shortcut: ["/"],
			},
			separator4: "separator",
			Teams: {
				createNewTeam: {
					icon: <ArrowRight />,
					text: "Create new team...",
					function: () => {
						this.router.push("/settings/new-team");
					},
					shortcut: [],
				},
			},
			Settings: {
				workspaceSettings: {
					icon: <Settings />,
					text: "Workspace Settings",
					function: () => {
						this.router.push("/settings/workspace");
					},
					shortcut: [],
				},
				accountSettings: {
					icon: <Settings />,
					text: "Account Settings",
					function: () => {
						this.router.push("/settings/profile");
					},
					shortcut: [],
				},
				teamSettings: {
					icon: <Settings />,
					text: "Team Settings",
					function: () => {
						this.router.push(`/settings/teams/${this.currentTeam.identifier}`);
					},
					shortcut: [],
				},
				githubSettings: {
					icon: <Settings />,
					text: "Github Settings",
					function: () => {
						this.router.push("/settings/github-settings");
					},
					shortcut: [],
				},
			},
			Account: {
				logOut: {
					icon: <LogOut />,
					text: "Log out",
					function: async () => {
						await signOut({ redirect: false }).then(() => {
							this.router.push("/login");
						});
						try {
							const response = await axios({
								method: "POST",
								url: `${process.env.NEXT_PUBLIC_SERVER}/auth/logout`,
								withCredentials: true,
							});
							this.dispatch(clearUser());
							this.router.push(`${process.env.NEXT_PUBLIC_URL}`);
							this.showToast("Logged out successfully");
						} catch (error) {}
					},
					shortcut: ["Alt", "Shift", "Q"],
				},
				switchWorkspace: {
					icon: <ArrowLeftRight />,
					text: "Switch workspace...",
					function: () => {
						/* this is for the future functionality */
					},
					shortcut: ["O", "then", "W"],
				},
				createOrJoinWorkspace: {
					icon: <ArrowRight />,
					text: "Create or join a workspace",
					function: () => {
						this.router.push("/join");
					},
					shortcut: [],
				},
			},
			Miscellaneous: {
				openNavSidebar: {
					icon: <ArrowRight />,
					text: "Open navigation sidebar",
					function: () => {
						/* this is for the future functionality */
					},
					shortcut: ["Ctrl", "/"],
				},
			},
			Search: {
				searchWorkspace: {
					icon: <Search />,
					text: "Search workspace...",
					function: () => {
						/* this is for the future functionality */
					},
					shortcut: [],
				},
			},
		};
	}
	currentSchema: SearchbarStructure;
	getSchema() {
		return this.currentSchema;
	}
	setSchema(newSchema: SearchbarStructure) {
		this.currentSchema = newSchema;
	}
}
