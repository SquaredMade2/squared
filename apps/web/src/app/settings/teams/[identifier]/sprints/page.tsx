"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { useTeamStore } from "@/store";
import type { Sprint } from "@repo/db";

export default function TeamSettingsSprints() {
	const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { getSprints, createSprint, updateSprint, currentTeam, sprints } =
		useTeamStore((state) => state);

	useEffect(() => {
		fetchSprints();
	}, []);

	if (!currentTeam) return null;

	const fetchSprints = async () => {
		setIsLoading(true);
		try {
			await getSprints(currentTeam.id);
		} catch {
			setError("Failed to fetch sprints");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const sprintData = Object.fromEntries(formData.entries());

		try {
			if (editingSprint) {
				await updateSprint(currentTeam.id, {
					...sprintData,
				});
			} else {
				await createSprint(currentTeam.id, sprintData);
			}
			setEditingSprint(null);
		} catch {
			setError("Failed to save sprint");
		}
	};

	if (isLoading) return <div>Loading sprints...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Team Settings - Sprints</h1>

			<div className="grid gap-4 mb-4">
				{sprints.map((sprint) => (
					<Card key={sprint.id}>
						<CardHeader>
							<CardTitle>{sprint.name}</CardTitle>
							<CardDescription>{sprint.goal}</CardDescription>
						</CardHeader>
						<CardContent>
							<p>Status: {sprint.status}</p>
							<p>Start Date: {format(new Date(sprint.startDate), "PP")}</p>
							<p>End Date: {format(new Date(sprint.endDate), "PP")}</p>
						</CardContent>
						<CardFooter>
							<Button onClick={() => setEditingSprint(sprint)}>Edit</Button>
						</CardFooter>
					</Card>
				))}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>
						{editingSprint ? "Edit Sprint" : "Create New Sprint"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<Label htmlFor="name">Sprint Name</Label>
							<Input
								id="name"
								name="name"
								required
								defaultValue={editingSprint?.name}
							/>
						</div>
						<div>
							<Label htmlFor="goal">Sprint Goal</Label>
							<Textarea
								id="goal"
								name="goal"
								defaultValue={editingSprint?.goal ?? undefined}
							/>
						</div>
						<div>
							<Label htmlFor="startDate">Start Date</Label>
							<div className="flex w-full max-w-sm items-center space-x-2">
								<Input
									type="date"
									id="startDate"
									name="startDate"
									required
									defaultValue={editingSprint?.startDate.toLocaleDateString()}
								/>
								<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
							</div>
						</div>
						<div>
							<Label htmlFor="endDate">End Date</Label>
							<div className="flex w-full max-w-sm items-center space-x-2">
								<Input
									type="date"
									id="endDate"
									name="endDate"
									required
									defaultValue={editingSprint?.endDate.toLocaleDateString()}
								/>
								<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
							</div>
						</div>
						<div>
							<Label htmlFor="status">Status</Label>
							<Select
								name="status"
								defaultValue={editingSprint?.status || "planned"}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="planned">Planned</SelectItem>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button type="submit">
							{editingSprint ? "Update Sprint" : "Create Sprint"}
						</Button>
						{editingSprint && (
							<Button
								type="button"
								variant="outline"
								onClick={() => setEditingSprint(null)}
							>
								Cancel
							</Button>
						)}
					</form>
				</CardContent>
			</Card>

			{!editingSprint && (
				<Button className="mt-4" onClick={() => setEditingSprint(null)}>
					<PlusCircle className="mr-2 h-4 w-4" /> Create New Sprint
				</Button>
			)}
		</div>
	);
}
