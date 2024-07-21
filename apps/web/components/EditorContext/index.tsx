import type React from 'react';
import { createContext, useEffect, useState } from 'react';
import { format, differenceInMinutes, differenceInHours } from 'date-fns';
import axios from 'axios';
import {
  $createRangeSelection,
  $getRoot,
  $setSelection,
  ElementNode,
  type RootNode,
  TextNode,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import type { NewComment } from '@/components/Comments/Comments.interfaces';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { defaultEditorState } from '@/components/CommentsTextEditor';
import { useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import type { ImageDataObject } from '@/components/UploadButton/UploadButton.interfaces';
import { $createImageNode } from '@/components/CommentsTextEditor/nodes/imageNode';
import { createComment, deleteComment, updateComment } from '@/store/events/actions';
import type {
  EditorContextType,
  EditorProviderProps,
} from '@/components/EditorContext/EditorContext.interfaces';

export const EditorContext = createContext<EditorContextType>({
  closeUpdateComment: () => {
    console.warn('closeUpdateComment not implemented');
  },
  openEditMenu: () => {
    console.warn('openEditMenu not implemented');
  },
  toggleToolbar: () => {
    console.warn('toggleToolbar not implemented');
  },
  handleShowConfirmDeleteDropdown: () => {
    console.warn('handleShowConfirmDeleteDropdown not implemented');
  },
  handleCreateCommentFromEditor: () => {
    console.warn('handleCreateComment function not implemented');
  },
  handleEditAndDropdown: () => {
    console.warn('handleEditAndDropdown Comment not implemented');
  },
  handleShowEditDeleteDropdown: () => {
    console.warn('handleEditAndDropdown Comment not implemented');
  },
  handleUpdateCommentFromEditor: () => {
    console.warn('handleUpdateCommentFromEditor Comment not implemented');
  },
  handleCancelCommentUpdate: () => {
    console.warn('handleCancelCommentUpdate Comment not implemented');
  },
  handleDeleteComment: () => {
    console.warn('handleDeleteComment Comment not implemented');
  },
  handleImageUpload: async () => {
    console.warn('handleImageUpload not implemented');
  },
  setTimeDisplay: () => {
    console.warn('handleCreateComment function not implemented');
  },
  display: () => {
    return 'Generate Date not implemented';
  },
  authorId: 'AuthorID not set',
  userId: 'userID not set',
  commentId: 'commentId not set',
  commentDate: 'commentDate not set',
  userName: 'userName',
  initialState: 'initialState not set',
  placeholderText: 'placeholderText not set',
  showToolbar: false,
  showEditMenu: false,
  showEditDeleteDropdown: false,
  showConfirmDeleteDropdown: false,
  mediaError: {
    imageUploadsExceeded: false,
    fileSizeExceeded: false,
  },
  isEditable: false,
});

export const EditorProvider = ({
  children,
  commentsTaskId,
  userId,
  authorId,
  commentDate,
  commentId,
  initialState,
  placeholderText,
  ...props
}: EditorProviderProps) => {
  const [editor] = useLexicalComposerContext();
  const [minutesAgo, setMinutesAgo] = useState(0);
  const [hoursAgo, setHoursAgo] = useState(0);
  const [showToolbar, setShowToolbar] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showEditDeleteDropdown, setShowEditDeleteDropdown] = useState(false);
  const [showConfirmDeleteDropdown, setShowConfirmDeleteDropdown] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState({});
  const [mediaError, setMediaError] = useState({
    imageUploadsExceeded: false,
    fileSizeExceeded: false,
  });
  const initialIsEditable = !!initialState;
  const [isEditable, setIsEditable] = useState(initialIsEditable);
  const dispatch = useAppDispatch();

  const MAX_FILE_SIZE = 5242880;

  //Toggle Dropdown/Toolbar Logic
  const closeUpdateComment = (): void => {
    setShowToolbar(false);
    setShowEditMenu(false);
  };

  const openEditMenu = (): void => {
    setShowEditMenu(true);
  };

  const toggleToolbar = (): void => {
    setShowToolbar((prevState) => !prevState);
  };

  const handleShowConfirmDeleteDropdown = (): void => {
    setShowConfirmDeleteDropdown((prevState) => !prevState);
  };

  const handleShowEditDeleteDropdown = (): void => {
    setShowEditDeleteDropdown((prevState) => !prevState);
  };

  useEffect(() => {
    if (!initialState) {
      setShowToolbar(true);
    }
  }, []);

  //Save Comment Logic
  const handleCreateComment = (editorString: string): void => {
    if (commentsTaskId && userId) {
      try {
        const newComment: NewComment = {
          comment: editorString,
          author: userId,
          task: commentsTaskId,
        };
        dispatch(createComment(newComment));
      } catch (err) {}
    }
  };

  const handleCreateCommentFromEditor = async (): Promise<void> => {
    const editorState = JSON.stringify(editor.getEditorState());
    if (handleCreateComment) {
      handleCreateComment(editorState);
    }
    const resetEditorState = editor.parseEditorState(defaultEditorState);
    editor.setEditorState(resetEditorState);
  };

  //Edit Comment Logic
  const handleEditAndDropdown = (): void => {
    editor.setEditable(true);
    setIsEditable(true);
    toggleToolbar();
    handleShowEditDeleteDropdown();
    openEditMenu();
    //Makes sure text caret is placed at the end of text selection
    editor.update(() => {
      const rootNode = $getRoot();
      if (!rootNode) {
        return;
      }
      let lastNode: RootNode | null = rootNode;
      while (lastNode && lastNode instanceof ElementNode && lastNode.getLastChild()) {
        lastNode = lastNode.getLastChild();
      }
      const rangeSelection = $createRangeSelection();
      if (lastNode instanceof TextNode) {
        // If the last node is a text node
        const textLength = lastNode.getTextContent().length;
        rangeSelection.anchor.set(lastNode.getKey(), textLength, 'text');
        rangeSelection.focus.set(lastNode.getKey(), textLength, 'text');
      } else if (lastNode) {
        // If the last node is not a text node and not null
        rangeSelection.anchor.set(lastNode.getKey(), 0, 'element');
        rangeSelection.focus.set(lastNode.getKey(), 0, 'element');
      }
      $setSelection(rangeSelection);
    });
  };

  const handleUpdateComment = async (commentId: string, updatedComment: string): Promise<void> => {
    if (commentId) {
      try {
        await dispatch(updateComment(commentId, updatedComment));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUpdateCommentFromEditor = (): void => {
    const editorState = JSON.stringify(editor.getEditorState());
    if (commentId && handleUpdateComment) {
      handleUpdateComment(commentId, editorState);
      closeUpdateComment();
      editor.setEditable(false);
      setIsEditable(false);
    }
  };

  const handleCancelCommentUpdate = (): void => {
    if (initialState) {
      const resetState = editor.parseEditorState(initialState);
      editor.setEditorState(resetState);
      editor.setEditable(false);
      setIsEditable(false);
    }
    closeUpdateComment();
  };

  //Delete Comment Logic
  const handleDeleteComment = (): void => {
    const imageKeys = getImageKeysFromEditor();
    try {
      dispatch(deleteComment(commentId, imageKeys));
    } catch (error) {}
  };

  //Upload File to Server
  const uploadImageToServer = async (file: File): Promise<ImageDataObject> => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_SERVER}/uploads/image/create`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const imageData = {
        imageURL: response.data.url,
        imageKey: response.data.fileKey,
      };
      return imageData;
    } catch (error) {
      console.error('Error uploading file', error);
      throw error;
    }
  };

  const getImageKeysFromEditor = (): string[] => {
    const imageKeys = [];

    const nodeMap = editor.getEditorState()._nodeMap;
    //destructuring _nodeMap nodes, but keys would trigger unused var, so it's ommited.
    for (const [, value] of nodeMap) {
      if (value.__type === 'image') {
        imageKeys.push(value.__key);
      }
    }
    return imageKeys;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files ? event.target.files[0] : null;
    const imagesUploaded = getImageKeysFromEditor().length;
    if (!file) return;
    if (imagesUploaded > 5) {
      setMediaError({ ...mediaError, imageUploadsExceeded: true });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setMediaError({ ...mediaError, fileSizeExceeded: true });
      return;
    }

    if (mediaError.fileSizeExceeded || mediaError.imageUploadsExceeded)
      setMediaError({ imageUploadsExceeded: false, fileSizeExceeded: false });

    try {
      const imageData: ImageDataObject = await uploadImageToServer(file);
      insertImageInEditor(imageData);
      setUploadedMedia({
        ...uploadedMedia,
        [imageData.imageKey]: imageData.imageKey,
      });
    } catch (error) {
      console.error('Error uploading file', error);
      throw error;
    }
  };

  const insertImageInEditor = (imageData: ImageDataObject): void => {
    if (!imageData) return;

    editor.update(() => {
      const root = $getRoot();
      const imageNode = $createImageNode(imageData.imageURL, 'uploaded image', imageData.imageKey);

      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection?.insertNodes([imageNode]);
      } else {
        root.append(imageNode);
      }
    });
  };

  //Display Comment Date Logic
  const commentCreatedDate = new Date(commentDate || Date.now());

  const currentDateData = new Date();

  const setTimeDisplay = (): void => {
    setMinutesAgo(() => {
      const minutesAgo = differenceInMinutes(currentDateData, commentCreatedDate);
      return minutesAgo;
    });
    setHoursAgo(() => {
      const hoursAgo = differenceInHours(currentDateData, commentCreatedDate);
      return hoursAgo;
    });
  };

  const display = (): string | null => {
    if (Number.isNaN(commentCreatedDate.getTime())) {
      console.error(`Invalid commentDate: ${commentDate}`);
      return null;
    }
    if (minutesAgo < 1 && hoursAgo === 0) {
      return 'Just Now';
    }
    if (minutesAgo < 60 && hoursAgo === 0) {
      return `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
    }
    if (hoursAgo < 24) {
      return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
    }
    return format(commentCreatedDate, 'dd MMM yyyy');
  };

  useEffect(() => {
    setTimeDisplay();
    const minuteInterval = setInterval(() => {
      setTimeDisplay();
    }, 6000);
    return () => {
      setMinutesAgo(0);
      setHoursAgo(0);
      clearInterval(minuteInterval);
    };
  }, []);

  const contextValue = {
    closeUpdateComment,
    openEditMenu,
    toggleToolbar,
    handleShowConfirmDeleteDropdown,
    handleCreateCommentFromEditor,
    handleEditAndDropdown,
    handleShowEditDeleteDropdown,
    handleUpdateCommentFromEditor,
    handleCancelCommentUpdate,
    handleDeleteComment,
    handleImageUpload,
    setTimeDisplay,
    display,
    userId,
    authorId,
    commentId,
    commentDate,
    initialState,
    placeholderText,
    showToolbar,
    showEditMenu,
    showEditDeleteDropdown,
    showConfirmDeleteDropdown,
    mediaError,
    isEditable,
    ...props,
  };

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
};
