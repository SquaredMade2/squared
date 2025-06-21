"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
} from "@squaredmade/ui/form";
import { Input } from "@squaredmade/ui/input";
import { Textarea } from "@squaredmade/ui/textarea";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
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

const formSchema = z.object({
	description: z.string().optional(),
	title: z.string().min(1, "Title is required"),
});

export function SaveFilterForm({
	onCancel,
	type,
}: {
	onCancel: () => void;
	type: string;
}) {
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
		defaultValues: {
			description: "",
			title: "",
		},
		resolver: zodResolver(formSchema),
	});
	const { control, reset } = form;

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
				description:
					type === "new" ? "" : (currentSavedFilter.description ?? ""),
				title: type === "new" ? "" : currentSavedFilter.name,
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
								description: values.description ?? null,
								filter: newFilters,
								name: values.title,
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
						description: values.description ?? null,
						filter: newFilters,
						name: values.title,
						sprintId: null,
						teamId: team.id,
					})
					.then((res) => res.json());
			}
			return await client.filter.createFilter
				.$post({
					description: values.description ?? null,
					filter: currentFilters,
					name: values.title,
					sprintId: pathname.split("/").includes("sprints")
						? (sprint?.id as string)
						: null,
					teamId: team.id,
				})
				.then((res) => res.json());
		},
		mutationKey: ["filter", "create"],
		onError: (error) => {
			toast.error(`Error ${type === "new" ? "Creating" : "Updating"} Filter`, {
				description: error.message,
			});
		},
		onSettled: () => {
			clearFilter();
			onCancel();
		},
		onSuccess: (data) => {
			saveFilter(data);
			handleUrl(data);
		},
	});

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		upsertFilter(values);
	};

	return (
		<Form {...form}>
			<form className="mb-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
					<Button onClick={onCancel} type="button" variant="outline">
						Cancel
					</Button>
					<Button disabled={isPending} type="submit">
						{type === "new" ? "Save New Filter" : "Save"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
