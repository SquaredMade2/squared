import type { FC } from 'react';
import ButtonIcon from '../ButtonIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';

const CopyGitBranchName: FC<{ copyGitBranchName: () => void }> = ({ copyGitBranchName }) => {
  const HotKeys = () => {
    return (
      <>
        <span className="flex border px-1 rounded">Ctr</span>
        <span className="flex border px-1 rounded">Shift</span>
        <span className="flex items-center justify-center border px-1 rounded">.</span>
      </>
    );
  };

  return (
    <ButtonIcon
      icon={<FontAwesomeIcon icon={faCodeBranch} />}
      hoverBg="bg-accent"
      handleClick={copyGitBranchName}
      tooltipLabel="Copy git branch name"
      labelPosition="left"
    >
      <HotKeys />
    </ButtonIcon>
  );
};

export default CopyGitBranchName;
