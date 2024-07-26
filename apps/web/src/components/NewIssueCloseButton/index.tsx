import NewIssuePopUpCloseModal from "@/components/NewIssuePopUpCloseModal";
import type { NewIssueCloseButtonProps } from "./NewIssueCloseButton.interfaces";
import { X } from "lucide-react";

const styles = { button: "hover:bg-accent rounded cursor-pointer" };

const NewIssueCloseButton = ({
  showCloseModal,
  handleCloseClick,
  handleCancelClose,
  handleDiscard,
}: NewIssueCloseButtonProps) => {
  return (
    <>
      <button
        className={styles.button}
        onClick={handleCloseClick}
        type="button"
        title="Title"
      >
        <X className="size-5 cursor-pointer" />
      </button>
      <NewIssuePopUpCloseModal
        showCloseModal={showCloseModal}
        handleCancelClose={handleCancelClose}
        handleDiscard={handleDiscard}
      />
    </>
  );
};

export default NewIssueCloseButton;
