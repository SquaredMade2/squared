import EditedCommentCancelButton from '@/components/EditedCommentCancelButton';
import EditedCommentSaveButton from '@/components/EditedCommentSaveButton';

const styles = {
  cancelSaveButtonContainer:
    'absolute flex bottom-4 right-4 border border-border px-2 py-1 rounded-lg bg-card  text-sm text-muted-foreground font-medium z-10',
};

const EditMenu = () => {
  return (
    <div className={styles.cancelSaveButtonContainer}>
      <EditedCommentSaveButton />
      <EditedCommentCancelButton />
    </div>
  );
};

export default EditMenu;
