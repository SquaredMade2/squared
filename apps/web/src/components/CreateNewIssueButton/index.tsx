import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import type { CreateNewIssueButtonProps } from './CreateNewIssueButton.interfaces';

const styles = {
  buttonDark:
    'w-24 bg-blueButton cursor-pointer text-white text-xs font-bold py-2 px-2.5 rounded-md mr-5 mt-2.5 mb-2.5 transition ease-out duration-200',
  buttonLight:
    'w-24 bg-blueButton cursor-pointer text-white text-xs font-bold py-2 px-2.5 rounded-md mr-5 mt-2.5 mb-2.5 transition ease-out duration-200',
};

const CreateNewIssueButton = ({ handleCreateIssue }: CreateNewIssueButtonProps) => {
  const theme = useSelector((state: RootState) => state.userSettings.theme);

  return (
    <button
      type="button"
      className={`${theme === 'light' ? styles.buttonLight : styles.buttonDark}`}
      onClick={handleCreateIssue}
    >
      Create Issue
    </button>
  );
};

export default CreateNewIssueButton;
