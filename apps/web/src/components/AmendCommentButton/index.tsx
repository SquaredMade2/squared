import { useContext } from "react";
import UserNotAllowedModal from "@/components/UserNotAllowedModal";
import AmendCommentDropdown from "@/components/AmendCommentDropdown";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { EditorContext } from "@/components/EditorContext";
import { Ellipsis } from "lucide-react";

const styles = {
  amendCommentButton:
    "absolute flex justify-center top-4 right-4 border border-transparent w-[30px] rounded-lg hover:bg-card hover:border hover:border-border hover:cursor-pointer transform transition-transform duration-300",
  rotate: "rotate-90",
  amendCommentContainer: "transition-all duration-300 ease-in-out",
  ellipsis: "white",
};

const AmendCommentButton = (): React.ReactElement => {
  const theme = useAppSelector((state) => state.userSettings.theme);
  const {
    authorId,
    userId,
    showEditDeleteDropdown,
    handleShowEditDeleteDropdown,
  } = useContext(EditorContext);

  return (
    <>
      <div className={styles.amendCommentContainer}>
        <button
          title="Title"
          type="button"
          className={`${styles.amendCommentButton} ${showEditDeleteDropdown ? "rotate-90" : ""}`}
          onClick={() => handleShowEditDeleteDropdown()}
        >
          <Ellipsis
            className={`size-4 ${theme === "light" ? "text-[black]" : "text-[white]"} `}
          />
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
