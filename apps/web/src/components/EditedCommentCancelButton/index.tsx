import { useContext } from 'react';
import { EditorContext } from '@/components/EditorContext';

const styles = {
  cancelButton:
    'py-0.5 px-1.5 ml-6 border border-transparent rounded-lg  hover:border-red-500 hover:bg-background',
};

const EditedCommentCancelButton = () => {
  const { handleCancelCommentUpdate } = useContext(EditorContext);

  return (
    <button type="button" className={styles.cancelButton} onClick={handleCancelCommentUpdate}>
      Cancel
    </button>
  );
};

export default EditedCommentCancelButton;
