"use client";

import type { Sprint } from "@squaredmade/db";
import { Button } from "@squaredmade/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@squaredmade/ui/card";
import { Input } from "@squaredmade/ui/input";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";
import TextEditor, { type CustomDescendant } from "@/components/TextEditor";
import { convertMDXToSlate } from "@/components/TextEditor/format";
import { DatePicker } from "@/components/ui/date-picker";
import { client } from "@/lib/client";
import { isCustomElement } from "@/utils/isCustomElement";
import { parseError } from "@/utils/parseError";

interface SprintCardProps {
	sprint: Sprint;
	isActive?: boolean;
}

const SettingsSprintCard = ({ sprint, isActive }: SprintCardProps) => {
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

	const router = useRouter();

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const handleDateSubmit = () => {
		if (sprintDate && sprintDate < new Date()) {
			console.warn(
				"End date cannot be in the past. Resetting to original value.",
			);
			setSprintDate(new Date(sprint.endDate));
			return;
		}
	};

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

	const handleSubmit = () => {
		// Here you would typically handle the submission of the sprint data,
		// such as making an API call to update the sprint in your database.

		console.log("Sprint updated:", {
			title,
			sprintDate,
		});
	};

	useEffect(() => {
		if (sprint.name !== title) {
			setTitleChanged(true);
		} else {
			setTitleChanged(false);
		}

		if (
			(isActive &&
				sprint.endDate.toISOString() !== sprintDate?.toISOString()) ||
			(!isActive &&
				sprint.startDate.toISOString() !== sprintDate?.toISOString())
		) {
			setDateChanged(true);
		} else {
			setDateChanged(false);
		}
	}, [sprint.name, title, sprint.startDate, sprintDate, sprint.endDate]);

	return (
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
				<CardDescription className="mt-2">
					<TextEditor
						value={description.filter(
							(item) => isCustomElement(item) && item.children.length > 0,
						)}
						onChange={handleDescriptionChange}
						placeholder="Add description..."
						onBlur={handleSubmit}
						onFocus={() => setIsDescriptionFocused(true)}
						style={
							CustomMentionStyle(isDescriptionFocused) as React.CSSProperties
						}
						hasToolbar={false}
					/>
					{isActive ? <p>Sprint End Date:</p> : <p>Sprint Start date:</p>}
					<DatePicker
						className="w-auto border-0 outline-none"
						date={sprintDate}
						setDate={setSprintDate}
						handleSubmit={handleDateSubmit}
					/>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="mt-4 flex justify-end gap-2">
					<Button
						size="sm"
						disabled={!titleChanged && !dateChanged}
						variant={isActive ? "default" : "outline"}
						onClick={handleSubmit}
					>
						Save Changes
					</Button>
					<Button variant="destructive" size="sm">
						Delete Sprint
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default SettingsSprintCard;
