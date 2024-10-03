"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useTeamStore } from "@/store";
import type { Sprint } from "@repo/db";

const formSchema = z.object({
	wentWell: z.string().min(1, "This field cannot be empty"),
	toImprove: z.string().min(1, "This field cannot be empty"),
	actionItems: z.string().min(1, "This field cannot be empty"),
});

export default function SprintRetrospectivePage() {
	const params = useParams();
	const { getSprints, sprints, currentTeam, updateSprint } = useTeamStore(
		(state) => state,
	);
	const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			wentWell: "",
			toImprove: "",
			actionItems: "",
		},
	});

	useEffect(() => {
		const loadSprints = async () => {
			if (currentTeam) {
				await getSprints(currentTeam.id);
				const sprint = sprints.find((s) => s.id === params.sprintId);
				setCurrentSprint(sprint ?? null);
			}
		};
		loadSprints();
	}, [getSprints, params.sprintId, sprints, currentTeam]);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			updateSprint(
				Array.isArray(params.sprintId) ? params.sprintId[0] : params.sprintId,
				{
					wentWell: [values.wentWell],
					toImprove: [values.toImprove],
					actionItems: [values.actionItems],
				},
			);
			toast({
				title: "Retrospective Submitted",
				description:
					"Your sprint retrospective has been recorded successfully.",
			});
		} catch (error) {
			console.error("Error submitting retrospective:", error);
			toast({
				title: "Submission Error",
				description:
					"There was a problem submitting your retrospective. Please try again.",
				variant: "destructive",
			});
		}
	};

	if (!currentSprint) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto py-10">
			<Card className="w-full max-w-3xl mx-auto">
				<CardHeader>
					<CardTitle>Sprint Retrospective</CardTitle>
					<CardDescription>
						Reflect on the sprint: {currentSprint.name} (
						{new Date(currentSprint.startDate).toLocaleDateString()} -{" "}
						{new Date(currentSprint.endDate).toLocaleDateString()})
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="wentWell"
								render={({ field }) => (
									<FormItem>
										<FormLabel>What went well?</FormLabel>
										<FormControl>
											<Textarea
												placeholder="List the successes and positive outcomes from this sprint"
												className="min-h-[100px]"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Highlight achievements, successful practices, and positive
											team dynamics.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Separator />
							<FormField
								control={form.control}
								name="toImprove"
								render={({ field }) => (
									<FormItem>
										<FormLabel>What could be improved?</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Identify areas for improvement and challenges faced"
												className="min-h-[100px]"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Discuss obstacles, inefficiencies, and areas where the
											team struggled.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Separator />
							<FormField
								control={form.control}
								name="actionItems"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Action Items</FormLabel>
										<FormControl>
											<Textarea
												placeholder="List specific actions to address improvements"
												className="min-h-[100px]"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Define concrete steps to implement in the next sprint.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								Submit Retrospective
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
