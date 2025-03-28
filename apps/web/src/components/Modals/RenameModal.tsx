"use client";

import { client } from "@/lib/client";
import { useModalStore, useTaskStore } from "@/store";
import type { InputChangeEvent } from "@/types";
import { useUser } from "@clerk/nextjs";
import { Pencil } from "@squaredmade/icons";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

export const RenameModal = () => {
	const [inputValue, setInputValue] = useState<string>("");
	const {
		showRename,
		setShowRename,
		renameData: task,
	} = useModalStore((state) => state);
	const { toast } = useToast();
	const { updateTask } = useTaskStore((state) => state);
	const { user } = useUser();

	const handleChange = (e: InputChangeEvent): void => {
		setInputValue(e.target.value);
	};

	const { mutate: handleSubmit, isPending } = useMutation({
		mutationKey: ["task", "updateMetadata", task?.id],
		mutationFn: async () => {
			if (task && inputValue.length > 2 && user && inputValue !== task.title) {
				const updatedTask = await client.task.updateMetadata
					.$post({
						taskId: task.id,
						title: inputValue.trim(),
					})
					.then((res) => res.json());
				updateTask(updatedTask);
				toast({ title: "Task updated successfully" });
			}
		},
		onSuccess: () => {
			toast({ title: "Task updated successfully" });
			setShowRename(false);
		},
		onError: (error) => {
			toast({
				title: "Error Updating Task",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	useEffect(() => {
		if (task) {
			setInputValue(task?.title);
		}
	}, [task]);

	return (
		<Dialog open={showRename} onOpenChange={setShowRename}>
			<DialogContent>
				<form onSubmit={() => handleSubmit()}>
					<div className="flex flex-col gap-4 px-5">
						<DialogHeader>
							<DialogTitle>Title</DialogTitle>
						</DialogHeader>
						<Input
							type="text"
							className="block w-full py-5 text-lg focus:outline-hidden"
							value={inputValue}
							onFocus={(e) => e.target.select()}
							spellCheck="false"
							placeholder="Rename..."
							onChange={handleChange}
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
