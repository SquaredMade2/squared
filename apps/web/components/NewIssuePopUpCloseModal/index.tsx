import type { NewIssuePopUpCloseModalProps } from './NewIssuePopUpCloseModal.interfaces';

const styles = {
  container:
    'absolute top-[140px] right-[150px] z-[2] w-[430.4px] h-[150px] border border-border bg-card py-4 px-6 rounded-lg',
  buttonContainer: 'flex flex-row justify-between mt-6',
  header: 'text-foreground text-base mb-2',
  subHeader: 'text-muted-foreground text-md',
  buttonGrey:
    'px-2 py-1 border border-border bg-background hover:bg-taskHover shadow-md rounded-lg',
  buttonBlue:
    'px-2 py-1 bg-blueButton hover:bg-blueButtonHover text-white shadow-md rounded-lg ml-2',
};

const NewIssuePopUpCloseModal = ({
  showCloseModal,
  handleDiscard,
  handleCancelClose,
}: NewIssuePopUpCloseModalProps) => {
  return (
    <>
      {showCloseModal && (
        <div className={styles.container}>
          <div className={styles.header}>Save Draft?</div>
          <div className={styles.subHeader}>Would you like to save a draft of this issue?</div>
          <div className={styles.buttonContainer}>
            <div>
              <button type="button" className={styles.buttonGrey} onClick={handleDiscard}>
                Discard
              </button>
            </div>
            <div>
              <button type="button" className={styles.buttonGrey} onClick={handleCancelClose}>
                Cancel
              </button>
              <button type="button" className={styles.buttonBlue}>
                Save draft
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewIssuePopUpCloseModal;
