export type PriorityDropdownProps = {
  location: string;
  handleButtonClick: () => void;
  handleClickAway: () => void;
  showIcon(name: string): React.ReactNode;
  // new entry; not sure why this is prop in React Dev Tools
};

export type Params = {
  taskId: string;
};
