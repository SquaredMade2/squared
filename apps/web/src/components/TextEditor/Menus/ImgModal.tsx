import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "../../ui/input";
import type { ImgModalProps } from "../interfaces";

export default function ImgModal({ injectImgContent }: ImgModalProps) {
	const [showImgForm, setShowImgForm] = useState(false);
	const [currentImg, setCurrentImg] = useState<File | null>(null);

	// Helper

	const handleImgForm = () => {
		currentImg && injectImgContent(currentImg);
		setShowImgForm(false);
	};
	return (
		<Dialog open={showImgForm} onOpenChange={setShowImgForm}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className={`size-8 ${showImgForm ? "" : "text-muted-foreground"}`}
					onMouseDown={(e) => e.preventDefault()}
				>
					{/* <Link className="size-4" /> */}
					<span className="sr-only"> Image </span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="ml-2">
					<DialogTitle className="!mt-5 !text-2xl leading-3">
						Insert Link
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={(e) => e.preventDefault()}>
					<Input
						type="file"
						accept="image/*"
						onChange={(e) =>
							e.target.files?.[0] && setCurrentImg(e.target.files?.[0])
						}
						className="max-w-[200px]"
					/>
					<Button
						className="mb-3 h-10 w-full"
						onClick={handleImgForm}
						disabled={!currentImg}
					>
						Insert
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
