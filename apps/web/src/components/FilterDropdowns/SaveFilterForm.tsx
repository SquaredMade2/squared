"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFilterStore, useTeamStore } from "@/store";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";

const formSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
});

export function SaveFilterForm({ onCancel }: { onCancel: () => void }) {
	const { currentFilters, saveFilter } = useFilterStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);
	const { toast } = useToast();
	const [isSaving, setIsSaving] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsSaving(true);
		if (!currentTeam) {
			toast({
				title: "Error",
				description: "No team found",
				variant: "destructive",
			});
			return;
		}
		try {
			if (currentTeam) {
				await saveFilter({
					name: values.title,
					description: values.description ?? null,
					filter: currentFilters,
					type: "TEAM",
					teamId: currentTeam.id,
				});
				toast({
					title: "Filter Saved Successfully",
				});
			} else {
				toast({
					title: "Team not found",
					variant: "destructive",
				});
			}
		} catch (error) {
			error instanceof Error
				? toast({
						title: "Error",
						description: error.message,
						variant: "destructive",
					})
				: toast({
						title: "Error",
						description: "An unknown error occurred",
						variant: "destructive",
					});
		}

		setIsSaving(false);
		onCancel();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-8">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Filter Name</FormLabel>
							<FormControl>
								<Input placeholder="Enter filter name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description (optional)</FormLabel>
							<FormControl>
								<Textarea placeholder="Enter filter description" {...field} />
							</FormControl>
							<FormDescription>
								Provide a brief description of what this filter does.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex flex-wrap gap-2">
					{currentFilters.map((filter) => (
						<Badge key={filter.field + filter.value} variant="secondary">
							{filter.field}: {filter.value?.toLocaleString()}
						</Badge>
					))}
				</div>
				<div className="flex justify-end space-x-2">
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button type="submit" disabled={isSaving}>
						{isSaving ? "Saving..." : "Save Filter"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
