export interface Comment {
  _id: string;
  comment: string;
  author: string;
  date: string;
  task: string;
}

export interface NewComment {
  comment: string | null;
  author: string;
  task: string;
}

export interface Comments {
  taskPageCommentData: Comment[] | [];
  isLoading: boolean;
  isError: boolean;
}

export type Params = {
  taskId: string;
};
