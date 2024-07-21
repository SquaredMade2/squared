import { useContext } from 'react';
import { EditorContext } from '@/components/EditorContext';

const styles = {
  saveButton:
    'py-0.5 px-1.5 border border-transparent rounded-lg hover:border-border hover:bg-background',
};

const EditedCommentSaveButton = () => {
  const { handleUpdateCommentFromEditor } = useContext(EditorContext);

  return (
    <button type="button" className={styles.saveButton} onClick={handleUpdateCommentFromEditor}>
      Save
    </button>
  );
};

export default EditedCommentSaveButton;
