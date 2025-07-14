"use client";

import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Sprint, Team } from "@squaredmade/db";
import { Button } from "@squaredmade/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@squaredmade/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@squaredmade/ui/form";
import { Input } from "@squaredmade/ui/input";
import { toast } from "@squaredmade/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TextEditor, {
	type CustomDescendant,
	type CustomElement,
} from "@/components/TextEditor";
import {
	convertMDXToSlate,
	convertSlateToMDX,
} from "@/components/TextEditor/format";
import { DatePicker } from "@/components/ui/date-picker";
import { client } from "@/lib/client";
import { isCustomElement } from "@/utils/isCustomElement";
import { parseError } from "@/utils/parseError";
import EndSprintDialog from "../EndSprintDialog";

// Define the form schema
const formSchema = z.object({
	description: z.array(z.any()).optional(),
	sprintDate: z.date(), // For CustomDescendant[]
	title: z
		.string()
		.min(1, "Title is required")
		.max(50, "Title must be 50 characters or less"),
});

type FormValues = z.infer<typeof formSchema>;
interface SprintCardProps {
	sprint: Sprint;
	team: Team;
	isActive?: boolean;
}

const SettingsSprintCard = ({ sprint, team, isActive }: SprintCardProps) => {
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [showEndSprintDialog, setShowEndSprintDialog] = useState(false);

	const router = useRouter();
	const { organization } = useOrganization();
	const queryClient = useQueryClient();

	const form = useForm<FormValues>({
		defaultValues: {
			description: convertMDXToSlate(sprint?.description ?? ""),
			sprintDate: isActive ? sprint.endDate : sprint.startDate,
			title: sprint.name,
		},
		resolver: zodResolver(formSchema),
	});

	// Watch form values to detect changes
	const watchedValues = form.watch();
	const hasChanges =
		watchedValues.title !== sprint.name ||
		convertSlateToMDX(watchedValues.description as CustomElement[]).trim() !==
			(sprint.description?.trim() ?? "") ||
		(isActive &&
			watchedValues.sprintDate.toDateString() !==
				sprint.endDate.toDateString()) ||
		(!isActive &&
			watchedValues.sprintDate.toDateString() !==
				sprint.startDate.toDateString());

	const handleDateSubmit = () => {
		const currentDate = form.getValues("sprintDate");
		if (isActive && currentDate && currentDate < sprint.startDate) {
			form.setValue("sprintDate", sprint.endDate);
			toast.error("End date cannot be before start date");
			return;
		}
	};

	const { mutate: updateSprint } = useMutation({
		mutationFn: async (values: FormValues) => {
			return await client.sprint.updateSprint
				.$post({
					sprintData: {
						description: convertSlateToMDX(
							values.description as CustomElement[],
						),
						endDate: isActive ? values.sprintDate : sprint.endDate,
						name: values.title,
						startDate: isActive ? sprint.startDate : values.sprintDate,
					},
					sprintId: sprint.id,
				})
				.then((res) => res.json());
		},
		onError: (error) => {
			toast.error("Failed to update the sprint.", {
				description: parseError(error, "Unknown error"),
			});
		},
		onSuccess: () => {
			toast.success("Sprint updated successfully");
			queryClient.invalidateQueries({
				queryKey: ["sprint", team.id],
			});
			router.push(`/${organization?.slug}/team/${team?.identifier}/all`);
		},
	});

	const { mutate: endSprint } = useMutation({
		mutationFn: async () => {
			if (!sprint) throw new Error("Sprint not found");
			if (!isActive) throw new Error("Sprint is not active");
			return await client.sprint.endSprint
				.$post({
					sprintId: sprint.id,
				})
				.then((res: Response) => res.json());
		},
		mutationKey: ["sprint", "sprintEnd", sprint?.id],
		onError: (error) => {
			toast.error("Failed to end the sprint.", {
				description: parseError(error, "Unknown error"),
			});
		},
		onSuccess: () => {
			toast.success("Sprint ended successfully");
			router.push(`/${organization?.slug}/team/${team?.identifier}/all`);
		},
	});

	const handleEndSprint = () => {
		if (!(sprint && team)) return;
		setShowEndSprintDialog(false);
		endSprint();
	};

	const handleEndSprintButtonClick = () => {
		setShowEndSprintDialog(true);
	};

	const onSubmit = (values: FormValues) => {
		updateSprint(values);
	};

	return (
		<>
			<Card
				className={`mb-4 w-full ${isActive ? "border-primary shadow-md" : ""}`}
			>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardHeader className={isActive ? "bg-primary/5" : ""}>
							<CardTitle
								className={`flex items-center justify-between ${isActive ? "text-primary" : ""}`}
							>
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem className="relative flex-1">
											<FormControl>
												<Input
													{...field}
													className="inline-block h-auto truncate text-2xl focus:outline-hidden"
													maxLength={50}
													onBlur={() => setIsEditingTitle(false)}
													onFocus={() => setIsEditingTitle(true)}
													placeholder="Title"
													style={{
														border: "none",
														boxShadow: "none",
														padding: "0",
													}}
												/>
											</FormControl>
											<p
												className={`-bottom-3 absolute text-end text-muted-foreground text-xs opacity-0 transition-opacity duration-200 ${isEditingTitle && "opacity-100"}`}
											>
												{field.value?.length ?? 0} / 50
											</p>
										</FormItem>
									)}
								/>
								{isActive && (
									<span className="ml-2 rounded-full bg-primary px-2 py-1 font-normal text-primary-foreground text-sm">
										Active
									</span>
								)}
							</CardTitle>
						</CardHeader>
						<CardContent className="mt-4 space-y-2">
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<TextEditor
												hasToolbar={false}
												onChange={field.onChange}
												placeholder="Add description..."
												value={
													(field.value as CustomDescendant[])?.filter(
														(item) =>
															isCustomElement(item) && item.children.length > 0,
													) ?? []
												}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="sprintDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{isActive ? "Sprint End Date:" : "Sprint Start Date:"}
										</FormLabel>
										<FormControl>
											<DatePicker
												className="w-fit border-0 outline-none"
												date={field.value}
												handleSubmit={handleDateSubmit}
												setDate={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<div className="flex justify-end gap-2">
								<Button
									disabled={!hasChanges}
									size="sm"
									type="submit"
									variant={isActive ? "default" : "outline"}
								>
									Save Changes
								</Button>
								{isActive && (
									<Button
										onClick={handleEndSprintButtonClick}
										size="sm"
										type="button"
										variant="destructive"
									>
										End Sprint
									</Button>
								)}
							</div>
						</CardContent>
					</form>
				</Form>
			</Card>
			<EndSprintDialog
				dialogOpen={showEndSprintDialog}
				onOpenChange={setShowEndSprintDialog}
				onSubmit={handleEndSprint}
			/>
		</>
	);
};

export default SettingsSprintCard;
