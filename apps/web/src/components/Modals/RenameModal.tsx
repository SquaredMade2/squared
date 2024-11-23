"use client";

import { taskService } from "@/lib/services";
import { useModalStore, useTaskStore } from "@/store";
import type { FormSubmitEvent, InputChangeEvent } from "@/types";
import { TODO } from "@squared/context";
import { Pencil } from "lucide-react";
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
	const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
	const {
		showRename,
		setShowRename,
		renameData: task,
	} = useModalStore((state) => state);
	const { toast } = useToast();
	const { updateTask } = useTaskStore((state) => state);
	const handleChange = (e: InputChangeEvent): void => {
		setInputValue(e.target.value);
	};

	const handleSubmit = async (e: FormSubmitEvent): Promise<void> => {
		e.preventDefault();
		setHasSubmitted(true);
		if (task && inputValue.length > 2) {
			if (inputValue !== task.title) {
				try {
					updateTask(
						await taskService.updateTask(TODO, {
							id: task.id,
							title: inputValue.trim(),
						}),
					);

					toast({ title: "Task updated successfully" });
				} catch (error) {
					toast({
						title: "Error Updating Task",
						description: error instanceof Error && error.message,
					});
				}
				setShowRename(false);
				setHasSubmitted(false);
			}
		}
	};

	useEffect(() => {
		if (task) {
			setInputValue(task?.title);
		}
	}, [task]);

	return (
		<Dialog open={showRename} onOpenChange={setShowRename}>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<div className="px-5 flex flex-col gap-4">
						<DialogHeader>
							<DialogTitle>Title</DialogTitle>
						</DialogHeader>
						<Input
							type="text"
							className="focus:outline-none py-5 block text-lg w-full"
							value={inputValue}
							onFocus={(e) => e.target.select()}
							spellCheck="false"
							placeholder="Rename..."
							onChange={handleChange}
						/>
						{hasSubmitted && inputValue.length < 2 && (
							<span
								className={`text-destructive ${inputValue.length > 2 && "opacity-0"}`}
							>
								Title must be at least 2 characters
							</span>
						)}
						<div className="w-full border-border border" />
						<DialogFooter>
							<Button>
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
