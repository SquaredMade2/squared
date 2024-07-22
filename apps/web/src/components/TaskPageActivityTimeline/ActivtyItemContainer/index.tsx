import React from 'react';
import UpdatedByInformation from '../UpdatedByInformation';
import CreatedByInformation from '../CreatedByInformation';

const styles = {
  container: 'flex flex-col bg-card rounded-md text-sm',
};

const ActivityItemContainer = () => {
  return (
    <div className={styles.container}>
      <CreatedByInformation />
      <UpdatedByInformation />
    </div>
  );
};

export default ActivityItemContainer;
