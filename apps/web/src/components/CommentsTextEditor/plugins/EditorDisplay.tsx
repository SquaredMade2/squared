import { useContext, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import AmendCommentButton from '@/components/AmendCommentButton';
import EditMenu from '@/components/EditMenu';
import SaveCommentButton from '@/components/SaveCommentButton';
import ProfileImage from '@/components/ProfileImage';
import TimestampDisplay from '@/components/TimeStampDisplay';
import UploadButton from '@/components/UploadButton';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import ToolbarPlugin from '@/components/CommentsTextEditor/plugins/Toolbar';
import { EditorContext } from '@/components/EditorContext';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { PlaceholderPlugin } from '@/components/CommentsTextEditor/plugins/Placeholder';
import { $getRoot } from 'lexical';

const styles = {
  outerEditor: 'flex flex-col justify-center w-full my-2',
  editorContainer: 'flex m-0 p-0 relative',
  editorInput:
    'relative h-auto w-full p-4 pt-6 text-foreground leading-5 font-normal text-base text-left outline-none caret-primary tab-normal overflow-auto break-words rounded-lg border border-border bg-accent',
  editorPlaceholder:
    'text-gray-400 absolute top-6 left-14 text-base select-none inline-block pointer-events-none',
  toolbar: 'w-6/12',
  toolbarWrapper: 'w-full flex justify-center',
  newComment: 'min-h-[150px]',
};

const EditorDisplayPlugin = (): React.ReactElement => {
  const [editor] = useLexicalComposerContext();
  const {
    commentDate,
    showToolbar,
    showEditMenu,
    userName,
    placeholderText,
    initialState,
    isEditable,
  } = useContext(EditorContext);

  const getEditorTextContent = useCallback(() => {
    let content = '';
    editor.update(() => {
      const root = $getRoot();
      content = root.getTextContent();
    });
    return content;
  }, [editor]);

  return (
    <div className={styles.outerEditor}>
      {commentDate && <TimestampDisplay />}
      {showToolbar && (
        <div className={styles.toolbarWrapper}>
          <div className={styles.toolbar}>
            <ToolbarPlugin />
          </div>
        </div>
      )}
      <div className={styles.editorContainer}>
        <ProfileImage profileName={userName} location="comment" />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={`${styles.editorInput} ${isEditable ? '' : styles.newComment}`}
            />
          }
          placeholder={<PlaceholderPlugin placeholderText={placeholderText || ''} />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        {initialState ? (
          <>
            <AmendCommentButton />
            <div>{showEditMenu && <EditMenu />}</div>
          </>
        ) : (
          <>
            <SaveCommentButton getEditorTextContent={getEditorTextContent} />
            <UploadButton />
          </>
        )}
      </div>
    </div>
  );
};

export default EditorDisplayPlugin;
