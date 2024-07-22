import { useContext } from 'react';
import { EditorContext } from '@/components/EditorContext';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';

const styles = {
  button:
    'absolute bottom-4 right-12 py-1.5 px-5 rounded-md border border-blueGlow focus:shadow-sm active:shadow-lg cursor-pointer hover:shadow-glow text-blue',
};

const SaveCommentButton = ({
  getEditorTextContent,
}: {
  getEditorTextContent: () => string;
}): React.ReactElement => {
  const { handleCreateCommentFromEditor } = useContext(EditorContext);
  const { theme } = useAppSelector((state) => state.userSettings);

  const handleClick = () => {
    const content = getEditorTextContent().trim();
    if (content.length > 0 && handleCreateCommentFromEditor) {
      handleCreateCommentFromEditor();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.button} ${theme === 'dark' ? 'bg-blueGlow' : 'bg-blueGlowLight'}`}
    >
      Save
    </button>
  );
};

export default SaveCommentButton;
