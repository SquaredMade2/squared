import React from 'react';
import Link from 'next/link';
import ButtonIcon from '../ButtonIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';

const expandIcon = <FontAwesomeIcon icon={faExpand} />;

const Expand = () => {
  const taskId = useAppSelector((state) => state.currentTask.currentTaskId);
  const url = `${process.env.NEXT_PUBLIC_URL}/tasks/${taskId}`;
  return (
    <Link href={url}>
      <ButtonIcon
        icon={expandIcon}
        tooltipLabel="Expand"
        labelPosition="left"
        hoverBg="bg-accent"
      />
    </Link>
  );
};

export default Expand;
