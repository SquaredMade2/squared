import type { FC } from 'react';
import ButtonIcon from '../ButtonIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const CopyTaskId: FC<{ copyTaskId: () => void }> = ({ copyTaskId }) => {
  const HotKeys = () => {
    return (
      <>
        <span className="flex border px-1 rounded">Ctr</span>

        <span className="flex items-center justify-center border px-1 rounded">.</span>
      </>
    );
  };

  return (
    <ButtonIcon
      icon={<FontAwesomeIcon icon={faCopy} />}
      hoverBg="bg-accent"
      handleClick={copyTaskId}
      tooltipLabel="Copy Task Id"
      labelPosition="left"
    >
      <HotKeys />
    </ButtonIcon>
  );
};

export default CopyTaskId;
