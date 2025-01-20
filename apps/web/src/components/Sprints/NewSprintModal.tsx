import { sprintService } from "@/lib/services";
import { TODO } from "@squared/context";
import type { Team } from "@squared/db";
import { Button } from "@squaredmade/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@squaredmade/ui/dialog";
import { useToast } from "@squaredmade/ui/hooks";
import { Input } from "@squaredmade/ui/input";
import { Label } from "@squaredmade/ui/label";
import { Textarea } from "@squaredmade/ui/textarea";
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

	const handleConfirm = async () => {
		if (!team) return;
		await sprintService.startNextSprint(TODO, {
			teamId: team.id,
			sprintData: {
				name: sprintName,
				description: sprintDescription,
			},
		});
		toast({
			title: "Sprint Created",
			description: "The new sprint has been successfully created.",
		});
		router.push(redirectUrl);
		onClose();
	};

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
					<Button type="submit" onClick={handleConfirm}>
						Create Sprint
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
