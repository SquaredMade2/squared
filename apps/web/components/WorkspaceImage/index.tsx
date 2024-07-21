import type { WorkspaceImageProps } from '@/components/WorkspaceImage/WorkspaceImage.interfaces';
// Throws jest error with absolute importws
import { getInitials } from '../../utils/formatting';

const styles = {
  workspaceSettings:
    'flex  items-center justify-center w-16 h-16  mb-10 mt-5 text-xl rounded text-white',
  workspaceMenu: 'flex items-center justify-center w-5 h-5 text-xxs rounded mr-2 text-white',
  workspaceList:
    'flex items-center justify-center w-5 h-5 text-xxs rounded mr-2 text-white font-normal',
};

const colors = [
  'bg-green-600',
  'bg-red-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-gray-500',
  'bg-red-400',
  'bg-yellow-400',
  'bg-green-500',
  'bg-blue-400',
  'bg-indigo-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-red-600',
  'bg-yellow-600',
  'bg-green-700',
  'bg-blue-600',
  'bg-indigo-600',
];
const WorkspaceInitials = ({ workspaceName, backgroundColor, location }: WorkspaceImageProps) => {
  const getStyle = () => {
    switch (location) {
      case 'workspaceList':
        return styles.workspaceList;
      case 'workspaceMenu':
        return styles.workspaceMenu;
      case 'workspaceSettings':
        return styles.workspaceSettings;
      default:
        return '';
    }
  };

  return (
    <div className={`${getStyle()} ${colors[backgroundColor]}`}>{getInitials(workspaceName)}</div>
  );
};

export default WorkspaceInitials;
