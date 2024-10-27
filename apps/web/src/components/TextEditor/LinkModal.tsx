import { FormInput, Link } from "lucide-react";
import { useModalStore } from "@/store";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@repo/ui/dialog";
import { DialogHeader } from "../ui/dialog";
import { Button } from "../ui/button";

const LinkModal = () => {
	const { showLinkForm, setShowLinkForm } = useModalStore((state) => state);
	return (
		<Dialog>
			<DialogTrigger>
				<Button
					variant="ghost"
					size="icon"
					className={`size-8 ${showLinkForm ? "" : "text-muted-foreground"}`}
					onMouseDown={(e) => {
						e.preventDefault();
						setShowLinkForm(!showLinkForm);
					}}
				>
					<Link />
					<span className="sr-only">Link</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-white p-5 w-1/2 h-40">
				<DialogHeader>
					<DialogTitle className="h-5 m-5 text-sm">Insert Link</DialogTitle>
				</DialogHeader>
				<div className="h-auto">
					<input type="text" className="w-full h-6 m-3" />
					<input type="text" className="w-full h-6 m-3" />
				</div>
				<Button className="w-full h-10">Insert</Button>
			</DialogContent>
		</Dialog>
	);
};

export default LinkModal;
