import { useContext } from "react";
import UserNotAllowedModal from "@/components/UserNotAllowedModal";
import AmendCommentDropdown from "@/components/AmendCommentDropdown";
import { Ellipsis } from "lucide-react";
import { EditorContext } from "@/components/EditorContext";
import { useTheme } from "next-themes";

const AmendCommentButton = (): React.ReactElement => {
	const { theme } = useTheme();
	const {
		authorId,
		userId,
		showEditDeleteDropdown,
		handleShowEditDeleteDropdown,
	} = useContext(EditorContext);

	return (
		<>
			<div className="transition-all duration-300 ease-in-out">
				<button
					type="button"
					className={`absolute flex justify-center top-4 right-4 border border-transparent w-[30px] rounded-lg hover:bg-card hover:border hover:border-border hover:cursor-pointer transform transition-transform duration-300 ${showEditDeleteDropdown ? "rotate-90" : ""}`}
					onClick={() => handleShowEditDeleteDropdown()}
				>
					<Ellipsis className={theme === "light" ? "black" : "white"} />
				</button>
				{authorId === userId && showEditDeleteDropdown && (
					<AmendCommentDropdown />
				)}
			</div>
			{authorId !== userId && showEditDeleteDropdown && (
				<UserNotAllowedModal
					handleShowDropdown={handleShowEditDeleteDropdown}
				/>
			)}
		</>
	);
};

export default AmendCommentButton;
