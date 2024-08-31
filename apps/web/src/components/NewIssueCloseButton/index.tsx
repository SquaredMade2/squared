import NewIssuePopUpCloseModal from "@/components/NewIssuePopUpCloseModal";
import type { NewIssueCloseButtonProps } from "./NewIssueCloseButton.interfaces";
import { X } from "lucide-react";

const NewIssueCloseButton = ({
	showCloseModal,
	handleCloseClick,
	handleCancelClose,
	handleDiscard,
}: NewIssueCloseButtonProps) => {
	return (
		<>
			<button
				className="hover:bg-accent rounded cursor-pointer"
				onClick={handleCloseClick}
				type="button"
				title="Title"
			>
				<X className="size-5 cursor-pointer" />
			</button>
			<NewIssuePopUpCloseModal
				handleCloseClick={handleCancelClose}
				handleCancelClose={handleCancelClose}
				handleDiscard={handleDiscard}
			/>
		</>
	);
};

export default NewIssueCloseButton;
