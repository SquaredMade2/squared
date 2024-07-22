import React from 'react';
import ButtonIcon from '../ButtonIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBellSlash } from '@fortawesome/free-solid-svg-icons';

const unsubscribeIcon = <FontAwesomeIcon icon={faBellSlash} />;

const UnsubscribeNotification = () => {
	return (
		<ButtonIcon
			icon={unsubscribeIcon}
			tooltipLabel="Unsubscribe"
			labelPosition="left"
			hoverBg="bg-accent"
		/>
	);
};

export default UnsubscribeNotification;
