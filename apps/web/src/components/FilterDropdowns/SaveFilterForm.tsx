"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	useFilterStore,
	useTeamStore,
	useUserStore,
	useWorkspaceStore,
} from "@/store";
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
import { formatPriority, formatStatus } from "@/utils/formatting";
import { format } from "date-fns";
import type { SavedFilter, FilterCondition } from "@/store/filters";
import type { Priority, Status } from "@repo/db";
import { useParams, usePathname } from "next/navigation";

const formSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
});

export function SaveFilterForm({ onCancel }: { onCancel: () => void }) {
	const { currentFilters, saveFilter, savedFilters, updateSavedFilter } =
		useFilterStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);
	const { getAllUsers } = useUserStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { toast } = useToast();
	const [isSaving, setIsSaving] = useState(false);
	const [formattedFilters, setFormattedFilters] = useState<
		{ name: string; value: string }[]
	>([]);
	const [currentFilter, setCurrentFilter] = useState<SavedFilter | null>(null);
	const params = useParams();
	const pathname = usePathname();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	});
	const { control, handleSubmit, reset } = form;

	useEffect(() => {
		if (pathname.includes("/views")) {
			const filterId =
				typeof params.filterId === "string"
					? params.filterId
					: params.filterId[0];
			const filterSlug = filterId?.split("-").pop() || "";
			const foundFilter = savedFilters.find((f) =>
				f.id.startsWith(filterSlug || ""),
			);
			if (foundFilter) setCurrentFilter(foundFilter);
		}
	}, [params.filterId, savedFilters]);

	useEffect(() => {
		if (currentFilter) {
			reset({
				title: currentFilter.name,
				description: currentFilter.description ?? "",
			});
		}
	}, [currentFilter, reset]);

	useEffect(() => {
		const formatFilters = async () => {
			const formatted = await Promise.all(currentFilters.map(formatFilterName));
			setFormattedFilters(formatted);
		};
		formatFilters();
	}, [currentFilters]);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsSaving(true);
		if (!currentTeam) {
			toast({
				title: "Error",
				description: "No team found",
				variant: "destructive",
			});
			setIsSaving(false);
			return;
		}
		try {
			if (currentFilter) {
				const response = await updateSavedFilter(currentFilter.id, {
					name: values.title,
					description: values.description ?? null,
				});
				toast({
					title: response.message,
					variant: response.variant,
				});
			} else if (currentTeam) {
				await saveFilter({
					name: values.title,
					description: values.description ?? null,
					filter: currentFilters,
					type: "TEAM",
					teamId: currentTeam.id,
					workspaceId: currentWorkspace?.id,
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

	const formatFilterName = async (
		filter: FilterCondition,
	): Promise<{ name: string; value: string }> => {
		if (!filter.value || !currentWorkspace)
			return { name: filter.field, value: "" };
		switch (filter.field) {
			case "assigneeId": {
				const allUsers = await getAllUsers(currentWorkspace?.id);
				const users = allUsers.filter(
					(u) => Array.isArray(filter.value) && filter.value.includes(u.id),
				);
				return {
					name: users?.length && users.length > 1 ? "Users" : "User",
					value: users?.map((u) => u.name).join(", ") ?? "",
				};
			}
			case "status":
				return { name: "Status", value: formatStatus(filter.value as Status) };
			case "priority":
				return {
					name: "Priority",
					value: formatPriority(filter.value as Priority),
				};
			case "dueDate":
				return {
					name: "Due Date",
					value:
						filter.value instanceof Date
							? `${filter.operator} ${format(filter.value, "MMM d, yyyy")}`
							: filter.value.toLocaleString(),
				};
			case "effortEstimate":
				return {
					name: "Effort Estimate",
					value: filter.value.toLocaleString(),
				};
			case "labels": {
				const labels = currentWorkspace?.Labels.filter(
					(l) => Array.isArray(filter.value) && filter.value.includes(l.id),
				);
				return {
					name: labels?.length && labels.length > 1 ? "Labels" : "Label",
					value: labels?.map((l) => l.name).join(", ") ?? "",
				};
			}
			default:
				return { name: filter.field, value: filter.value.toLocaleString() };
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
				<FormField
					control={control}
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
					control={control}
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
					{formattedFilters.map(({ name, value }) => (
						<Badge key={name + value} variant="secondary">
							{name}: {value}
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
