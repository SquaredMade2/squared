"use client";

import { useOrganization } from "@clerk/nextjs";
import type { Sprint, Team } from "@squaredmade/db";
import { Button } from "@squaredmade/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@squaredmade/ui/card";
import { Input } from "@squaredmade/ui/input";
import { toast } from "@squaredmade/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";
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

interface SprintCardProps {
	sprint: Sprint;
	team: Team;
	isActive?: boolean;
}

const SettingsSprintCard = ({ sprint, team, isActive }: SprintCardProps) => {
	const [title, setTitle] = useState(sprint.name);
	const [sprintDate, setSprintDate] = useState<Date | undefined>(
		isActive ? sprint.endDate : sprint.startDate,
	);
	const [description, setDescription] = useState<CustomDescendant[]>(
		convertMDXToSlate(sprint?.description ?? ""),
	);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [titleChanged, setTitleChanged] = useState(false);
	const [dateChanged, setDateChanged] = useState(false);
	const [descriptionChanged, setDescriptionChanged] = useState(false);
	const [showEndSprintDialog, setShowEndSprintDialog] = useState(false);

	const router = useRouter();
	const { organization } = useOrganization();
	const queryClient = useQueryClient();

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const handleDescriptionChange = (event: CustomDescendant[]) => {
		setDescription(event);
	};

	const handleDateSubmit = () => {
		if (sprintDate && sprintDate < new Date()) {
			console.warn(
				"New end date should not be in the past. Resetting to original value.",
			);
			setSprintDate(new Date(sprint.endDate));
			return;
		}
	};

	const { mutate: updateSprint } = useMutation({
		mutationFn: async () => {
			return await client.sprint.updateSprint
				.$post({
					sprintId: sprint.id,
					sprintData: {
						name: title,
						startDate: isActive ? sprint.startDate : (sprintDate as Date),
						endDate: isActive ? (sprintDate as Date) : sprint.endDate,
						description: convertSlateToMDX(description as CustomElement[]),
					},
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
		mutationKey: ["sprint", "sprintEnd", sprint?.id],
		mutationFn: async () => {
			if (!sprint) throw new Error("Sprint not found");
			if (!isActive) throw new Error("Sprint is not active");
			return await client.sprint.endSprint
				.$post({
					sprintId: sprint.id,
				})
				.then((res: Response) => res.json());
		},
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
		if (!sprint || !team) return;
		setShowEndSprintDialog(false);
		endSprint();
	};

	const handleEndSprintButtonClick = () => {
		setShowEndSprintDialog(true);
	};

	const handleSubmit = () => {
		if (!sprint || !team) return;

		updateSprint();

		toast.success("Sprint updated successfully", {
			duration: 2000,
		});
		setIsEditingTitle(false);
		setDescriptionChanged(false);
		setTitleChanged(false);
		setDateChanged(false);
	};

	useEffect(() => {
		const convertedDescription = convertSlateToMDX(
			(description as CustomElement[]) || "",
		).trim();

		if (sprint.name !== title) {
			setTitleChanged(true);
		} else {
			setTitleChanged(false);
		}

		if (sprint.description?.trim() !== convertedDescription) {
			setDescriptionChanged(true);
		} else {
			setDescriptionChanged(false);
		}

		if (
			(isActive &&
				sprint.endDate.toDateString() !== sprintDate?.toDateString()) ||
			(!isActive &&
				sprint.startDate.toDateString() !== sprintDate?.toDateString())
		) {
			setDateChanged(true);
		} else {
			setDateChanged(false);
		}
	}, [
		sprint.name,
		title,
		sprint.startDate,
		sprintDate,
		sprint.endDate,
		description,
		sprint.description,
		isActive,
	]);

	return (
		<>
			<Card
				className={`mb-4 w-full ${isActive ? "border-primary shadow-md" : ""}`}
			>
				<CardHeader className={isActive ? "bg-primary/5" : ""}>
					<CardTitle
						className={`flex items-center justify-between ${isActive ? "text-primary" : ""}`}
					>
						<div className="relative">
							<Input
								className="inline-block h-auto truncate text-2xl focus:outline-hidden"
								value={title}
								onChange={handleTitleChange}
								onBlur={() => setIsEditingTitle(false)}
								onFocus={() => setIsEditingTitle(true)}
								placeholder="Title"
								name="title"
								maxLength={50}
								style={{
									border: "none",
									boxShadow: "none",
									padding: "0",
								}}
							/>
							<p
								className={`-bottom-3 absolute text-end text-muted-foreground text-xs opacity-0 transition-opacity duration-200 ${isEditingTitle && "opacity-100"}`}
							>
								{title.length ?? 0} / 50
							</p>
						</div>
						{isActive && (
							<span className="ml-2 rounded-full bg-primary px-2 py-1 font-normal text-primary-foreground text-sm">
								Active
							</span>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent className="mt-4 space-y-2">
					<TextEditor
						value={description.filter(
							(item) => isCustomElement(item) && item.children.length > 0,
						)}
						onChange={handleDescriptionChange}
						placeholder="Add description..."
						hasToolbar={false}
					/>
					{isActive ? <p>Sprint End Date:</p> : <p>Sprint Start date:</p>}
					<DatePicker
						className="w-auto border-0 outline-none"
						date={sprintDate}
						setDate={setSprintDate}
						handleSubmit={handleDateSubmit}
					/>
					<div className="flex justify-end gap-2">
						<Button
							size="sm"
							disabled={!titleChanged && !dateChanged && !descriptionChanged}
							variant={isActive ? "default" : "outline"}
							onClick={handleSubmit}
						>
							Save Changes
						</Button>
						{isActive && (
							<Button
								variant="destructive"
								size="sm"
								onClick={handleEndSprintButtonClick}
							>
								End Sprint
							</Button>
						)}
					</div>
				</CardContent>
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
