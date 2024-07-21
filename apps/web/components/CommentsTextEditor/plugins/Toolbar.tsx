import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $wrapNodes, $isAtNodeEnd } from '@lexical/selection';
import { $createHeadingNode, $isHeadingNode, type HeadingTagType } from '@lexical/rich-text';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  type LexicalEditor,
  type BaseSelection,
  type RangeSelection,
} from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list';
import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faBold,
  faChevronDown,
  faItalic,
  faLink,
  faListOl,
  faListUl,
  faStrikethrough,
  faUnderline,
} from '@fortawesome/free-solid-svg-icons';
import toolbarStyles from '@/components/CommentsTextEditor/plugins/Toolbar.styles';
import '@/components/CommentsTextEditor/themes/linkEditorTheme.css';

const LowPriority = 1;

const supportedBlockTypes = new Set<string>([
  'paragraph',
  'quote',
  'code',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'ul',
  'ol',
]);

const blockTypeToBlockName: { [key: string]: string } = {
  code: 'Code Block',
  h1: 'Largest',
  h2: 'Larger',
  h3: 'Medium',
  h4: 'Smaller',
  h5: 'Smallest',
  ol: 'Number',
  ul: 'Bulletin',
  paragraph: 'Normal',
  quote: 'Quote',
};

function Divider() {
  return <div className="divider" />;
}

export function positionEditorElement(editor: HTMLElement, rect: DOMRect | null): void {
  if (rect === null) {
    editor.className = toolbarStyles.setLinkEditorHidden;
  } else {
    editor.style.opacity = '1';
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
}

interface FloatingLinkEditorProps {
  editor: LexicalEditor;
}

function FloatingLinkEditor({ editor }: FloatingLinkEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mouseDownRef = useRef<boolean>(false);
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [isEditMode, setEditMode] = useState<boolean>(true);
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl('');
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (nativeSelection) {
      if (
        selection !== null &&
        !nativeSelection?.isCollapsed &&
        rootElement !== null &&
        rootElement.contains(nativeSelection.anchorNode)
      ) {
        const domRange = nativeSelection.getRangeAt(0);
        let rect: DOMRect;
        if (nativeSelection.anchorNode === rootElement) {
          let inner = rootElement;
          while (inner.firstElementChild != null) {
            inner = inner.firstElementChild as HTMLElement;
          }
          rect = inner.getBoundingClientRect();
        } else {
          rect = domRange.getBoundingClientRect();
        }

        if (!mouseDownRef.current) {
          positionEditorElement(editorElem, rect);
        }
        setLastSelection(selection);
      } else if (!activeElement || activeElement.className !== 'link-input') {
        positionEditorElement(editorElem, null);
        setLastSelection(null);
        setEditMode(false);
        setLinkUrl('');
      }
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority,
      ),
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div ref={editorRef} className="link-editor">
      {isEditMode ? (
        <input
          ref={inputRef}
          className="link-input"
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== '') {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === 'Escape') {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <>
          <div className="link-input">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <div
              className="link-edit"
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  }
  return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
}

interface BlockOptionsDropdownListProps {
  editor: LexicalEditor;
  blockType: string;
  toolbarRef: React.RefObject<HTMLDivElement>;
  setShowBlockOptionsDropDown: React.Dispatch<React.SetStateAction<boolean>>;
}

function BlockOptionsDropdownList({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown,
}: BlockOptionsDropdownListProps) {
  const dropDownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event: MouseEvent) => {
        const target = event.target as Node;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false);
        }
      };
      document.addEventListener('click', handle);

      return () => {
        document.removeEventListener('click', handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatHeading = (heading: HeadingTagType) => {
    if (blockType !== heading) {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode(heading));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  return (
    <div className={toolbarStyles.dropdown} ref={dropDownRef}>
      <button type="button" className={toolbarStyles.dropdownItem} onClick={formatParagraph}>
        <span className={toolbarStyles.dropdownText}>Normal</span>
        {blockType === 'paragraph' && <span className="active" />}
      </button>
      <button
        type="button"
        className={toolbarStyles.dropdownItem}
        onClick={() => formatHeading('h1')}
      >
        <span className={toolbarStyles.dropdownText}>Largest</span>
      </button>
      <button
        type="button"
        className={toolbarStyles.dropdownItem}
        onClick={() => formatHeading('h2')}
      >
        <span className={toolbarStyles.dropdownText}>Larger</span>
        {blockType === 'h2' && <span className="active" />}
      </button>
      <button
        type="button"
        className={toolbarStyles.dropdownItem}
        onClick={() => formatHeading('h3')}
      >
        <span className={toolbarStyles.dropdownText}>Medium</span>
        {blockType === 'h3' && <span className="active" />}
      </button>
      <button
        type="button"
        className={toolbarStyles.dropdownItem}
        onClick={() => formatHeading('h4')}
      >
        <span className={toolbarStyles.dropdownText}>Smaller</span>
        {blockType === 'h4' && <span className="active" />}
      </button>
      <button
        type="button"
        className={toolbarStyles.dropdownItem}
        onClick={() => formatHeading('h5')}
      >
        <span className={toolbarStyles.dropdownText}>Smallest</span>
        {blockType === 'h5' && <span className="active" />}
      </button>
    </div>
  );
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [blockType, setBlockType] = useState<string>('paragraph');
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState<boolean>(false);
  const [isLink, setIsLink] = useState<boolean>(false);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false);
  const [isOl, setIsOl] = useState<boolean>(false);
  const [isUl, setIsUl] = useState<boolean>(false);

  const formatNumberedList = () => {
    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          setBlockType(type);
        }
      }
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsOl(selection.hasFormat('bold'));
      setIsUl(selection.hasFormat('bold'));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
    );
  }, [editor, updateToolbar]);

  const getActive = (state: boolean) => {
    return state ? toolbarStyles.activeToolbarItem : toolbarStyles.inactiveToolbarItem;
  };

  return (
    <div className={toolbarStyles.toolbar} ref={toolbarRef}>
      {supportedBlockTypes.has(blockType) && (
        <>
          <button
            type="button"
            className={toolbarStyles.inactiveToolbarItem}
            onClick={() => setShowBlockOptionsDropDown(!showBlockOptionsDropDown)}
            aria-label="Formatting Options"
          >
            <div className={toolbarStyles.dropdownButton}>
              <span className={`icon block-type ${blockType}`} />
              <span className="text">{blockTypeToBlockName[blockType]}</span>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
          </button>
          {showBlockOptionsDropDown &&
            createPortal(
              <BlockOptionsDropdownList
                editor={editor}
                blockType={blockType}
                toolbarRef={toolbarRef}
                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
              />,
              document.body,
            )}
          <Divider />
        </>
      )}
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={getActive(isBold)}
        aria-label="Format Bold"
      >
        <FontAwesomeIcon icon={faBold} />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={getActive(isItalic)}
        aria-label="Format Italics"
      >
        <FontAwesomeIcon icon={faItalic} />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={getActive(isUnderline)}
        aria-label="Format Underline"
      >
        <FontAwesomeIcon icon={faUnderline} />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={getActive(isStrikethrough)}
        aria-label="Format Strikethrough"
      >
        <FontAwesomeIcon icon={faStrikethrough} />
      </button>
      <button type="button" className={getActive(isOl)} onClick={formatNumberedList}>
        <span className="icon numbered-list" />
        <FontAwesomeIcon icon={faListOl} />
        {blockType === 'ol' && <span className="active" />}
      </button>
      <button
        type="button"
        onClick={formatBulletList}
        className={getActive(isUl)}
        aria-label="Insert Link"
      >
        <FontAwesomeIcon icon={faListUl} />
      </button>
      <Divider />
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className={toolbarStyles.inactiveToolbarItem}
        aria-label="Left Align"
      >
        <FontAwesomeIcon icon={faAlignLeft} />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className={toolbarStyles.inactiveToolbarItem}
        aria-label="Center Align"
      >
        <FontAwesomeIcon icon={faAlignCenter} />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className={toolbarStyles.inactiveToolbarItem}
        aria-label="Right Align"
      >
        <FontAwesomeIcon icon={faAlignRight} />
      </button>
      <button
        type="button"
        onClick={insertLink}
        className={getActive(isLink)}
        aria-label="Insert Link"
      >
        <FontAwesomeIcon icon={faLink} />
      </button>
      {isLink && createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
    </div>
  );
}
