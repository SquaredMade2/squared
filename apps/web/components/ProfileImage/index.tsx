import type { ProfileImageProps } from '@/components/ProfileImage/ProfileImage.interfaces';
import { getInitials } from '@/utils/formatting';

const styles = {
  settings:
    'h-40 w-40 rounded-full bg-purpleButtonHover mb-6 flex items-center justify-center text-white text-7xl',
  dropdownMenu:
    'h-6 w-6 rounded-full bg-purpleButtonHover flex items-center justify-center text-white text-xxs',
  user: 'flex items-center justify-center bg-purpleButtonHover rounded-full p-2 mt-3 mr-3 w-6 h-6 text-white text-xxs',
  taskCard:
    'absolute right-4 top-4 h-5 w-5 rounded-full bg-purpleButtonHover flex items-center justify-center text-white text-tiny',
  assigneeDropdown:
    'h-5 w-5 mx-1 mr-2 rounded-full bg-purpleButtonHover flex items-center justify-center text-white text-tiny my-2',
  activityItem:
    'h-5 w-5 mx-1 mr-2 rounded-full bg-purpleButtonHover flex items-center justify-center text-white text-tiny my-2',
};

const ProfileImage = ({ profileName, location }: ProfileImageProps) => {
  const getStyle = (): string => {
    switch (location) {
      case 'settings':
        return styles.settings;
      case 'dropdownMenu':
        return styles.dropdownMenu;
      case 'comment':
        return styles.user;
      case 'taskCard':
        return styles.taskCard;
      case 'assigneeDropdown':
        return styles.assigneeDropdown;
      case 'activityItem':
        return styles.activityItem;
      default:
        return '';
    }
  };
  return <div className={getStyle()}>{getInitials(profileName)}</div>;
};

export default ProfileImage;
