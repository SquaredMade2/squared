import type { NewIssuePopUpCloseModalProps } from "./NewIssuePopUpCloseModal.interfaces";

const NewIssuePopUpCloseModal = ({
	handleDiscard,
	handleCancelClose,
}: NewIssuePopUpCloseModalProps) => {
	return (
		<>
			<div className="absolute top-[140px] right-[150px] z-[100] w-[430.4px] h-[150px] border border-border bg-card py-4 px-6 rounded-lg">
				<div className="text-foreground text-base mb-2">Save Draft?</div>
				<div className="text-muted-foreground text-md">
					Would you like to save a draft of this issue?
				</div>
				<div className="flex flex-row justify-between mt-6">
					<div>
						<button
							type="button"
							className="px-2 py-1 border border-border bg-background hover:bg-taskHover shadow-md rounded-lg"
							onClick={handleDiscard}
						>
							Discard
						</button>
					</div>
					<div>
						<button
							type="button"
							className="px-2 py-1 border border-border bg-background hover:bg-taskHover shadow-md rounded-lg"
							onClick={handleCancelClose}
						>
							Cancel
						</button>
						<button
							type="button"
							className="px-2 py-1 bg-blueButton hover:bg-blueButtonHover text-foreground shadow-md rounded-lg ml-2"
						>
							Save draft
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default NewIssuePopUpCloseModal;
