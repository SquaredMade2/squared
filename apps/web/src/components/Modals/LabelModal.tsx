import { useModalStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
	name: z
		.string()
		.min(2, { message: "Label name must be at least 2 characters." }),
	description: z.string().optional(),
});

export const LabelModal = () => {
	const { showLabelModal, setShowLabelModal, labelData } = useModalStore(
		(state) => state,
	);

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

	const handleLabelSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
	};

	return (
		<Dialog open={showLabelModal} onOpenChange={setShowLabelModal}>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleLabelSubmit)}>
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
						<DialogFooter>
							<Button>Discard</Button>
							<Button>Create Label</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
