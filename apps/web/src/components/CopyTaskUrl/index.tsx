import type { FC } from 'react';
import ButtonIcon from '../ButtonIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

const CopyTaskUrl: FC<{ copyUrl: () => void }> = ({ copyUrl }) => {
  const HotKeys = () => {
    return (
      <>
        <span className="flex border px-1 rounded">Ctr</span>
        <span className="flex border px-1 rounded">Shift</span>
        <span className="flex items-center justify-center border px-1 rounded">,</span>
      </>
    );
  };

  return (
    <ButtonIcon
      icon={<FontAwesomeIcon icon={faLink} />}
      hoverBg="bg-accent"
      handleClick={copyUrl}
      tooltipLabel="Copy Task URL"
      labelPosition="left"
    >
      <HotKeys />
    </ButtonIcon>
  );
};

export default CopyTaskUrl;
