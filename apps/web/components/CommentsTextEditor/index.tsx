import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { ImageNode } from '@/components/CommentsTextEditor/nodes/imageNode';
import EditorTailwindTheme from '@/components/CommentsTextEditor/themes/EditorTailwindTheme';
import ListMaxIndentLevelPlugin from '@/components/CommentsTextEditor/plugins/listMaxLevelIndex';
import CodeHighlightPlugin from '@/components/CommentsTextEditor/plugins/codeHighlight';
import AutoLinkPlugin from '@/components/CommentsTextEditor/plugins/autolink';
import type { EditorProps } from '@/components/CommentsTextEditor/TextEditor.interfaces';
import { EditorProvider } from '@/components/EditorContext';
import EditorDisplayPlugin from '@/components/CommentsTextEditor/plugins/EditorDisplay';

export const defaultEditorState =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const CommentsTextEditor = ({
  placeholderText = '',
  initialState = '',
  authorId = '',
  commentId = '',
  userId = '',
  userName = '',
  commentsTaskId = '',
  commentDate = '',
}: EditorProps) => {
  //Fallback State incase InitialState isn't supplied
  const editorStateString = initialState || defaultEditorState;
  const hasInitialState = !!initialState;

  const editorConfig = {
    namespace: 'text-editor',
    theme: EditorTailwindTheme,
    editorState: editorStateString,
    editable: !hasInitialState,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      ImageNode,
    ],
    onError(error: Error) {
      throw error;
    },
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <EditorProvider
        authorId={authorId}
        commentId={commentId}
        userId={userId}
        userName={userName}
        commentsTaskId={commentsTaskId}
        commentDate={commentDate}
        initialState={initialState}
        placeholderText={placeholderText}
      >
        <EditorDisplayPlugin />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <CodeHighlightPlugin />
        <ListPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </EditorProvider>
    </LexicalComposer>
  );
};

export default CommentsTextEditor;
