import React from 'react';
import ButtonIcon from '../ButtonIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const deleteIcon = <FontAwesomeIcon icon={faTrashCan} />;

const DeleteNotification = () => {
	return (
		<ButtonIcon
			icon={deleteIcon}
			tooltipLabel="Delete notification"
			labelPosition="left"
			hoverBg="bg-accent"
		/>
	);
};

export default DeleteNotification;
