import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useModalStore } from "@/store";
import { verifyUrlFormat } from "@/utils/formatting";
import { Link } from "lucide-react";
import { useState } from "react";
import type { LinkModalProps } from "../interfaces";

const LinkModal = ({ injectLinkContent, selection }: LinkModalProps) => {
	// State
	const { showLinkForm, setShowLinkForm } = useModalStore((state) => state);

	const [linkName, setLinkName] = useState("");
	const [linkUrl, setLinkUrl] = useState("");

	// Helper Functions

	const handleInjectLinkContent = () => {
		if (!verifyUrlFormat(linkUrl)) {
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
			<DialogContent className="!w-3/12 h-auto rounded-lg border border-secondary bg-popover p-5 pt-1">
				<DialogHeader className="ml-2">
					<DialogTitle className="!mt-5 !text-2xl leading-3">
						Insert Link
					</DialogTitle>
				</DialogHeader>
				<div className="mt-5 h-auto w-full">
					<input
						type="text"
						className="mb-4 h-10 w-full rounded-lg border border-muted bg-popover py-2 pl-5 text-md"
						placeholder="Link text"
						value={linkName}
						onChange={(e) => setLinkName(e.target.value)}
					/>
					<input
						type="text"
						className="mb-8 h-10 w-full rounded-lg border border-secomutedndary bg-popover py-2 pl-5 text-md"
						placeholder="URL"
						value={linkUrl}
						onChange={(e) => setLinkUrl(e.target.value)}
					/>
					<Button
						className="mb-3 h-10 w-full"
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
