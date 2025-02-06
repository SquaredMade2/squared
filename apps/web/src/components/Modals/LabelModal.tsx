import { useModalStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@squaredmade/ui/dialog";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
	name: z
		.string()
		.min(2, { message: "Label name must be at least 2 characters." }),
	description: z.string().optional(),
});

export const LabelModal = () => {
	const { showLabelModal, setShowLabelModal, labelData, setLabelData } =
		useModalStore((state) => state);
	console.log(labelData, showLabelModal);
	useEffect(() => {
		if (labelData.name) {
			form.setValue("name", labelData.name);
		}
		if (labelData.description) {
			form.setValue("description", labelData.description);
		}
	}, [showLabelModal]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { name: "", description: "" },
	});

	const handleDiscard = () => {
		setLabelData({});
		form.reset();
		setShowLabelModal(false);
	};

	const handleLabelSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		// try{}
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
								Create Label
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
