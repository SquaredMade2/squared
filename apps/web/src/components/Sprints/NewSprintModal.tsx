import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import type { Team } from "@squared/db";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NewSprintModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialSprintName: string;
	team: Team | null;
	redirectUrl?: string;
}

export const NewSprintModal = ({
	isOpen,
	onClose,
	team,
	initialSprintName,
	redirectUrl = "/",
}: NewSprintModalProps) => {
	const [sprintName, setSprintName] = useState(initialSprintName);
	const [sprintDescription, setSprintDescription] = useState("");
	const router = useRouter();
	const { toast } = useToast();

	const { mutate: startNextSprint } = useMutation({
		mutationKey: ["sprint", "startNextSprint"],
		mutationFn: async () => {
			if (!team) throw new Error("Team not found");
			await client.sprint.startNextSprint.$post({
				teamId: team.id,
				sprintData: {
					name: sprintName,
					description: sprintDescription,
				},
			});
		},
		onError: (error) => {
			toast({
				title: "Error Creating Sprint",
				description: error.message,
				variant: "destructive",
			});
		},
		onSuccess: () => {
			toast({
				title: "Sprint Created",
				description: "The new sprint has been successfully created.",
			});
			router.push(redirectUrl);
			onClose();
		},
	});

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New Sprint</DialogTitle>
					<DialogDescription>
						Set the title and description for the new sprint.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="sprint-name" className="text-right">
							Sprint Title
						</Label>
						<Input
							id="sprint-name"
							value={sprintName}
							onChange={(e) => setSprintName(e.target.value)}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="sprint-description" className="text-right">
							Description
						</Label>
						<Textarea
							id="sprint-description"
							value={sprintDescription}
							onChange={(e) => setSprintDescription(e.target.value)}
							className="col-span-3"
							rows={3}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" onClick={() => startNextSprint()}>
						Create Sprint
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
