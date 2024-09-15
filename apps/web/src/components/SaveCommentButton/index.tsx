// import { useContext } from "react";
// import { EditorContext } from "@/components/EditorContext";
// import { Button } from "../ui/button";

// const SaveCommentButton = ({
// 	getEditorTextContent,
// }: {
// 	getEditorTextContent: () => string;
// }): React.ReactElement => {
// 	const { handleCreateCommentFromEditor } = useContext(EditorContext);

// 	const handleClick = () => {
// 		const content = getEditorTextContent().trim();
// 		if (content.length > 0 && handleCreateCommentFromEditor) {
// 			handleCreateCommentFromEditor();
// 		}
// 	};

// 	return <Button onClick={handleClick}>Save</Button>;
// };

// export default SaveCommentButton;
