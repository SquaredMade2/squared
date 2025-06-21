"use client";

import { useUser } from "@clerk/nextjs";
import { Pencil } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@squaredmade/ui/dialog";
import { Input } from "@squaredmade/ui/input";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { useModalStore, useTaskStore } from "@/store";
import type { InputChangeEvent } from "@/types";

export const RenameModal = () => {
	const [inputValue, setInputValue] = useState<string>("");
	const {
		showRename,
		setShowRename,
		renameData: task,
	} = useModalStore((state) => state);
	const { updateTask } = useTaskStore((state) => state);
	const { user } = useUser();

	const handleChange = (e: InputChangeEvent): void => {
		setInputValue(e.target.value);
	};

	const { mutate: handleSubmit, isPending } = useMutation({
		mutationFn: async () => {
			if (task && inputValue.length > 2 && user && inputValue !== task.title) {
				const updatedTask = await client.task.updateMetadata
					.$post({
						taskId: task.id,
						title: inputValue.trim(),
					})
					.then((res) => res.json());
				updateTask(updatedTask);
				toast.success("Task updated successfully");
			}
		},
		mutationKey: ["task", "updateMetadata", task?.id],
		onError: (error) => {
			toast.error("Error Updating Task", {
				description: error.message,
			});
		},
		onSuccess: () => {
			toast.success("Task updated successfully");
			setShowRename(false);
		},
	});

	useEffect(() => {
		if (task) {
			setInputValue(task?.title);
		}
	}, [task]);

	return (
		<Dialog onOpenChange={setShowRename} open={showRename}>
			<DialogContent>
				<form onSubmit={() => handleSubmit()}>
					<div className="flex flex-col gap-4 px-5">
						<DialogHeader>
							<DialogTitle>Title</DialogTitle>
						</DialogHeader>
						<Input
							className="block w-full py-5 text-lg focus:outline-hidden"
							onChange={handleChange}
							onFocus={(e) => e.target.select()}
							placeholder="Rename..."
							spellCheck="false"
							type="text"
							value={inputValue}
						/>
						{inputValue.length < 2 && (
							<span
								className={`text-destructive ${inputValue.length > 2 && "opacity-0"}`}
							>
								Title must be at least 2 characters
							</span>
						)}
						<div className="w-full border border-border" />
						<DialogFooter>
							<Button disabled={isPending}>
								<span className="mr-2.5">
									<Pencil className="size-4" />
								</span>
								<p>
									Rename task to
									<span className="ml-2 italic">{`"${inputValue}"`}</span>
								</p>
							</Button>
						</DialogFooter>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
