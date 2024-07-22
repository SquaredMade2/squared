export type EffortEstimateDropdownProps = {
  location: string;
  showIcon(estimate: number): React.ReactNode;
  handleButtonClick: () => void;
  handleClickAway: () => void;
};

export type Params = {
  taskId: string;
};
