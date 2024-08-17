import { useContext } from "react";
import { EditorContext } from "@/components/EditorContext";

const EditedCommentSaveButton = () => {
	const { handleUpdateCommentFromEditor } = useContext(EditorContext);

	return (
		<button
			type="button"
			className="py-0.5 px-1.5 border border-transparent rounded-lg hover:border-border hover:bg-background"
			onClick={handleUpdateCommentFromEditor}
		>
			Save
		</button>
	);
};

export default EditedCommentSaveButton;
