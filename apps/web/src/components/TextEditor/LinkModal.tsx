import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useModalStore } from "@/store";
import { Link } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";
import { toast } from "../ui/use-toast";
import type { LinkModalProps } from "./interfaces";

const LinkModal = ({ injectLinkContent, selection }: LinkModalProps) => {
	// State
	const { showLinkForm, setShowLinkForm } = useModalStore((state) => state);

	const [linkName, setLinkName] = useState("");
	const [linkUrl, setLinkUrl] = useState("");

	// Helper Functions

	const handleInjectLinkContent = () => {
		const urlFormat =
			/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:[0-9]{1,5})?(\/\S*)?$/;
		if (!linkUrl.match(urlFormat)) {
			toast({
				title: "Invalid Link",
				description: "Please provide a valid link.",
				variant: "destructive",
			});
			return;
		}
		injectLinkContent(linkName, linkUrl);
		setShowLinkForm(false);
	};

	const handleOpenChange = (linkFormState: boolean) => {
		if (!selection) {
			toast({
				title: "Place text cursor",
				description:
					"Place a text cursor in the designated area to insert the link",
				variant: "destructive",
			});
			return;
		}
		setShowLinkForm(linkFormState);
	};
	return (
		<Dialog open={showLinkForm} onOpenChange={handleOpenChange}>
			<DialogTrigger>
				<Button
					variant="ghost"
					size="icon"
					className={`size-8 ${showLinkForm ? "" : "text-muted-foreground"}`}
					onMouseDown={(e) => e.preventDefault()}
				>
					<Link className="size-4" />
					<span className="sr-only">Link</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="!w-3/12 bg-popover p-5 pt-1 h-auto border border-secondary rounded-lg">
				<DialogHeader className="ml-2">
					<DialogTitle className="!mt-5 !text-2xl leading-3">
						Insert Link
					</DialogTitle>
				</DialogHeader>
				<div className="h-auto w-full mt-5">
					<input
						type="text"
						className="bg-popover w-full h-10 border border-muted pl-5 py-2 text-md rounded-lg mb-4"
						placeholder="Link text"
						value={linkName}
						onChange={(e) => setLinkName(e.target.value)}
					/>
					<input
						type="text"
						className="bg-popover w-full h-10 border border-secomutedndary pl-5 py-2 text-md rounded-lg mb-8"
						placeholder="URL"
						value={linkUrl}
						onChange={(e) => setLinkUrl(e.target.value)}
					/>
					<Button
						className="w-full h-10 mb-3"
						onClick={handleInjectLinkContent}
						disabled={!(linkName.length > 0 && linkUrl.length > 0)}
					>
						Insert
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default LinkModal;
