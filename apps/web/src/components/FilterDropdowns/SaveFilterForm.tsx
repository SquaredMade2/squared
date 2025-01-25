"use client";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { filterService } from "@/lib/services";
import {
	useFilterStore,
	useSprintStore,
	useTeamStore,
	useUserStore,
	useWorkspaceStore,
} from "@/store";
import type { SavedFilter } from "@/store/filters";
import { formatFilterName } from "@/utils/formatting";
import { parseParams } from "@/utils/parseParams";
import { zodResolver } from "@hookform/resolvers/zod";
import { TODO } from "@squared/context";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";

const formSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
});

export function SaveFilterForm({
	onCancel,
	type,
}: { onCancel: () => void; type: string }) {
	const {
		currentFilters,
		saveFilter,
		savedFilters,
		updateSavedFilter,
		setSavedFilters,
		clearFilter,
		mergeFilters,
	} = useFilterStore((state) => state);
	const { team } = useTeamStore((state) => state);
	const { users, user } = useUserStore((state) => state);
	const { workspace } = useWorkspaceStore((state) => state);
	const { toast } = useToast();
	const [isSaving, setIsSaving] = useState(false);
	const [formattedFilters, setFormattedFilters] = useState<
		{ name: string; value: string }[]
	>([]);
	const [currentSavedFilter, setCurrentSavedFilter] =
		useState<SavedFilter | null>(null);
	const params = useParams();
	const pathname = usePathname();
	const router = useRouter();
	const sprint = useSprintStore((state) => state.sprint);

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
			const filterId = parseParams(params.filterId);
			const filterSlug = filterId?.split("-").pop() || "";
			const foundFilter = savedFilters.find((f) =>
				f.id.startsWith(filterSlug || ""),
			);
			if (foundFilter) setCurrentSavedFilter(foundFilter);
		}
	}, [params.filterId, savedFilters]);

	useEffect(() => {
		if (currentSavedFilter) {
			reset({
				title: type === "new" ? "" : currentSavedFilter.name,
				description:
					type === "new" ? "" : (currentSavedFilter.description ?? ""),
			});
		}
	}, [currentSavedFilter, type, reset]);

	useEffect(() => {
		const formatFilters = async () => {
			if (workspace) {
				const formatted = await Promise.all(
					currentFilters.map((filter) =>
						formatFilterName(filter, workspace.labels, users),
					),
				);
				setFormattedFilters(formatted);
			}
		};
		formatFilters();
	}, [currentFilters]);

	const handleUrl = (filter: SavedFilter) => {
		const filterName = filter.name.toLowerCase().replace(/\s+/g, "-");

		const filterId = filter.id.split("-")[0];

		const currentWorkSpaceName = workspace?.name;

		const currentTeamName = team?.name;

		const filterURL = `/${currentWorkSpaceName}/team/${currentTeamName}/views/${filterName}-${filterId}`;

		router.push(filterURL);
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsSaving(true);
		if (!team) {
			toast({
				title: "Error",
				description: "No team found",
				variant: "destructive",
			});
			setIsSaving(false);
			return;
		}
		try {
			if (currentSavedFilter) {
				const newFilters = mergeFilters(currentFilters, currentSavedFilter.id);
				// edit existing view
				if (type === "edit") {
					const updatedFilter = await filterService.updateFilter(TODO, {
						filterId: currentSavedFilter.id,
						filters: {
							name: values.title,
							description: values.description ?? null,
							filter: newFilters,
						},
					});
					updateSavedFilter(updatedFilter);
					setSavedFilters(
						savedFilters.map((f) =>
							f.id === updatedFilter.id ? updatedFilter : f,
						),
					);
					handleUrl(updatedFilter);
					toast({
						title: "Filter Updated Successfully",
					});
					// create new view from existing view
				} else if (type === "new" && user) {
					const savedFilter = await filterService.createFilter(TODO, {
						name: values.title,
						description: values.description ?? null,
						filter: newFilters,
						authorId: user.externalId,
						teamId: team.id,
						sprintId: null,
					});
					saveFilter(savedFilter);
					handleUrl(savedFilter);
				}
				//create new view
			} else if (team && user) {
				const savedFilter = await filterService.createFilter(TODO, {
					name: values.title,
					description: values.description ?? null,
					filter: currentFilters,
					teamId: team.id,
					authorId: user.externalId,
					sprintId: pathname.split("/").includes("sprints")
						? (sprint?.id as string)
						: null,
				});

				saveFilter(savedFilter);

				handleUrl(savedFilter);
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
		clearFilter();
		onCancel();
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
						{type === "new" ? "Save New Filter" : "Save"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
