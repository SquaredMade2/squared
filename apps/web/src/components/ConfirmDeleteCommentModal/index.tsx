// import { useContext } from "react";
// import { EditorContext } from "@/components/EditorContext";

// const ConfirmDeleteCommentModal = (): React.ReactElement => {
// 	const { handleDeleteComment, handleShowConfirmDeleteDropdown } =
// 		useContext(EditorContext);

// 	return (
// 		<div className="absolute -top-10 right-4 flex flex-col items-center border border-red-500 rounded-lg p-4 bg-card">
// 			<p className="text-sm text-foreground font-medium">
// 				Are you sure you want to delete the comment?
// 			</p>
// 			<div className="flex space-x-10 text-md text-muted-foreground font-medium mt-2">
// 				<button
// 					type="button"
// 					className="py-1 px-2 border border-transparent rounded-lg hover:border-border hover:bg-background hover:text-foreground"
// 					onClick={() => {
// 						handleDeleteComment();
// 					}}
// 				>
// 					Yes
// 				</button>
// 				<button
// 					type="button"
// 					className="py-1 px-2 ml-6 border border-transparent rounded-lg hover:border-border hover:bg-background hover:text-foreground"
// 					onClick={() => handleShowConfirmDeleteDropdown}
// 				>
// 					No
// 				</button>
// 			</div>
// 		</div>
// 	);
// };

// export default ConfirmDeleteCommentModal;
