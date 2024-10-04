"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogFooter,
	DialogHeader,
} from "@/components/ui/dialog";
import { StatusDropdownButton } from "./StatusDropdownButton";
import { EffortDropdownButton } from "./EffortDropdownButton";
import { LabelDropdownButton } from "./LabelDropdownButton";
import { useToast } from "@/components/ui/use-toast";
import { PriorityDropdownButton } from "./PriorityDropdownButton";
import { Separator } from "@/components/ui/separator";
import {
	Form,
	FormItem,
	FormControl,
	FormField,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LayoutGrid, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store";
import { DateDropdownButton } from "./DateDropdownButton";
import { useCreateTask } from "@/hooks/useCreateTask";
export * from "./NewIssueButton";
export * from "./NewIssueCollapsible";

export const NewIssueModal = () => {
	const { toast } = useToast();
	const { showNewIssue, newIssueData, setNewIssueData, setShowNewIssue } =
		useModalStore((state) => state);
	const { createTask, isLoading, error } = useCreateTask();

	const { status, priority, dueDate, effortEstimate, labels } = newIssueData;

	const formSchema = z.object({
		title: z.string().min(2, {
			message: "Title must be at least 2 characters.",
		}),
		description: z.string().optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	});

	const handleDiscard = () => {
		setNewIssueData({});
		form.reset();
		setShowNewIssue(false);
	};

	const handleCreateIssue = async (values: z.infer<typeof formSchema>) => {
		try {
			const { message, variant } = await createTask({
				...values,
				status,
				priority,
				labels,
				dueDate,
				effortEstimate,
			});

			toast({
				title: message,
				variant: variant,
			});

			setShowNewIssue(false);
			setNewIssueData({});
			form.reset();
		} catch {
			toast({
				title: error || "Error creating issue",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={showNewIssue} onOpenChange={setShowNewIssue}>
			<DialogContent className="max-w-full bg-popover">
				<DialogHeader>
					<div className="flex items-center">
						<div className="inline-flex items-center justify-center text-muted-foreground border border-border rounded-md shadow-md px-2 py-0.5 mr-2">
							<LayoutGrid className="text-[#9577FF] w-4 h-4" />
						</div>
						<ChevronRight />
						<DialogTitle className="text-sm">New Issue</DialogTitle>
					</div>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleCreateIssue)}>
						<div className="flex space-x-4 ">
							<div className="w-4/5 space-y-4 ">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-2xl">Title</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Title"
													className="text-xl"
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-2xl">Description</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													placeholder="Add Description"
													className="text-base resize-none"
													rows={4}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<div>
								<Separator orientation="vertical" />
							</div>
							<div className="w-1/5 space-y-4">
								<StatusDropdownButton />
								<LabelDropdownButton />
								<PriorityDropdownButton />
								<EffortDropdownButton />
								<DateDropdownButton />
							</div>
						</div>
						<DialogFooter className="mt-6">
							<Button
								onClick={handleDiscard}
								className="hover:cursor-pointer bg-transparent"
								variant="destructive"
								type="button"
							>
								Discard
							</Button>
							<Button
								type="submit"
								className="hover:cursor-pointer"
								disabled={isLoading}
							>
								{isLoading ? "Creating..." : "Create Issue"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
