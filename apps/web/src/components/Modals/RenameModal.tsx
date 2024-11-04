"use client";

import { taskService } from "@/lib/services";
import { useModalStore } from "@/store";
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
	const {
		showRename,
		setShowRename,
		renameData: task,
	} = useModalStore((state) => state);
	const { toast } = useToast();
	const handleChange = (e: InputChangeEvent): void => {
		setInputValue(e.target.value);
	};

	const handleSubmit = async (e: FormSubmitEvent): Promise<void> => {
		e.preventDefault();
		if (inputValue !== task?.title && task) {
			try {
				const response = await taskService.updateTask(TODO, {
					id: task.id,
					title: inputValue.trim(),
				});
				response
					? toast({ title: "Task updated successfully" })
					: toast({
							title: "Unknown issue updating task",
							variant: "destructive",
						});
			} catch (error) {
				toast({
					title: "Error Creating Task",
					description: error instanceof Error && error.message,
				});
			}
			setShowRename(false);
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
						<div className="w-full border-border border" />
						<DialogFooter>
							<Button>
								<span className="mr-2.5">
									<Pencil className="size-4" />
								</span>
								<p>
									Rename issue to
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
