"use client";
import SettingsTopNavBar from "@/components/Settings/SettingsTopNavBar";
import { GithubIcon } from "@/components/Svg";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { client } from "@/lib/client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, MoreVertical } from "lucide-react";
import Link from "next/link";

const GithubSettings: React.FC = () => {
	const { user } = useUser();
	const { organization } = useOrganization();

	const { data: githubOrganizations } = useQuery({
		queryKey: ["user", user?.externalId],
		queryFn: async () => {
			if (!organization) return [];
			const repos = await client.github.getRepos
				.$get({ workspaceId: organization.id })
				.then((res) => res.json());

			console.log(
				"repos",
				repos.map((r) => typeof r.createdAt),
			);
			return repos;
		},
		enabled: !!organization,
	});

	const githubAccount = user?.externalAccounts.find(
		(account) => account.provider === "github",
	);

	return (
		<div className="relative flex h-screen min-h-screen w-full bg-card xs:p-0 mdsm:flex-col">
			<div className="bg-background mdsm:visible lg:hidden">
				<SettingsTopNavBar />
			</div>
			<div className="flex h-full w-full flex-col items-center bg-background xs:px-4 pt-20 xs:pt-10 sm:items-start sm:px-4 md:items-center">
				<div className="w-full max-w-3xl">
					<div className="mb-8 flex flex-row items-center space-x-6">
						<div className="flex h-16 w-16 flex-row items-center justify-center rounded-lg bg-white">
							<div className="w-[50px]">
								<GithubIcon />
							</div>
						</div>
						<div>
							<h1 className="font-medium text-2xl text-foreground">GitHub</h1>
							<p className="text-muted-foreground text-sm">
								Integrate GitHub with Squared for seamless project management
							</p>
						</div>
					</div>
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>Connected Organizations</CardTitle>
							<CardDescription>
								Manage your connected GitHub organizations and personal account
							</CardDescription>
						</CardHeader>
						<CardContent>
							{githubOrganizations?.map((org) => (
								<div
									key={org.name}
									className="flex items-center justify-between py-2"
								>
									<div>
										<p className="font-medium">{org.name}</p>
										<p className="text-muted-foreground text-sm">
											Added on {org.createdAt.toDateString()}
										</p>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="sm">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onSelect={() => console.log("Configure")}
											>
												Configure
											</DropdownMenuItem>
											<DropdownMenuItem
												onSelect={() => console.log("Disconnect")}
											>
												Disconnect
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							))}
							<Button
								className="mt-4"
								onClick={() => console.log("Add organization")}
							>
								Add Organization
							</Button>
						</CardContent>
					</Card>

					<Card className="mb-6">
						<CardHeader>
							<CardTitle>GitHub Account</CardTitle>
							<CardDescription>
								Manage your connected GitHub account
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<p>
									{githubAccount ? "Github Account Connected" : "Not connected"}
								</p>
								<Button variant="outline" asChild>
									<Link href={`/${organization?.slug}/settings/connections`}>
										Manage Connected Accounts
										<ChevronRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card className="mb-6">
						<CardHeader>
							<CardTitle>GitHub Issues</CardTitle>
							<CardDescription>
								Configure automatic task creation from GitHub issues
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label htmlFor="issue-sync">Enable Issue Sync</Label>
									<Switch id="issue-sync" />
								</div>
								<div>
									<Label htmlFor="repo-select">Select Repository</Label>
									<Select>
										<SelectTrigger id="repo-select">
											<SelectValue placeholder="Select a repository" />
										</SelectTrigger>
										<SelectContent>
											{githubOrganizations?.map((org) => (
												<SelectItem key={org.name} value={org.name}>
													{org.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="team-select">Select Team</Label>
									<Select>
										<SelectTrigger id="team-select">
											<SelectValue placeholder="Select a team" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="team1">Team 1</SelectItem>
											<SelectItem value="team2">Team 2</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="mb-6">
						<CardHeader>
							<CardTitle>Branch Format</CardTitle>
							<CardDescription>
								Set the branch naming convention for Squared tasks
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Label htmlFor="branch-format">Branch Format</Label>
								<Input
									id="branch-format"
									placeholder="e.g., feature/SQ-{taskId}-{taskName}"
								/>
								<p className="text-muted-foreground text-sm">
									Use {"{taskId}"} for the task ID and {"{taskName}"} for the
									task name
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Linkbacks</CardTitle>
							<CardDescription>
								Configure automatic comments on pull requests
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label htmlFor="linkback-enable">Enable Linkbacks</Label>
									<Switch id="linkback-enable" />
								</div>
								<Separator />
								<div className="flex items-center justify-between">
									<Label htmlFor="linkback-public">Public Repositories</Label>
									<Switch id="linkback-public" />
								</div>
								<div className="flex items-center justify-between">
									<Label htmlFor="linkback-private">Private Repositories</Label>
									<Switch id="linkback-private" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default GithubSettings;
