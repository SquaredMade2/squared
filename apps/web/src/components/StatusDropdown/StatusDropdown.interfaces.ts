export interface StatusDropdownProps {
  location: string;
  handleButtonClick: () => void;
  handleClickAway: () => void;
  showIcon(name: string): React.ReactNode;
}
