import type { ReactNode } from 'react';

type MediaErrorObject = {
  imageUploadsExceeded: boolean;
  fileSizeExceeded: boolean;
};

export type EditorProviderProps = {
  children: ReactNode;
  authorId?: string;
  commentId: string;
  userId: string;
  userName: string;
  commentsTaskId?: string;
  commentDate?: string;
  initialState?: string;
  placeholderText?: string;
};

export type EditorContextType = {
  closeUpdateComment: () => void;
  openEditMenu: () => void;
  toggleToolbar: () => void;
  handleShowConfirmDeleteDropdown: () => void;
  handleCreateCommentFromEditor?: () => void;
  handleEditAndDropdown: () => void;
  handleShowEditDeleteDropdown: () => void;
  handleUpdateCommentFromEditor?: () => void;
  handleCancelCommentUpdate: () => void;
  handleDeleteComment: () => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  setTimeDisplay: () => void;
  display: () => string | null;
  authorId?: string;
  userId: string;
  commentId: string | '0';
  commentDate?: string;
  userName: string;
  initialState?: string;
  placeholderText?: string;
  showToolbar: boolean;
  showEditMenu: boolean;
  showEditDeleteDropdown: boolean;
  showConfirmDeleteDropdown: boolean;
  mediaError: MediaErrorObject;
  isEditable: boolean;
};
