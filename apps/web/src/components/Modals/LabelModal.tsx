import { client } from "@/lib/client";
import { useModalStore, useWorkspaceStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

const formSchema = z.object({
	name: z
		.string()
		.min(2, { message: "Label name must be at least 2 characters." }),
	description: z.string().optional(),
	color: z.string(),
});

export const LabelModal = () => {
	const { toast } = useToast();
	const { showLabelModal, setShowLabelModal, labelData, setLabelData } =
		useModalStore((state) => state);
	const { workspace } = useWorkspaceStore((state) => state);

	useEffect(() => {
		if (labelData.name) {
			form.setValue("name", labelData.name);
		}
		if (labelData.description) {
			form.setValue("description", labelData.description);
		}
		if (labelData.color) {
			form.setValue("color", labelData.color);
		}
	}, [showLabelModal]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { name: "", description: "", color: "" },
	});

	const handleDiscard = () => {
		setLabelData({});
		form.reset();
		setShowLabelModal(false);
	};
	console.log(workspace);
	const handleLabelSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		// console.log("labelData", labelData);
		if (workspace) {
			if (labelData) {
				console.log("labelData", labelData);
			} else {
				try {
					await client.workspace.createWorkspaceLabel
						.$post({ workspaceId: workspace.id, label: values })
						.then((res) => res.json());
				} catch (error) {
					console.error(error);
					toast({
						title: "Label could not be created",
						description: "An unknown error occurred",
						variant: "destructive",
					});
				}
			}
		}
		// try {
		// } catch (error) {
		// 	console.error(error);
		// }
		setShowLabelModal(false);
	};

	return (
		<Dialog open={showLabelModal} onOpenChange={setShowLabelModal}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{labelData.name ? "Edit Label" : "Create Label"}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleLabelSubmit)}>
						<div className="flex">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Label Name</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Label Name" />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Label Description</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Label Description" />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="color"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Label Color</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Label Color" />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button
								onClick={handleDiscard}
								className="bg-transparent text-foreground hover:cursor-pointer"
								variant="destructive"
							>
								Discard
							</Button>
							<Button type="submit" className="hover:cursor-pointer">
								Save
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
