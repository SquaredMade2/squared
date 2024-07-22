import NewIssuePopUpCloseModal from '@/components/NewIssuePopUpCloseModal';
import { deleteIcon } from '@/components/Svg';
import type { NewIssueCloseButtonProps } from './NewIssueCloseButton.interfaces';

const styles = { button: 'hover:bg-accent rounded cursor-pointer' };

const NewIssueCloseButton = ({
  showCloseModal,
  handleCloseClick,
  handleCancelClose,
  handleDiscard,
}: NewIssueCloseButtonProps) => {
  return (
    <>
      <button className={styles.button} onClick={handleCloseClick} type="button">
        {deleteIcon()}
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
