import { client } from "@/lib/client";
import { useModalStore, useWorkspaceStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
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
	color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid HEX color"),
});

export const LabelModal = () => {
	const { toast } = useToast();
	const { showLabelModal, setShowLabelModal, labelData, setLabelData } =
		useModalStore((state) => state);
	const { workspace } = useWorkspaceStore((state) => state);

	const [nameExists, setNameExists] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { name: "", description: "", color: "#000000" },
	});

	useEffect(() => {
		// if (showLabelModal) {
		// 	form.reset({
		// 		name: labelData.name || "",
		// 		description: labelData.description || "",
		// 		color: labelData.color || "",
		// 	});
		// } else {
		// 	form.reset({
		// 		name: "",
		// 		description: "",
		// 		color: "",
		// 	});
		// 	setLabelData({});
		// }
		if (labelData.name) form.setValue("name", labelData.name);
		if (labelData.description)
			form.setValue("description", labelData.description);
		if (labelData.color) form.setValue("color", labelData.color);
	}, [showLabelModal]);

	const checkLabelExists = (name: string) => {
		if (!workspace || !name.trim()) {
			setNameExists(false);
			return;
		}
		if (name === labelData.name) {
			setNameExists(false);
			return;
		}
		const exists = workspace.labels.some(
			(label) => label.name.toLowerCase() === name.toLowerCase(),
		);
		setNameExists(exists);
	};

	const handleDiscard = () => {
		setLabelData({});
		form.reset();
		setShowLabelModal(false);
	};

	const handleLabelSubmit = async (values: z.infer<typeof formSchema>) => {
		if (!workspace) return;

		if (labelData) {
			try {
				const response = await client.workspace.updateWorkspaceLabel
					.$post({ workspaceId: workspace.id, updatedLabel: values })
					.then((res) => res.json());
				if (!response.success) {
					throw new Error("Label update failed.");
				}
				toast({
					title: "Label updated successfully",
					description: `Label "${values.name}" updated.`,
				});
				setLabelData({});
				form.reset();
				setShowLabelModal(false);
			} catch (error) {
				console.error(error);
				toast({
					title: "Label could not be updated",
					description: "An unknown error occurred",
					variant: "destructive",
				});
			}
		} else {
			try {
				const response = await client.workspace.createWorkspaceLabel
					.$post({ workspaceId: workspace.id, label: values })
					.then((res) => res.json());

				if (!response.success) {
					throw new Error("Label creation failed.");
				}

				toast({
					title: "Label created successfully",
					description: `Label "${values.name}" added.`,
				});
				setLabelData({});
				form.reset();
				setShowLabelModal(false);
			} catch (error) {
				console.error(error);
				toast({
					title: "Label could not be created",
					description: "An unknown error occurred",
					variant: "destructive",
				});
			}
		}
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
						<div className="my-4 grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-4 ">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-4">
												Label Name{" "}
												{nameExists && (
													<span className="text-red-500 text-sm">
														Label name already exists!
													</span>
												)}
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Label Name"
													onChange={(e) => {
														field.onChange(e);
														checkLabelExists(e.target.value);
													}}
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
												<div className="flex items-center gap-2">
													<div
														className="h-5 w-5 rounded-lg border border-gray-500"
														style={{ backgroundColor: field.value }}
													/>
													<Input
														{...field}
														value={field.value}
														onChange={(e) => field.onChange(e.target.value)}
													/>
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<div className="flex flex-col items-center justify-center gap-4 ">
								<HexColorPicker
									color={form.watch("color")}
									onChange={form.setValue.bind(null, "color")}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								onClick={handleDiscard}
								className="bg-transparent text-foreground hover:cursor-pointer"
								variant="destructive"
							>
								Discard
							</Button>
							<Button
								type="submit"
								className="hover:cursor-pointer"
								disabled={nameExists}
							>
								Save
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
