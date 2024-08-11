import EditedCommentCancelButton from "@/components/EditedCommentCancelButton";
import EditedCommentSaveButton from "@/components/EditedCommentSaveButton";

const EditMenu = () => {
  return (
    <div className="absolute flex bottom-4 right-4 border border-border px-2 py-1 rounded-lg bg-card  text-sm text-muted-foreground font-medium z-10">
      <EditedCommentSaveButton />
      <EditedCommentCancelButton />
    </div>
  );
};

export default EditMenu;
