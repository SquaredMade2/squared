"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFilterStore, useTeamStore } from "@/store";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import type { SavedFilter } from "@/store/filters";

export default function ViewsPage() {
	const router = useRouter();
	const { savedFilters, getSavedFilters } = useFilterStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchSavedFilters = async () => {
			currentTeam && (await getSavedFilters(currentTeam.id));
			setIsLoading(false);
		};
		fetchSavedFilters();
	}, [getSavedFilters]);

	const handleFilterSelect = (filter: SavedFilter) => {
		const filterName = filter.name.toLowerCase().replace(/\s+/g, "-");
		const filterId = filter.id.split("-")[0];
		router.push(`views/${filterName}-${filterId}`);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	if (!isLoading && !currentTeam) {
		return (
			<div className="flex justify-center items-center h-screen">
				<p>
					You are not part of any team. Please join a team to access this page.
				</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Saved Views</h1>
				<Button
					onClick={() => console.log("Create new view clicked")}
					variant="outline"
				>
					<PlusCircle className="mr-2 h-4 w-4" /> Create New View
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{savedFilters.map((filter) => (
					<Card
						key={filter.id}
						className="cursor-pointer hover:shadow-lg hover:bg-primary/10 transition-shadow"
						onClick={() => handleFilterSelect(filter)}
					>
						<CardHeader>
							<CardTitle>{filter.name}</CardTitle>
							<CardDescription>
								{filter.description || "No description provided"}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								{filter.filter.length} filter
								{filter.filter.length !== 1 ? "s" : ""} applied
							</p>
						</CardContent>
					</Card>
				))}
			</div>
			{savedFilters.length === 0 && (
				<p className="text-center text-muted-foreground mt-8">
					No saved views found. Create a new view to get started.
				</p>
			)}
		</div>
	);
}
