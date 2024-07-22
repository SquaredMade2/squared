import React from 'react';
import ButtonIcon from '../ButtonIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const favIcon = <FontAwesomeIcon icon={faStar} />;

const FavNotification = () => {
	return (
		<ButtonIcon
			icon={favIcon}
			tooltipLabel="Star"
			labelPosition="left"
			hoverBg="bg-accent"
		/>
	);
};

export default FavNotification;
