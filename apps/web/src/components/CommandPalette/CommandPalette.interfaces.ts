interface TaskDataType {
  taskList: Array<unknown>;
}

export interface MiniStateType {
  isCmdPalette: boolean;
  taskData: TaskDataType;
}
