import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@squaredmade/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@squaredmade/ui/dialog";
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
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { client } from "@/lib/client";
import { useModalStore, useWorkspaceStore } from "@/store";

const formSchema = z.object({
	color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid HEX color"),
	description: z.string().optional(),
	name: z
		.string()
		.min(2, { message: "Label name must be at least 2 characters." }),
});

export const LabelModal = () => {
	const queryClient = useQueryClient();
	const { showLabelModal, setShowLabelModal, labelData, setLabelData } =
		useModalStore((state) => state);
	const { workspace } = useWorkspaceStore((state) => state);

	const [nameExists, setNameExists] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: { color: "#000000", description: "", name: "" },
		resolver: zodResolver(formSchema),
	});

	useEffect(() => {
		if (showLabelModal) {
			form.reset({
				color: labelData.color || "#000000",
				description: labelData.description || "",
				name: labelData.name || "",
			});
		}
	}, [showLabelModal]);

	const checkLabelExists = (name: string) => {
		if (!(workspace && name.trim())) {
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

	const handleResetForm = () => {
		setLabelData({});
		form.reset();
		setShowLabelModal(false);
	};

	const updateLabelMutation = useMutation({
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			if (!workspace) throw new Error("Workspace not found");
			if (!labelData.name) throw new Error("Label name not found");
			const res = await client.workspace.updateWorkspaceLabel.$post({
				labelName: labelData.name,
				updatedLabel: values,
			});
			return res.json();
		},
		onError: (error) => {
			toast.error("Error updating label", {
				description:
					error instanceof Error ? error.message : "An unknown error occurred",
			});
		},
		onSuccess: (_, variables) => {
			toast.success("Label updated successfully", {
				description: `Label "${variables.name}" has been updated`,
			});
			queryClient.invalidateQueries({
				queryKey: ["workspace", "workspaceLabels", workspace?.id],
			});
			handleResetForm();
		},
	});

	const createLabelMutation = useMutation({
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			if (!workspace) throw new Error("Workspace not found");
			const res = await client.workspace.createWorkspaceLabel.$post({
				label: values,
			});
			return res.json();
		},
		onError: (error) => {
			toast.error("Error creating label", {
				description:
					error instanceof Error ? error.message : "An unknown error occurred",
			});
		},
		onSuccess: (_, variables) => {
			toast.success("Label created successfully", {
				description: `Label "${variables.name}" has been created`,
			});
			queryClient.invalidateQueries({
				queryKey: ["workspace", "workspaceLabels", workspace?.id],
			});
			handleResetForm();
		},
	});

	const handleLabelSubmit = (values: z.infer<typeof formSchema>) => {
		if (labelData.name) {
			updateLabelMutation.mutate(values);
		} else {
			createLabelMutation.mutate(values);
		}
	};

	return (
		<Dialog onOpenChange={setShowLabelModal} open={showLabelModal}>
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
													<span className="text-red-500">
														Label name already exists!
													</span>
												)}
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													onChange={(e) => {
														field.onChange(e);
														checkLabelExists(e.target.value);
													}}
													placeholder="Label Name"
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
														onChange={(e) => field.onChange(e.target.value)}
														value={field.value}
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
								className="bg-transparent text-foreground hover:cursor-pointer"
								onClick={handleResetForm}
								type="button"
								variant="destructive"
							>
								Discard
							</Button>
							<Button
								className="hover:cursor-pointer"
								disabled={nameExists}
								type="submit"
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
