import { useContext } from 'react';
import { EditorContext } from '@/components/EditorContext';

const styles = {
  container:
    'absolute -top-10 right-4 flex flex-col items-center border border-red-500 rounded-lg p-4 bg-card',
  text: 'text-sm text-foreground font-medium',
  buttonContainer: 'flex space-x-10 text-md text-muted-foreground font-medium mt-2',
  yesButton:
    'py-1 px-2 border border-transparent rounded-lg hover:border-border hover:bg-background hover:text-foreground',
  noButton:
    'py-1 px-2 ml-6 border border-transparent rounded-lg hover:border-border hover:bg-background hover:text-foreground',
};

const ConfirmDeleteCommentModal = (): React.ReactElement => {
  const { handleDeleteComment, handleShowConfirmDeleteDropdown } = useContext(EditorContext);

  return (
    <div className={styles.container}>
      <p className={styles.text}>Are you sure you want to delete the comment?</p>
      <div className={styles.buttonContainer}>
        <button
          type="button"
          className={styles.yesButton}
          onClick={() => {
            handleDeleteComment();
          }}
        >
          Yes
        </button>
        <button
          type="button"
          className={styles.noButton}
          onClick={() => handleShowConfirmDeleteDropdown}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeleteCommentModal;
