import { useContext } from "react";
import ConfirmDeleteCommentModal from "@/components/ConfirmDeleteCommentModal";
import { ClickAwayListener } from "@mui/base";
import { EditorContext } from "@/components/EditorContext";

const AmendCommentDropdown = (): React.ReactElement => {
	const {
		showConfirmDeleteDropdown,
		handleShowConfirmDeleteDropdown,
		handleEditAndDropdown,
		handleShowEditDeleteDropdown,
	} = useContext(EditorContext);

	return (
		<>
			<ClickAwayListener onClickAway={() => handleShowEditDeleteDropdown()}>
				<div className="overflow-hidden absolute border border-border right-4 top-4 px-2 py-1 rounded-lg bg-card text-sm text-muted-foreground font-medium">
					<button
						type="button"
						onClick={() => handleShowConfirmDeleteDropdown()}
						className="py-0.5 px-1.5 border border-transparent rounded-lg hover:border-red-500 hover:bg-background"
					>
						Delete
					</button>
					<button
						type="button"
						onClick={() => handleEditAndDropdown()}
						className="py-0.5 px-1.5 ml-6 border border-transparent rounded-lg hover:border-border hover:bg-background"
					>
						Edit
					</button>
				</div>
			</ClickAwayListener>
			{showConfirmDeleteDropdown && <ConfirmDeleteCommentModal />}
		</>
	);
};

export default AmendCommentDropdown;
