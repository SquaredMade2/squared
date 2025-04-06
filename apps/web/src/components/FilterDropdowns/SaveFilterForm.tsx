"use client";

import { useUsers } from "@/hooks/useUsers";
import { client } from "@/lib/client";
import {
	useFilterStore,
	useSprintStore,
	useTeamStore,
	useWorkspaceStore,
} from "@/store";
import type { SavedFilter } from "@/store/filters";
import { formatFilterName } from "@/utils/formatting";
import { parseParams } from "@/utils/parseParams";
import { Badge } from "@squaredmade/ui/badge";
import { Button } from "@squaredmade/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useForm,
} from "@squaredmade/ui/form";
import { zodResolver } from "@squaredmade/ui/form/resolvers";
import { Input } from "@squaredmade/ui/input";
import { Textarea } from "@squaredmade/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

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
	const { users } = useUsers();
	const { workspace } = useWorkspaceStore((state) => state);
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
			if (workspace && users) {
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

	const { mutate: upsertFilter, isPending } = useMutation({
		mutationKey: ["filter", "create"],
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			if (!team) throw new Error("No team found");
			if (currentSavedFilter) {
				const newFilters = mergeFilters(currentFilters, currentSavedFilter.id);
				// edit existing view
				if (type === "edit") {
					const updatedFilter = await client.filter.updateFilter
						.$post({
							filterId: currentSavedFilter.id,
							filters: {
								name: values.title,
								description: values.description ?? null,
								filter: newFilters,
							},
						})
						.then((res) => res.json());
					updateSavedFilter(updatedFilter);
					setSavedFilters(
						savedFilters.map((f) =>
							f.id === updatedFilter.id ? updatedFilter : f,
						),
					);
					return updatedFilter;
					// create new view from existing view
				}
				return await client.filter.createFilter
					.$post({
						name: values.title,
						description: values.description ?? null,
						filter: newFilters,
						teamId: team.id,
						sprintId: null,
					})
					.then((res) => res.json());
			}
			return await client.filter.createFilter
				.$post({
					name: values.title,
					description: values.description ?? null,
					filter: currentFilters,
					teamId: team.id,
					sprintId: pathname.split("/").includes("sprints")
						? (sprint?.id as string)
						: null,
				})
				.then((res) => res.json());
		},
		onSuccess: (data) => {
			saveFilter(data);
			handleUrl(data);
		},
		onError: (error) => {
			toast.error(`Error ${type === "new" ? "Creating" : "Updating"} Filter`, {
				description: error.message,
			});
		},
		onSettled: () => {
			clearFilter();
			onCancel();
		},
	});

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit((values) => upsertFilter(values))}
				className="mb-8 space-y-4"
			>
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
					<Button type="submit" disabled={isPending}>
						{type === "new" ? "Save New Filter" : "Save"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
