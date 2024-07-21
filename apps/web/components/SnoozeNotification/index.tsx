import React from 'react';
import ButtonIcon from '../ButtonIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const snoozeIcon = <FontAwesomeIcon icon={faClock} />;

const SnoozeNotification = () => {
	return (
		<ButtonIcon
			icon={snoozeIcon}
			tooltipLabel="Snooze Notification"
			labelPosition="left"
			hoverBg="bg-accent"
		/>
	);
};

export default SnoozeNotification;
