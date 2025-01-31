"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTeams } from "@/hooks/useTeams";
import { filterService } from "@/lib/services";
import { useFilterStore } from "@/store";
import type { SavedFilter } from "@/store/filters";
import { TODO } from "@squared/context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ViewsPage() {
	const router = useRouter();
	const { savedFilters, setSavedFilters } = useFilterStore((state) => state);
	const { team, loading: teamLoading } = useTeams();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchSavedFilters = async () => {
			if (teamLoading) return;
			team &&
				setSavedFilters(
					await filterService.getFilters(TODO, { teamId: team.id }),
				);
			setIsLoading(false);
		};
		fetchSavedFilters();
	}, [team, teamLoading]);

	const handleFilterSelect = (filter: SavedFilter) => {
		const filterName = filter.name.toLowerCase().replace(/\s+/g, "-");
		const filterId = filter.id.split("-")[0];
		router.push(`views/${filterName}-${filterId}`);
	};

	if (isLoading || teamLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				Loading...
			</div>
		);
	}

	if (!isLoading && !team) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p>
					You are not part of any team. Please join a team to access this page.
				</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="font-bold text-2xl">Saved Views</h1>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{savedFilters.map((filter) => (
					<Card
						key={filter.id}
						className="cursor-pointer transition-shadow hover:bg-primary/10 hover:shadow-lg"
						onClick={() => handleFilterSelect(filter)}
					>
						<CardHeader>
							<CardTitle>{filter.name}</CardTitle>
							<CardDescription>
								{filter.description || "No description provided"}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground text-sm">
								{filter.filter.length} filter
								{filter.filter.length !== 1 ? "s" : ""} applied
							</p>
						</CardContent>
					</Card>
				))}
			</div>
			{savedFilters.length === 0 && (
				<p className="mt-8 text-center text-muted-foreground">
					No saved views found. Create a new view from the task dashboard to get
					started.
				</p>
			)}
		</div>
	);
}
